/**
 * Tests for CLIBase.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { DefaultLogger } from "unitejs-framework/dist/loggers/defaultLogger";
import { CLIBase } from "../../../src/cliBase";
import { CommandLineParser } from "../../../src/commandLineParser";
import { FileSystem } from "../../../src/fileSystem";
import { WebSecureClient } from "../../../src/webSecureClient";

class TestCLI extends CLIBase {
    public initialiseFail: boolean;

    constructor() {
        super("MyApp");
        this._newVersion = "";
    }

    public setPackageDetails(name: string, version: string): void {
        super._packageName = name;
        super._packageVersion = version;
    }

    public setNewVersion(newVersion: string) : void {
        this._newVersion = newVersion;
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem) : Promise<number> {
        return this.initialiseFail ? 1 : super.initialise(logger, fileSystem);
    }

    public async handleCustomCommand(logger: ILogger, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number> {
        let ret: number = -1;

        const command = commandLineParser.getCommand();

        switch (command) {
            case "fail": {
                logger.error("Something failed");
                ret = 1;
                break;
            }
            case "exception": throw new Error("kaboom");
        }

        return ret;
    }

    public displayHelp(logger: ILogger): number {
        this.markdownTableToCli(logger, undefined);
        this.markdownTableToCli(logger, "| packageName | plain text | Name to be used for your package |");
        this.markdownTableToCli(logger, "|             |            | Other info                       |");
        return 0;
    }

    public async checkVersion(client: WebSecureClient): Promise<boolean> {
        return Promise.resolve(false);
    }

    public async testCheckVersion(client: WebSecureClient): Promise<boolean> {
        return super.checkVersion(client);
    }
}

describe("CLIBase", () => {
    let sandbox: Sinon.SinonSandbox;
    let defaultLoggerStub: Sinon.SinonStub;
    let loggerStub: ILogger;
    let loggerErrorSpy: Sinon.SinonSpy;
    let logMessages: string[];

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        defaultLoggerStub = sandbox.stub(DefaultLogger, "log");

        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.warning = () => { };
        loggerStub.error = () => { };

        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        logMessages = [];
        defaultLoggerStub.callsFake((message) => {
            logMessages.push(message);
        });
    });

    afterEach(async () => {
        sandbox.restore();
        const fs = new FileSystem();
        await fs.directoryDelete("test/unit/temp/");
    });

    it("can be created", () => {
        const obj = new TestCLI();
        Chai.should().exist(obj);
    });

    describe("run", () => {
        it("can be called with no process", async () => {
            const obj = new TestCLI();
            const result = await obj.run(undefined);
            Chai.expect(result).to.equal(1);
        });

        it("can be called with process and no argv", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[0]).to.contain("no interpreter");
        });

        it("can be called with process and argv interpreter", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[0]).to.contain("no script");
        });

        it("can be called with process and argv interpreter, misplaced script and bad command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "script.js", "help", "-noColor" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[0]).to.contain("badly formed");
        });

        it("can be called with process and argv interpreter, misplaced script and not existing log file", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "script.js", "help", "--logFile=test/unit/temp/test.txt" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages.length).to.equal(5);
        });

        it("can be called with process and argv interpreter, misplaced script and existing log folder", async () => {
            const obj = new TestCLI();
            const fs = new FileSystem();
            await fs.directoryCreate("test/unit/temp/");
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "script.js", "help", "--logFile=test/unit/temp/test.txt" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages.length).to.equal(5);
        });

        it("can be called with help command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help", "--disableVersionCheck" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages[1]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(5);
        });

        it("can be called with help command with remaining args", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help", "--someArg" ]});
            Chai.expect(result).to.equal(1);
        });

        it("can be called with help command with no color", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help", "--noColor" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages[1]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(6);
        });

        it("can be called with version command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "version" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(1);
        });

        it("can be called with version command with no color", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "version", "--noColor" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(1);
        });

        it("can be called with initialise failing", async () => {
            const obj = new TestCLI();
            obj.initialiseFail = true;
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "exception" ]});
            Chai.expect(result).to.equal(1);
        });

        it("can be called with exception command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "exception" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 2]).to.contain("Unhandled");
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("kaboom");
        });

        it("can be called with missing command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("No command");
        });

        it("can be called with unknown command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "unknown" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("unknown");
        });

        it("can be called with failed command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "fail" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("fail");
        });

        it("can throw exception before logging is created", async () => {
            const obj = new TestCLI();
            sandbox.stub(CommandLineParser.prototype, "parse").throws("error");
            const result = await obj.run(undefined);
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("error occurred");
        });
    });

    describe("run", () => {
        it("can fail when args are remaining", () => {
            const obj = new TestCLI();
            const commandLineParser = new CommandLineParser();
            commandLineParser.parse(["node", "script", "--arg1=fred"]);
            const result = obj.checkRemaining(loggerStub, commandLineParser);
            Chai.expect(result).to.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Unrecognized arguments");
        });
    });

    describe("checkVersion", () => {
        it("no new version with no package information", async () => {
            const obj = new TestCLI();
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(undefined);
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        });

        it("no new version with no response", async () => {
            const obj = new TestCLI();
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(undefined);
            await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help" ]});
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        });

        it("no new version with empty response", async () => {
            const obj = new TestCLI();
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({}));
            await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help" ]});
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        });

        it("no new version with invalid reponse", async () => {
            const obj = new TestCLI();
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "1"}));
            await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help" ]});
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        });

        it("no new version with valid reponse major older", async () => {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.0");
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "1.0.0"}));
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        });

        it("no new version with valid reponse major newer", async () => {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.0");
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "3.0.0"}));
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(true);
        });

        it("no new version with valid reponse minor older", async () => {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.1.0");
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "2.0.0"}));
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        });

        it("no new version with valid reponse minor newer", async () => {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.0");
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "2.1.0"}));
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(true);
        });

        it("no new version with valid reponse patch older", async () => {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.1");
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "2.0.0"}));
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        });

        it("no new version with valid reponse patch newer", async () => {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.0");
            const clientStub: WebSecureClient = new WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "2.0.1"}));
            const result = await obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(true);
        });

        it("can wait for version to complete with no new version", async () => {
            const obj = new TestCLI();
            obj.setNewVersion(undefined);
            setTimeout(() => {
                            obj.setNewVersion("");
                        },
                       100);
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help" ]});
            Chai.expect(result).to.equal(0);
        });

        it("can wait for version to complete with new version", async () => {
            const obj = new TestCLI();
            obj.setNewVersion(undefined);
            setTimeout(() => {
                            obj.setNewVersion("1.0.0");
                        },
                       100);
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help" ]});
            Chai.expect(result).to.equal(0);
        });
    });
});
