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
        sandbox = Sinon.sandbox.create();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY2xpQmFzZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFHL0IsZ0ZBQTZFO0FBQzdFLGtEQUErQztBQUMvQyxzRUFBbUU7QUFDbkUsd0RBQXFEO0FBQ3JELGtFQUErRDtBQUUvRCxhQUFjLFNBQVEsaUJBQU87SUFHekI7UUFDSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRU0saUJBQWlCLENBQUMsSUFBWSxFQUFFLE9BQWU7UUFDbEQsS0FBSyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDMUIsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7SUFDcEMsQ0FBQztJQUVNLGFBQWEsQ0FBQyxVQUFrQjtRQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1Qjs7O1lBQzVELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDMUUsQ0FBQztLQUFBO0lBRVksbUJBQW1CLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsaUJBQW9DOztZQUMzRyxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUMsQ0FBQztZQUVyQixNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUUvQyxRQUFRLE9BQU8sRUFBRTtnQkFDYixLQUFLLE1BQU0sQ0FBQyxDQUFDO29CQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFDakMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDUixNQUFNO2lCQUNU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QUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbURBQW1ELEVBQUUsR0FBUyxFQUFFO1lBQy9ELE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7WUFDMUIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNBLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxFQUNGLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxDQUFFLEVBQUMsQ0FBQyxDQUFDO1lBQzdGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJjbGlCYXNlLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBDTElCYXNlLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRGVmYXVsdExvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2xvZ2dlcnMvZGVmYXVsdExvZ2dlclwiO1xuaW1wb3J0IHsgQ0xJQmFzZSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvY2xpQmFzZVwiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVQYXJzZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2NvbW1hbmRMaW5lUGFyc2VyXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9maWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBXZWJTZWN1cmVDbGllbnQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3dlYlNlY3VyZUNsaWVudFwiO1xuXG5jbGFzcyBUZXN0Q0xJIGV4dGVuZHMgQ0xJQmFzZSB7XG4gICAgcHVibGljIGluaXRpYWxpc2VGYWlsOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiTXlBcHBcIik7XG4gICAgICAgIHRoaXMuX25ld1ZlcnNpb24gPSBcIlwiO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRQYWNrYWdlRGV0YWlscyhuYW1lOiBzdHJpbmcsIHZlcnNpb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBzdXBlci5fcGFja2FnZU5hbWUgPSBuYW1lO1xuICAgICAgICBzdXBlci5fcGFja2FnZVZlcnNpb24gPSB2ZXJzaW9uO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXROZXdWZXJzaW9uKG5ld1ZlcnNpb246IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbmV3VmVyc2lvbiA9IG5ld1ZlcnNpb247XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSkgOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsaXNlRmFpbCA/IDEgOiBzdXBlci5pbml0aWFsaXNlKGxvZ2dlciwgZmlsZVN5c3RlbSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGhhbmRsZUN1c3RvbUNvbW1hbmQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldDogbnVtYmVyID0gLTE7XG5cbiAgICAgICAgY29uc3QgY29tbWFuZCA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldENvbW1hbmQoKTtcblxuICAgICAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICAgICAgICAgIGNhc2UgXCJmYWlsXCI6IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJTb21ldGhpbmcgZmFpbGVkXCIpO1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFwiZXhjZXB0aW9uXCI6IHRocm93IG5ldyBFcnJvcihcImthYm9vbVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGRpc3BsYXlIZWxwKGxvZ2dlcjogSUxvZ2dlcik6IG51bWJlciB7XG4gICAgICAgIHRoaXMubWFya2Rvd25UYWJsZVRvQ2xpKGxvZ2dlciwgdW5kZWZpbmVkKTtcbiAgICAgICAgdGhpcy5tYXJrZG93blRhYmxlVG9DbGkobG9nZ2VyLCBcInwgcGFja2FnZU5hbWUgfCBwbGFpbiB0ZXh0IHwgTmFtZSB0byBiZSB1c2VkIGZvciB5b3VyIHBhY2thZ2UgfFwiKTtcbiAgICAgICAgdGhpcy5tYXJrZG93blRhYmxlVG9DbGkobG9nZ2VyLCBcInwgICAgICAgICAgICAgfCAgICAgICAgICAgIHwgT3RoZXIgaW5mbyAgICAgICAgICAgICAgICAgICAgICAgfFwiKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNoZWNrVmVyc2lvbihjbGllbnQ6IFdlYlNlY3VyZUNsaWVudCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgdGVzdENoZWNrVmVyc2lvbihjbGllbnQ6IFdlYlNlY3VyZUNsaWVudCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuY2hlY2tWZXJzaW9uKGNsaWVudCk7XG4gICAgfVxufVxuXG5kZXNjcmliZShcIkNMSUJhc2VcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGRlZmF1bHRMb2dnZXJTdHViOiBTaW5vbi5TaW5vblN0dWI7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGxvZ2dlckVycm9yU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nTWVzc2FnZXM6IHN0cmluZ1tdO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBkZWZhdWx0TG9nZ2VyU3R1YiA9IHNhbmRib3guc3R1YihEZWZhdWx0TG9nZ2VyLCBcImxvZ1wiKTtcblxuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuYmFubmVyID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIud2FybmluZyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcblxuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG5cbiAgICAgICAgbG9nTWVzc2FnZXMgPSBbXTtcbiAgICAgICAgZGVmYXVsdExvZ2dlclN0dWIuY2FsbHNGYWtlKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICBsb2dNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgICAgICBjb25zdCBmcyA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgIGF3YWl0IGZzLmRpcmVjdG9yeURlbGV0ZShcInRlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInJ1blwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vIHByb2Nlc3NcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4odW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHByb2Nlc3MgYW5kIG5vIGFyZ3ZcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnt9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIm5vIGludGVycHJldGVyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwcm9jZXNzIGFuZCBhcmd2IGludGVycHJldGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzBdKS50by5jb250YWluKFwibm8gc2NyaXB0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwcm9jZXNzIGFuZCBhcmd2IGludGVycHJldGVyLCBtaXNwbGFjZWQgc2NyaXB0IGFuZCBiYWQgY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcInNjcmlwdC5qc1wiLCBcImhlbHBcIiwgXCItbm9Db2xvclwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcImJhZGx5IGZvcm1lZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcHJvY2VzcyBhbmQgYXJndiBpbnRlcnByZXRlciwgbWlzcGxhY2VkIHNjcmlwdCBhbmQgbm90IGV4aXN0aW5nIGxvZyBmaWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwic2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tbG9nRmlsZT10ZXN0L3VuaXQvdGVtcC90ZXN0LnR4dFwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIk15QXBwIENMSVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoNSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHByb2Nlc3MgYW5kIGFyZ3YgaW50ZXJwcmV0ZXIsIG1pc3BsYWNlZCBzY3JpcHQgYW5kIGV4aXN0aW5nIGxvZyBmb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IGZzID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IGZzLmRpcmVjdG9yeUNyZWF0ZShcInRlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCJzY3JpcHQuanNcIiwgXCJoZWxwXCIsIFwiLS1sb2dGaWxlPXRlc3QvdW5pdC90ZW1wL3Rlc3QudHh0XCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzBdKS50by5jb250YWluKFwiTXlBcHAgQ0xJXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXMubGVuZ3RoKS50by5lcXVhbCg1KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggaGVscCBjb21tYW5kXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tZGlzYWJsZVZlcnNpb25DaGVja1wiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIk15QXBwIENMSVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzFdKS50by5jb250YWluKFwidlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoNSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGhlbHAgY29tbWFuZCB3aXRoIHJlbWFpbmluZyBhcmdzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tc29tZUFyZ1wiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGhlbHAgY29tbWFuZCB3aXRoIG5vIGNvbG9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tbm9Db2xvclwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIk15QXBwIENMSVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzFdKS50by5jb250YWluKFwidlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoNik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHZlcnNpb24gY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcInZlcnNpb25cIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbMF0pLnRvLmNvbnRhaW4oXCJ2XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXMubGVuZ3RoKS50by5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdmVyc2lvbiBjb21tYW5kIHdpdGggbm8gY29sb3JcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJ2ZXJzaW9uXCIsIFwiLS1ub0NvbG9yXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzBdKS50by5jb250YWluKFwidlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGluaXRpYWxpc2UgZmFpbGluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgb2JqLmluaXRpYWxpc2VGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJleGNlcHRpb25cIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGNlcHRpb24gY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcImV4Y2VwdGlvblwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1tsb2dNZXNzYWdlcy5sZW5ndGggLSAyXSkudG8uY29udGFpbihcIlVuaGFuZGxlZFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzW2xvZ01lc3NhZ2VzLmxlbmd0aCAtIDFdKS50by5jb250YWluKFwia2Fib29tXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBtaXNzaW5nIGNvbW1hbmRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbbG9nTWVzc2FnZXMubGVuZ3RoIC0gMV0pLnRvLmNvbnRhaW4oXCJObyBjb21tYW5kXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmtub3duIGNvbW1hbmRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJ1bmtub3duXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzW2xvZ01lc3NhZ2VzLmxlbmd0aCAtIDFdKS50by5jb250YWluKFwidW5rbm93blwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZmFpbGVkIGNvbW1hbmRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJmYWlsXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzW2xvZ01lc3NhZ2VzLmxlbmd0aCAtIDFdKS50by5jb250YWluKFwiZmFpbFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gdGhyb3cgZXhjZXB0aW9uIGJlZm9yZSBsb2dnaW5nIGlzIGNyZWF0ZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihDb21tYW5kTGluZVBhcnNlci5wcm90b3R5cGUsIFwicGFyc2VcIikudGhyb3dzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbbG9nTWVzc2FnZXMubGVuZ3RoIC0gMV0pLnRvLmNvbnRhaW4oXCJlcnJvciBvY2N1cnJlZFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInJ1blwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBhcmdzIGFyZSByZW1haW5pbmdcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRMaW5lUGFyc2VyID0gbmV3IENvbW1hbmRMaW5lUGFyc2VyKCk7XG4gICAgICAgICAgICBjb21tYW5kTGluZVBhcnNlci5wYXJzZShbXCJub2RlXCIsIFwic2NyaXB0XCIsIFwiLS1hcmcxPWZyZWRcIl0pO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gb2JqLmNoZWNrUmVtYWluaW5nKGxvZ2dlclN0dWIsIGNvbW1hbmRMaW5lUGFyc2VyKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiVW5yZWNvZ25pemVkIGFyZ3VtZW50c1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNoZWNrVmVyc2lvblwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwibm8gbmV3IHZlcnNpb24gd2l0aCBubyBwYWNrYWdlIGluZm9ybWF0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCBjbGllbnRTdHViOiBXZWJTZWN1cmVDbGllbnQgPSBuZXcgV2ViU2VjdXJlQ2xpZW50KCk7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoY2xpZW50U3R1YiwgXCJnZXRUZXh0XCIpLnJlc29sdmVzKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoudGVzdENoZWNrVmVyc2lvbihjbGllbnRTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcIm5vIG5ldyB2ZXJzaW9uIHdpdGggbm8gcmVzcG9uc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXModW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJoZWxwXCIgXX0pO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnRlc3RDaGVja1ZlcnNpb24oY2xpZW50U3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJubyBuZXcgdmVyc2lvbiB3aXRoIGVtcHR5IHJlc3BvbnNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCBjbGllbnRTdHViOiBXZWJTZWN1cmVDbGllbnQgPSBuZXcgV2ViU2VjdXJlQ2xpZW50KCk7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoY2xpZW50U3R1YiwgXCJnZXRUZXh0XCIpLnJlc29sdmVzKEpTT04uc3RyaW5naWZ5KHt9KSk7XG4gICAgICAgICAgICBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiIF19KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai50ZXN0Q2hlY2tWZXJzaW9uKGNsaWVudFN0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwibm8gbmV3IHZlcnNpb24gd2l0aCBpbnZhbGlkIHJlcG9uc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXMoSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjFcIn0pKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJoZWxwXCIgXX0pO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnRlc3RDaGVja1ZlcnNpb24oY2xpZW50U3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJubyBuZXcgdmVyc2lvbiB3aXRoIHZhbGlkIHJlcG9uc2UgbWFqb3Igb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIG9iai5zZXRQYWNrYWdlRGV0YWlscyhcInBcIiwgXCIyLjAuMFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXMoSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjEuMC4wXCJ9KSk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoudGVzdENoZWNrVmVyc2lvbihjbGllbnRTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcIm5vIG5ldyB2ZXJzaW9uIHdpdGggdmFsaWQgcmVwb25zZSBtYWpvciBuZXdlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgb2JqLnNldFBhY2thZ2VEZXRhaWxzKFwicFwiLCBcIjIuMC4wXCIpO1xuICAgICAgICAgICAgY29uc3QgY2xpZW50U3R1YjogV2ViU2VjdXJlQ2xpZW50ID0gbmV3IFdlYlNlY3VyZUNsaWVudCgpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGNsaWVudFN0dWIsIFwiZ2V0VGV4dFwiKS5yZXNvbHZlcyhKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IFwiMy4wLjBcIn0pKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai50ZXN0Q2hlY2tWZXJzaW9uKGNsaWVudFN0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJubyBuZXcgdmVyc2lvbiB3aXRoIHZhbGlkIHJlcG9uc2UgbWlub3Igb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIG9iai5zZXRQYWNrYWdlRGV0YWlscyhcInBcIiwgXCIyLjEuMFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXMoSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjIuMC4wXCJ9KSk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoudGVzdENoZWNrVmVyc2lvbihjbGllbnRTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcIm5vIG5ldyB2ZXJzaW9uIHdpdGggdmFsaWQgcmVwb25zZSBtaW5vciBuZXdlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgb2JqLnNldFBhY2thZ2VEZXRhaWxzKFwicFwiLCBcIjIuMC4wXCIpO1xuICAgICAgICAgICAgY29uc3QgY2xpZW50U3R1YjogV2ViU2VjdXJlQ2xpZW50ID0gbmV3IFdlYlNlY3VyZUNsaWVudCgpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGNsaWVudFN0dWIsIFwiZ2V0VGV4dFwiKS5yZXNvbHZlcyhKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IFwiMi4xLjBcIn0pKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai50ZXN0Q2hlY2tWZXJzaW9uKGNsaWVudFN0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJubyBuZXcgdmVyc2lvbiB3aXRoIHZhbGlkIHJlcG9uc2UgcGF0Y2ggb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIG9iai5zZXRQYWNrYWdlRGV0YWlscyhcInBcIiwgXCIyLjAuMVwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFN0dWI6IFdlYlNlY3VyZUNsaWVudCA9IG5ldyBXZWJTZWN1cmVDbGllbnQoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihjbGllbnRTdHViLCBcImdldFRleHRcIikucmVzb2x2ZXMoSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjIuMC4wXCJ9KSk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoudGVzdENoZWNrVmVyc2lvbihjbGllbnRTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcIm5vIG5ldyB2ZXJzaW9uIHdpdGggdmFsaWQgcmVwb25zZSBwYXRjaCBuZXdlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgb2JqLnNldFBhY2thZ2VEZXRhaWxzKFwicFwiLCBcIjIuMC4wXCIpO1xuICAgICAgICAgICAgY29uc3QgY2xpZW50U3R1YjogV2ViU2VjdXJlQ2xpZW50ID0gbmV3IFdlYlNlY3VyZUNsaWVudCgpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGNsaWVudFN0dWIsIFwiZ2V0VGV4dFwiKS5yZXNvbHZlcyhKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IFwiMi4wLjFcIn0pKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai50ZXN0Q2hlY2tWZXJzaW9uKGNsaWVudFN0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gd2FpdCBmb3IgdmVyc2lvbiB0byBjb21wbGV0ZSB3aXRoIG5vIG5ldyB2ZXJzaW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBvYmouc2V0TmV3VmVyc2lvbih1bmRlZmluZWQpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNldE5ld1ZlcnNpb24oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAxMDApO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcImhlbHBcIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiB3YWl0IGZvciB2ZXJzaW9uIHRvIGNvbXBsZXRlIHdpdGggbmV3IHZlcnNpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIG9iai5zZXROZXdWZXJzaW9uKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2V0TmV3VmVyc2lvbihcIjEuMC4wXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgMTAwKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJoZWxwXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
