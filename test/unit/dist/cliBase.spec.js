"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for CLIBase.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const defaultLogger_1 = require("unitejs-framework/dist/loggers/defaultLogger");
const cliBase_1 = require("../../../dist/cliBase");
const commandLineParser_1 = require("../../../dist/commandLineParser");
const fileSystem_1 = require("../../../dist/fileSystem");
const webSecureClient_1 = require("../../../dist/webSecureClient");
class TestCLI extends cliBase_1.CLIBase {
    constructor() {
        super("MyApp");
        this._newVersion = "";
    }
    setPackageDetails(name, version) {
        super._packageName = name;
        super._packageVersion = version;
    }
    setNewVersion(newVersion) {
        this._newVersion = newVersion;
    }
    initialise(logger, fileSystem) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return this.initialiseFail ? 1 : _super("initialise").call(this, logger, fileSystem);
        });
    }
    handleCustomCommand(logger, fileSystem, commandLineParser) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = -1;
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
        });
    }
    displayHelp(logger) {
        this.markdownTableToCli(logger, undefined);
        this.markdownTableToCli(logger, "| packageName | plain text | Name to be used for your package |");
        this.markdownTableToCli(logger, "|             |            | Other info                       |");
        return 0;
    }
    checkVersion(client) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(false);
        });
    }
    testCheckVersion(client) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("checkVersion").call(this, client);
        });
    }
}
describe("CLIBase", () => {
    let sandbox;
    let defaultLoggerStub;
    let loggerStub;
    let loggerErrorSpy;
    let logMessages;
    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        defaultLoggerStub = sandbox.stub(defaultLogger_1.DefaultLogger, "log");
        loggerStub = {};
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
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        const fs = new fileSystem_1.FileSystem();
        yield fs.directoryDelete("test/unit/temp/");
    }));
    it("can be created", () => {
        const obj = new TestCLI();
        Chai.should().exist(obj);
    });
    describe("run", () => {
        it("can be called with no process", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run(undefined);
            Chai.expect(result).to.equal(1);
        }));
        it("can be called with process and no argv", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({});
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[0]).to.contain("no interpreter");
        }));
        it("can be called with process and argv interpreter", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[0]).to.contain("no script");
        }));
        it("can be called with process and argv interpreter, misplaced script and bad command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "script.js", "help", "-noColor"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[0]).to.contain("badly formed");
        }));
        it("can be called with process and argv interpreter, misplaced script and not existing log file", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "script.js", "help", "--logFile=test/unit/temp/test.txt"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages.length).to.equal(5);
        }));
        it("can be called with process and argv interpreter, misplaced script and existing log folder", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const fs = new fileSystem_1.FileSystem();
            yield fs.directoryCreate("test/unit/temp/");
            const result = yield obj.run({ argv: ["node", "script.js", "help", "--logFile=test/unit/temp/test.txt"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages.length).to.equal(5);
        }));
        it("can be called with help command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "help", "--disableVersionCheck"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages[1]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(5);
        }));
        it("can be called with help command with remaining args", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "help", "--someArg"] });
            Chai.expect(result).to.equal(1);
        }));
        it("can be called with help command with no color", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "help", "--noColor"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages[1]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(6);
        }));
        it("can be called with version command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "version"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(1);
        }));
        it("can be called with version command with no color", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "version", "--noColor"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(1);
        }));
        it("can be called with initialise failing", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            obj.initialiseFail = true;
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "exception"] });
            Chai.expect(result).to.equal(1);
        }));
        it("can be called with exception command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "exception"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 2]).to.contain("Unhandled");
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("kaboom");
        }));
        it("can be called with missing command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("No command");
        }));
        it("can be called with unknown command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "unknown"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("unknown");
        }));
        it("can be called with failed command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "fail"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("fail");
        }));
        it("can throw exception before logging is created", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            sandbox.stub(commandLineParser_1.CommandLineParser.prototype, "parse").throws("error");
            const result = yield obj.run(undefined);
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("error occurred");
        }));
    });
    describe("run", () => {
        it("can fail when args are remaining", () => {
            const obj = new TestCLI();
            const commandLineParser = new commandLineParser_1.CommandLineParser();
            commandLineParser.parse(["node", "script", "--arg1=fred"]);
            const result = obj.checkRemaining(loggerStub, commandLineParser);
            Chai.expect(result).to.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Unrecognized arguments");
        });
    });
    describe("checkVersion", () => {
        it("no new version with no package information", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(undefined);
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        }));
        it("no new version with no response", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(undefined);
            yield obj.run({ argv: ["node", "./bin/script.js", "help"] });
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        }));
        it("no new version with empty response", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({}));
            yield obj.run({ argv: ["node", "./bin/script.js", "help"] });
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        }));
        it("no new version with invalid reponse", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "1" }));
            yield obj.run({ argv: ["node", "./bin/script.js", "help"] });
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        }));
        it("no new version with valid reponse major older", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.0");
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "1.0.0" }));
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        }));
        it("no new version with valid reponse major newer", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.0");
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "3.0.0" }));
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(true);
        }));
        it("no new version with valid reponse minor older", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.1.0");
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "2.0.0" }));
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        }));
        it("no new version with valid reponse minor newer", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.0");
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "2.1.0" }));
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(true);
        }));
        it("no new version with valid reponse patch older", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.1");
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "2.0.0" }));
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(false);
        }));
        it("no new version with valid reponse patch newer", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            obj.setPackageDetails("p", "2.0.0");
            const clientStub = new webSecureClient_1.WebSecureClient();
            sandbox.stub(clientStub, "getText").resolves(JSON.stringify({ version: "2.0.1" }));
            const result = yield obj.testCheckVersion(clientStub);
            Chai.expect(result).to.equal(true);
        }));
        it("can wait for version to complete with no new version", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            obj.setNewVersion(undefined);
            setTimeout(() => {
                obj.setNewVersion("");
            }, 100);
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "help"] });
            Chai.expect(result).to.equal(0);
        }));
        it("can wait for version to complete with new version", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            obj.setNewVersion(undefined);
            setTimeout(() => {
                obj.setNewVersion("1.0.0");
            }, 100);
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "help"] });
            Chai.expect(result).to.equal(0);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY2xpQmFzZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFHL0IsZ0ZBQTZFO0FBQzdFLGtEQUErQztBQUMvQyxzRUFBbUU7QUFDbkUsd0RBQXFEO0FBQ3JELGtFQUErRDtBQUUvRCxNQUFNLE9BQVEsU0FBUSxpQkFBTztJQUd6QjtRQUNJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsT0FBZTtRQUNsRCxLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUMxQixLQUFLLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztJQUNwQyxDQUFDO0lBRU0sYUFBYSxDQUFDLFVBQWtCO1FBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUFFLFVBQXVCOzs7WUFDNUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFnQixZQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMxRSxDQUFDO0tBQUE7SUFFWSxtQkFBbUIsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxpQkFBb0M7O1lBQzNHLElBQUksR0FBRyxHQUFXLENBQUMsQ0FBQyxDQUFDO1lBRXJCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRS9DLFFBQVEsT0FBTyxFQUFFO2dCQUNiLEtBQUssTUFBTSxDQUFDLENBQUM7b0JBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUNqQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNSLE1BQU07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QUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLEdBQVMsRUFBRTtZQUMvRCxNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDQSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLENBQUMsRUFDRixHQUFHLENBQUMsQ0FBQztZQUNoQixNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sQ0FBRSxFQUFDLENBQUMsQ0FBQztZQUM3RixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY2xpQmFzZS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgQ0xJQmFzZS5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IERlZmF1bHRMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9sb2dnZXJzL2RlZmF1bHRMb2dnZXJcIjtcbmltcG9ydCB7IENMSUJhc2UgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2NsaUJhc2VcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lUGFyc2VyIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9jb21tYW5kTGluZVBhcnNlclwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvZmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgV2ViU2VjdXJlQ2xpZW50IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy93ZWJTZWN1cmVDbGllbnRcIjtcblxuY2xhc3MgVGVzdENMSSBleHRlbmRzIENMSUJhc2Uge1xuICAgIHB1YmxpYyBpbml0aWFsaXNlRmFpbDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk15QXBwXCIpO1xuICAgICAgICB0aGlzLl9uZXdWZXJzaW9uID0gXCJcIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0UGFja2FnZURldGFpbHMobmFtZTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuX3BhY2thZ2VOYW1lID0gbmFtZTtcbiAgICAgICAgc3VwZXIuX3BhY2thZ2VWZXJzaW9uID0gdmVyc2lvbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TmV3VmVyc2lvbihuZXdWZXJzaW9uOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuX25ld1ZlcnNpb24gPSBuZXdWZXJzaW9uO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0pIDogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbGlzZUZhaWwgPyAxIDogc3VwZXIuaW5pdGlhbGlzZShsb2dnZXIsIGZpbGVTeXN0ZW0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBoYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQ6IG51bWJlciA9IC0xO1xuXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBjb21tYW5kTGluZVBhcnNlci5nZXRDb21tYW5kKCk7XG5cbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XG4gICAgICAgICAgICBjYXNlIFwiZmFpbFwiOiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiU29tZXRoaW5nIGZhaWxlZFwiKTtcbiAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcImV4Y2VwdGlvblwiOiB0aHJvdyBuZXcgRXJyb3IoXCJrYWJvb21cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBkaXNwbGF5SGVscChsb2dnZXI6IElMb2dnZXIpOiBudW1iZXIge1xuICAgICAgICB0aGlzLm1hcmtkb3duVGFibGVUb0NsaShsb2dnZXIsIHVuZGVmaW5lZCk7XG4gICAgICAgIHRoaXMubWFya2Rvd25UYWJsZVRvQ2xpKGxvZ2dlciwgXCJ8IHBhY2thZ2VOYW1lIHwgcGxhaW4gdGV4dCB8IE5hbWUgdG8gYmUgdXNlZCBmb3IgeW91ciBwYWNrYWdlIHxcIik7XG4gICAgICAgIHRoaXMubWFya2Rvd25UYWJsZVRvQ2xpKGxvZ2dlciwgXCJ8ICAgICAgICAgICAgIHwgICAgICAgICAgICB8IE90aGVyIGluZm8gICAgICAgICAgICAgICAgICAgICAgIHxcIik7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjaGVja1ZlcnNpb24oY2xpZW50OiBXZWJTZWN1cmVDbGllbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHRlc3RDaGVja1ZlcnNpb24oY2xpZW50OiBXZWJTZWN1cmVDbGllbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNoZWNrVmVyc2lvbihjbGllbnQpO1xuICAgIH1cbn1cblxuZGVzY3JpYmUoXCJDTElCYXNlXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBkZWZhdWx0TG9nZ2VyU3R1YjogU2lub24uU2lub25TdHViO1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBsb2dnZXJFcnJvclNweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ01lc3NhZ2VzOiBzdHJpbmdbXTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uY3JlYXRlU2FuZGJveCgpO1xuICAgICAgICBkZWZhdWx0TG9nZ2VyU3R1YiA9IHNhbmRib3guc3R1YihEZWZhdWx0TG9nZ2VyLCBcImxvZ1wiKTtcblxuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuYmFubmVyID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIud2FybmluZyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcblxuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG5cbiAgICAgICAgbG9nTWVzc2FnZXMgPSBbXTtcbiAgICAgICAgZGVmYXVsdExvZ2dlclN0dWIuY2FsbHNGYWtlKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICBsb2dNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgICAgICBjb25zdCBmcyA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgIGF3YWl0IGZzLmRpcmVjdG9yeURlbGV0ZShcInRlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInJ1blwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vIHByb2Nlc3NcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4odW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHByb2Nlc3MgYW5kIG5vIGFyZ3ZcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnt9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIm5vIGludGVycHJldGVyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwcm9jZXNzIGFuZCBhcmd2IGludGVycHJldGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzBdKS50by5jb250YWluKFwibm8gc2NyaXB0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwcm9jZXNzIGFuZCBhcmd2IGludGVycHJldGVyLCBtaXNwbGFjZWQgc2NyaXB0IGFuZCBiYWQgY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcInNjcmlwdC5qc1wiLCBcImhlbHBcIiwgXCItbm9Db2xvclwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcImJhZGx5IGZvcm1lZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcHJvY2VzcyBhbmQgYXJndiBpbnRlcnByZXRlciwgbWlzcGxhY2VkIHNjcmlwdCBhbmQgbm90IGV4aXN0aW5nIGxvZyBmaWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwic2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tbG9nRmlsZT10ZXN0L3VuaXQvdGVtcC90ZXN0LnR4dFwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIk15QXBwIENMSVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoNSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHByb2Nlc3MgYW5kIGFyZ3YgaW50ZXJwcmV0ZXIsIG1pc3BsYWNlZCBzY3JpcHQgYW5kIGV4aXN0aW5nIGxvZyBmb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IGZzID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IGZzLmRpcmVjdG9yeUNyZWF0ZShcInRlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCJzY3JpcHQuanNcIiwgXCJoZWxwXCIsIFwiLS1sb2dGaWxlPXRlc3QvdW5pdC90ZW1wL3Rlc3QudHh0XCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzBdKS50by5jb250YWluKFwiTXlBcHAgQ0xJXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXMubGVuZ3RoKS50by5lcXVhbCg1KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggaGVscCBjb21tYW5kXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tZGlzYWJsZVZlcnNpb25DaGVja1wiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIk15QXBwIENMSVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzFdKS50by5jb250YWluKFwidlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoNSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGhlbHAgY29tbWFuZCB3aXRoIHJlbWFpbmluZyBhcmdzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tc29tZUFyZ1wiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGhlbHAgY29tbWFuZCB3aXRoIG5vIGNvbG9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tbm9Db2xvclwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIk15QXBwIENMSVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzFdKS50by5jb250YWluKFwidlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoNik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHZlcnNpb24gY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcInZlcnNpb25cIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbMF0pLnRvLmNvbnRhaW4oXCJ2XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXMubGVuZ3RoKS50by5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdmVyc2lvbiBjb21tYW5kIHdpdGggbm8gY29sb3JcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJ2ZXJzaW9uXCIsIFwiLS1ub0NvbG9yXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzBdKS50by5jb250YWluKFwidlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGluaXRpYWxpc2UgZmFpbGluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgb2JqLmluaXRpYWxpc2VGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJleGNlcHRpb25cIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGNlcHRpb24gY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcImV4Y2VwdGlvblwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1tsb2dNZXNzYWdlcy5sZW5ndGggLSAyXSkudG8uY29udGFpbihcIlVuaGFuZGxlZFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzW2xvZ01lc3NhZ2VzLmxlbmd0aCAtIDFdKS50by5jb250YWluKFwia2Fib29tXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBtaXNzaW5nIGNvbW1hbmRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbbG9nTWVzc2FnZXMubGVuZ3RoIC0gMV0pLnRvLmNvbnRhaW4oXCJObyBjb21tYW5kXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmtub3duIGNvbW1hbmRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJ1bmtub3duXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzW2xvZ01lc3NhZ2VzLmxlbmd0aCAtIDFdKS50by5jb250YWluKFwidW5rbm93blwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZmFpbGVkIGNvbW1hbmRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJmYWlsXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzW2xvZ01lc3NhZ2VzLmxlbmd0aCAtIDFdKS50by5jb250YWluKFwiZmFpbFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gdGhyb3cgZXhjZXB0aW9uIGJlZm9yZSBsb2dnaW5nIGlzIGNyZWF0ZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihDb21tYW5kTGluZVBhcnNlci5wcm90b3R5cGUsIFwicGFyc2VcIikudGhyb3dzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbbG9nTWVzc2FnZXMubGVuZ3RoIC0gMV0pLnRvLmNvbnRhaW4oXCJlcnJvciBvY2N1cnJlZFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInJ1blwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBhcmdzIGFyZSByZW1haW5pbmdcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRMaW5lUGFyc2VyID0gbmV3IENvbW1hbmRMaW5lUGFyc2VyKCk7XG4gICAgICAgICAgICBjb21tYW5kTGluZVBhcnNlci5wYXJzZShbXCJub2RlXCIsIFwic2NyaXB0XCIsIFwiLS1hcmcxPWZyZWRcIl0pO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gb2JqLmNoZWNrUmVtYWluaW5nKGxvZ2dlclN0dWIsIGNvbW1hbmRMaW5lUGFyc2VyKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiVW5yZWNvZ25pemVkIGFyZ3VtZW50c1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNoZWNrVmVyc2lvblwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwibm8gbmV3IHZlcnNpb24gd2l0aCBubyBwYWNrYWdlIGluZm9ybWF0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCBjbGllbnRTdHViOiBXZWJTZWN1cmVDbGllbnQgPSBuZXcgV2ViU2VjdXJlQ2xpZW50KCk7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoY2xpZW50U3R1YiwgXCJnZXRUZXh0XCIpLnJlc29sdmVzKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoudGVzdENoZWNrVmVyc2lvbihjbGllbnRTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcIm5vIG5ldyB2ZXJzaW9uIHdpdGggbm8gcmVzcG9uc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXModW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJoZWxwXCIgXX0pO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnRlc3RDaGVja1ZlcnNpb24oY2xpZW50U3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJubyBuZXcgdmVyc2lvbiB3aXRoIGVtcHR5IHJlc3BvbnNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCBjbGllbnRTdHViOiBXZWJTZWN1cmVDbGllbnQgPSBuZXcgV2ViU2VjdXJlQ2xpZW50KCk7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoY2xpZW50U3R1YiwgXCJnZXRUZXh0XCIpLnJlc29sdmVzKEpTT04uc3RyaW5naWZ5KHt9KSk7XG4gICAgICAgICAgICBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiIF19KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai50ZXN0Q2hlY2tWZXJzaW9uKGNsaWVudFN0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwibm8gbmV3IHZlcnNpb24gd2l0aCBpbnZhbGlkIHJlcG9uc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXMoSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjFcIn0pKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJoZWxwXCIgXX0pO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnRlc3RDaGVja1ZlcnNpb24oY2xpZW50U3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJubyBuZXcgdmVyc2lvbiB3aXRoIHZhbGlkIHJlcG9uc2UgbWFqb3Igb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIG9iai5zZXRQYWNrYWdlRGV0YWlscyhcInBcIiwgXCIyLjAuMFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXMoSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjEuMC4wXCJ9KSk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoudGVzdENoZWNrVmVyc2lvbihjbGllbnRTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcIm5vIG5ldyB2ZXJzaW9uIHdpdGggdmFsaWQgcmVwb25zZSBtYWpvciBuZXdlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgb2JqLnNldFBhY2thZ2VEZXRhaWxzKFwicFwiLCBcIjIuMC4wXCIpO1xuICAgICAgICAgICAgY29uc3QgY2xpZW50U3R1YjogV2ViU2VjdXJlQ2xpZW50ID0gbmV3IFdlYlNlY3VyZUNsaWVudCgpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGNsaWVudFN0dWIsIFwiZ2V0VGV4dFwiKS5yZXNvbHZlcyhKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IFwiMy4wLjBcIn0pKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai50ZXN0Q2hlY2tWZXJzaW9uKGNsaWVudFN0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJubyBuZXcgdmVyc2lvbiB3aXRoIHZhbGlkIHJlcG9uc2UgbWlub3Igb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIG9iai5zZXRQYWNrYWdlRGV0YWlscyhcInBcIiwgXCIyLjEuMFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXMoSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjIuMC4wXCJ9KSk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoudGVzdENoZWNrVmVyc2lvbihjbGllbnRTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcIm5vIG5ldyB2ZXJzaW9uIHdpdGggdmFsaWQgcmVwb25zZSBtaW5vciBuZXdlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgb2JqLnNldFBhY2thZ2VEZXRhaWxzKFwicFwiLCBcIjIuMC4wXCIpO1xuICAgICAgICAgICAgY29uc3QgY2xpZW50U3R1YjogV2ViU2VjdXJlQ2xpZW50ID0gbmV3IFdlYlNlY3VyZUNsaWVudCgpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGNsaWVudFN0dWIsIFwiZ2V0VGV4dFwiKS5yZXNvbHZlcyhKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IFwiMi4xLjBcIn0pKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai50ZXN0Q2hlY2tWZXJzaW9uKGNsaWVudFN0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJubyBuZXcgdmVyc2lvbiB3aXRoIHZhbGlkIHJlcG9uc2UgcGF0Y2ggb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIG9iai5zZXRQYWNrYWdlRGV0YWlscyhcInBcIiwgXCIyLjAuMVwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXMoSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjIuMC4wXCJ9KSk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoudGVzdENoZWNrVmVyc2lvbihjbGllbnRTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcIm5vIG5ldyB2ZXJzaW9uIHdpdGggdmFsaWQgcmVwb25zZSBwYXRjaCBuZXdlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgb2JqLnNldFBhY2thZ2VEZXRhaWxzKFwicFwiLCBcIjIuMC4wXCIpO1xuICAgICAgICAgICAgY29uc3QgY2xpZW50U3R1YjogV2ViU2VjdXJlQ2xpZW50ID0gbmV3IFdlYlNlY3VyZUNsaWVudCgpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGNsaWVudFN0dWIsIFwiZ2V0VGV4dFwiKS5yZXNvbHZlcyhKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IFwiMi4wLjFcIn0pKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai50ZXN0Q2hlY2tWZXJzaW9uKGNsaWVudFN0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gd2FpdCBmb3IgdmVyc2lvbiB0byBjb21wbGV0ZSB3aXRoIG5vIG5ldyB2ZXJzaW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBvYmouc2V0TmV3VmVyc2lvbih1bmRlZmluZWQpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNldE5ld1ZlcnNpb24oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAxMDApO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcImhlbHBcIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiB3YWl0IGZvciB2ZXJzaW9uIHRvIGNvbXBsZXRlIHdpdGggbmV3IHZlcnNpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIG9iai5zZXROZXdWZXJzaW9uKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2V0TmV3VmVyc2lvbihcIjEuMC4wXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgMTAwKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJoZWxwXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
