/**
 * Tests for CLIBase.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { CLIBase } from "../../../dist/cliBase";
import { CommandLineParser } from "../../../dist/commandLineParser";
import { FileSystem } from "../../../dist/fileSystem";

class TestCLI extends CLIBase {
    constructor() {
        super("MyApp");
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
}

describe("CLIBase", () => {
    let sandbox: Sinon.SinonSandbox;
    let originalConsoleLog: (message?: any, ...optionalParams: any[]) => void;
    let spiedConsoleLogMethod: Sinon.SinonSpy;
    let logMessages: string[];

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        originalConsoleLog = console.log;
        logMessages = [];
        console.log = (message?: any, ...optionalParams: any[]) => {
            if (message) {
                if (message.indexOf("@@@") < 0 && message.indexOf("ERROR: ") < 0) {
                    originalConsoleLog(message, ...optionalParams);
                } else {
                    logMessages.push(message);
                }
            } else {
                logMessages.push(message);
            }
        };
        spiedConsoleLogMethod = sandbox.spy(console, "log");
    });

    afterEach(async () => {
        sandbox.restore();
        console.log = originalConsoleLog;
        // const fs = new FileSystem();
        // await fs.directoryDelete("test/unit/temp/");
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
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "script.js", "help", "--logPrefix=@@@", "-noColor" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[0]).to.contain("badly formed");
        });

        it("can be called with process and argv interpreter, misplaced script and not existing log file", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "script.js", "help", "--logPrefix=@@@", "--logFile=test/unit/temp/test.txt" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages.length).to.equal(5);
        });

        it("can be called with process and argv interpreter, misplaced script and existing log folder", async () => {
            const obj = new TestCLI();
            const fs = new FileSystem();
            await fs.directoryCreate("test/unit/temp/");
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "script.js", "help", "--logPrefix=@@@", "--logFile=test/unit/temp/test.txt" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages.length).to.equal(5);
        });

        it("can be called with help command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help", "--logPrefix=@@@" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages[1]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(5);
        });

        it("can be called with help command with no color", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "help", "--noColor", "--logPrefix=@@@" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages[1]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(6);
        });

        it("can be called with version command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "version", "--logPrefix=@@@" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(1);
        });

        it("can be called with version command with no color", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "version", "--logPrefix=@@@", "--noColor" ]});
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(1);
        });

        it("can be called with exception command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "exception", "--logPrefix=@@@" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 2]).to.contain("Unhandled");
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("kaboom");
        });

        it("can be called with missing command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "--logPrefix=@@@" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("No command");
        });

        it("can be called with unknown command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "unknown", "--logPrefix=@@@" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("unknown");
        });

        it("can be called with failed command", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "fail", "--logPrefix=@@@" ]});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("fail");
        });

        it("can throw exception before logging is created", async () => {
            const obj = new TestCLI();
            const result = await obj.run(<NodeJS.Process>{ argv: [ "node", "./bin/script.js", "fail", "--logPrefix=@@@", "--logFile=?*?*?*/test.txt" ]});
            Chai.expect(result).to.equal(1);
        });
    });
});
