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
const cliBase_1 = require("../../../dist/cliBase");
const fileSystem_1 = require("../../../dist/fileSystem");
class TestCLI extends cliBase_1.CLIBase {
    constructor() {
        super("MyApp");
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
}
describe("CLIBase", () => {
    let sandbox;
    let originalConsoleLog;
    let spiedConsoleLogMethod;
    let logMessages;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        originalConsoleLog = console.log;
        logMessages = [];
        console.log = (message, ...optionalParams) => {
            if (message) {
                if (message.indexOf("@@@") < 0 && message.indexOf("ERROR: ") < 0) {
                    originalConsoleLog(message, ...optionalParams);
                }
                else {
                    logMessages.push(message);
                }
            }
            else {
                logMessages.push(message);
            }
        };
        spiedConsoleLogMethod = sandbox.spy(console, "log");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        console.log = originalConsoleLog;
        // const fs = new FileSystem();
        // await fs.directoryDelete("test/unit/temp/");
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
            const result = yield obj.run({ argv: ["node", "script.js", "help", "--logPrefix=@@@", "-noColor"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[0]).to.contain("badly formed");
        }));
        it("can be called with process and argv interpreter, misplaced script and not existing log file", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "script.js", "help", "--logPrefix=@@@", "--logFile=test/unit/temp/test.txt"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages.length).to.equal(5);
        }));
        it("can be called with process and argv interpreter, misplaced script and existing log folder", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const fs = new fileSystem_1.FileSystem();
            yield fs.directoryCreate("test/unit/temp/");
            const result = yield obj.run({ argv: ["node", "script.js", "help", "--logPrefix=@@@", "--logFile=test/unit/temp/test.txt"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages.length).to.equal(5);
        }));
        it("can be called with help command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "help", "--logPrefix=@@@"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages[1]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(5);
        }));
        it("can be called with help command with no color", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "help", "--noColor", "--logPrefix=@@@"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("MyApp CLI");
            Chai.expect(logMessages[1]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(6);
        }));
        it("can be called with version command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "version", "--logPrefix=@@@"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(1);
        }));
        it("can be called with version command with no color", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "version", "--logPrefix=@@@", "--noColor"] });
            Chai.expect(result).to.equal(0);
            Chai.expect(logMessages[0]).to.contain("v");
            Chai.expect(logMessages.length).to.equal(1);
        }));
        it("can be called with exception command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "exception", "--logPrefix=@@@"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 2]).to.contain("Unhandled");
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("kaboom");
        }));
        it("can be called with missing command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "--logPrefix=@@@"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("No command");
        }));
        it("can be called with unknown command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "unknown", "--logPrefix=@@@"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("unknown");
        }));
        it("can be called with failed command", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "fail", "--logPrefix=@@@"] });
            Chai.expect(result).to.equal(1);
            Chai.expect(logMessages[logMessages.length - 1]).to.contain("fail");
        }));
        it("can throw exception before logging is created", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCLI();
            const result = yield obj.run({ argv: ["node", "./bin/script.js", "fail", "--logPrefix=@@@", "--logFile=?*?*?*/test.txt"] });
            Chai.expect(result).to.equal(1);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY2xpQmFzZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFHL0IsbURBQWdEO0FBRWhELHlEQUFzRDtBQUV0RCxhQUFjLFNBQVEsaUJBQU87SUFDekI7UUFDSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUNZLG1CQUFtQixDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGlCQUFvQzs7WUFDM0csSUFBSSxHQUFHLEdBQVcsQ0FBQyxDQUFDLENBQUM7WUFFckIsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxFQUFFLENBQUM7WUFFL0MsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFLLE1BQU0sRUFBRSxDQUFDO29CQUNWLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFDakMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDUixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFDRCxLQUFLLFdBQVcsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRU0sV0FBVyxDQUFDLE1BQWU7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLGlFQUFpRSxDQUFDLENBQUM7UUFDbkcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxpRUFBaUUsQ0FBQyxDQUFDO1FBQ25HLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDYixDQUFDO0NBQ0o7QUFFRCxRQUFRLENBQUMsU0FBUyxFQUFFO0lBQ2hCLElBQUksT0FBMkIs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Q0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtZQUNoRCxNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQzFCLE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLDJCQUEyQixDQUFFLEVBQUMsQ0FBQyxDQUFDO1lBQzdJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJjbGlCYXNlLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBDTElCYXNlLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgQ0xJQmFzZSB9IGZyb20gXCIuLi8uLi8uLi9kaXN0L2NsaUJhc2VcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lUGFyc2VyIH0gZnJvbSBcIi4uLy4uLy4uL2Rpc3QvY29tbWFuZExpbmVQYXJzZXJcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tIFwiLi4vLi4vLi4vZGlzdC9maWxlU3lzdGVtXCI7XG5cbmNsYXNzIFRlc3RDTEkgZXh0ZW5kcyBDTElCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJNeUFwcFwiKTtcbiAgICB9XG4gICAgcHVibGljIGFzeW5jIGhhbmRsZUN1c3RvbUNvbW1hbmQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldDogbnVtYmVyID0gLTE7XG5cbiAgICAgICAgY29uc3QgY29tbWFuZCA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldENvbW1hbmQoKTtcblxuICAgICAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICAgICAgICAgIGNhc2UgXCJmYWlsXCI6IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJTb21ldGhpbmcgZmFpbGVkXCIpO1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFwiZXhjZXB0aW9uXCI6IHRocm93IG5ldyBFcnJvcihcImthYm9vbVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGRpc3BsYXlIZWxwKGxvZ2dlcjogSUxvZ2dlcik6IG51bWJlciB7XG4gICAgICAgIHRoaXMubWFya2Rvd25UYWJsZVRvQ2xpKGxvZ2dlciwgdW5kZWZpbmVkKTtcbiAgICAgICAgdGhpcy5tYXJrZG93blRhYmxlVG9DbGkobG9nZ2VyLCBcInwgcGFja2FnZU5hbWUgfCBwbGFpbiB0ZXh0IHwgTmFtZSB0byBiZSB1c2VkIGZvciB5b3VyIHBhY2thZ2UgfFwiKTtcbiAgICAgICAgdGhpcy5tYXJrZG93blRhYmxlVG9DbGkobG9nZ2VyLCBcInwgICAgICAgICAgICAgfCAgICAgICAgICAgIHwgT3RoZXIgaW5mbyAgICAgICAgICAgICAgICAgICAgICAgfFwiKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuXG5kZXNjcmliZShcIkNMSUJhc2VcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IG9yaWdpbmFsQ29uc29sZUxvZzogKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4gdm9pZDtcbiAgICBsZXQgc3BpZWRDb25zb2xlTG9nTWV0aG9kOiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nTWVzc2FnZXM6IHN0cmluZ1tdO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBvcmlnaW5hbENvbnNvbGVMb2cgPSBjb25zb2xlLmxvZztcbiAgICAgICAgbG9nTWVzc2FnZXMgPSBbXTtcbiAgICAgICAgY29uc29sZS5sb2cgPSAobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLmluZGV4T2YoXCJAQEBcIikgPCAwICYmIG1lc3NhZ2UuaW5kZXhPZihcIkVSUk9SOiBcIikgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29uc29sZUxvZyhtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nTWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ01lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNwaWVkQ29uc29sZUxvZ01ldGhvZCA9IHNhbmRib3guc3B5KGNvbnNvbGUsIFwibG9nXCIpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nID0gb3JpZ2luYWxDb25zb2xlTG9nO1xuICAgICAgICAvLyBjb25zdCBmcyA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgIC8vIGF3YWl0IGZzLmRpcmVjdG9yeURlbGV0ZShcInRlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInJ1blwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vIHByb2Nlc3NcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4odW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHByb2Nlc3MgYW5kIG5vIGFyZ3ZcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnt9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIm5vIGludGVycHJldGVyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwcm9jZXNzIGFuZCBhcmd2IGludGVycHJldGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzBdKS50by5jb250YWluKFwibm8gc2NyaXB0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwcm9jZXNzIGFuZCBhcmd2IGludGVycHJldGVyLCBtaXNwbGFjZWQgc2NyaXB0IGFuZCBiYWQgY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcInNjcmlwdC5qc1wiLCBcImhlbHBcIiwgXCItLWxvZ1ByZWZpeD1AQEBcIiwgXCItbm9Db2xvclwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcImJhZGx5IGZvcm1lZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcHJvY2VzcyBhbmQgYXJndiBpbnRlcnByZXRlciwgbWlzcGxhY2VkIHNjcmlwdCBhbmQgbm90IGV4aXN0aW5nIGxvZyBmaWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwic2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tbG9nUHJlZml4PUBAQFwiLCBcIi0tbG9nRmlsZT10ZXN0L3VuaXQvdGVtcC90ZXN0LnR4dFwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIk15QXBwIENMSVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoNSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHByb2Nlc3MgYW5kIGFyZ3YgaW50ZXJwcmV0ZXIsIG1pc3BsYWNlZCBzY3JpcHQgYW5kIGV4aXN0aW5nIGxvZyBmb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IGZzID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IGZzLmRpcmVjdG9yeUNyZWF0ZShcInRlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCJzY3JpcHQuanNcIiwgXCJoZWxwXCIsIFwiLS1sb2dQcmVmaXg9QEBAXCIsIFwiLS1sb2dGaWxlPXRlc3QvdW5pdC90ZW1wL3Rlc3QudHh0XCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzBdKS50by5jb250YWluKFwiTXlBcHAgQ0xJXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXMubGVuZ3RoKS50by5lcXVhbCg1KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggaGVscCBjb21tYW5kXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tbG9nUHJlZml4PUBAQFwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIk15QXBwIENMSVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzFdKS50by5jb250YWluKFwidlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoNSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGhlbHAgY29tbWFuZCB3aXRoIG5vIGNvbG9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiaGVscFwiLCBcIi0tbm9Db2xvclwiLCBcIi0tbG9nUHJlZml4PUBAQFwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1swXSkudG8uY29udGFpbihcIk15QXBwIENMSVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzFdKS50by5jb250YWluKFwidlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoNik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHZlcnNpb24gY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcInZlcnNpb25cIiwgXCItLWxvZ1ByZWZpeD1AQEBcIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbMF0pLnRvLmNvbnRhaW4oXCJ2XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXMubGVuZ3RoKS50by5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdmVyc2lvbiBjb21tYW5kIHdpdGggbm8gY29sb3JcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDTEkoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9iai5ydW4oPE5vZGVKUy5Qcm9jZXNzPnsgYXJndjogWyBcIm5vZGVcIiwgXCIuL2Jpbi9zY3JpcHQuanNcIiwgXCJ2ZXJzaW9uXCIsIFwiLS1sb2dQcmVmaXg9QEBAXCIsIFwiLS1ub0NvbG9yXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzWzBdKS50by5jb250YWluKFwidlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzLmxlbmd0aCkudG8uZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4Y2VwdGlvbiBjb21tYW5kXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q0xJKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBvYmoucnVuKDxOb2RlSlMuUHJvY2Vzcz57IGFyZ3Y6IFsgXCJub2RlXCIsIFwiLi9iaW4vc2NyaXB0LmpzXCIsIFwiZXhjZXB0aW9uXCIsIFwiLS1sb2dQcmVmaXg9QEBAXCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ01lc3NhZ2VzW2xvZ01lc3NhZ2VzLmxlbmd0aCAtIDJdKS50by5jb250YWluKFwiVW5oYW5kbGVkXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbbG9nTWVzc2FnZXMubGVuZ3RoIC0gMV0pLnRvLmNvbnRhaW4oXCJrYWJvb21cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG1pc3NpbmcgY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcIi0tbG9nUHJlZml4PUBAQFwiIF19KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dNZXNzYWdlc1tsb2dNZXNzYWdlcy5sZW5ndGggLSAxXSkudG8uY29udGFpbihcIk5vIGNvbW1hbmRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVua25vd24gY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcInVua25vd25cIiwgXCItLWxvZ1ByZWZpeD1AQEBcIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbbG9nTWVzc2FnZXMubGVuZ3RoIC0gMV0pLnRvLmNvbnRhaW4oXCJ1bmtub3duXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBmYWlsZWQgY29tbWFuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcImZhaWxcIiwgXCItLWxvZ1ByZWZpeD1AQEBcIiBdfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nTWVzc2FnZXNbbG9nTWVzc2FnZXMubGVuZ3RoIC0gMV0pLnRvLmNvbnRhaW4oXCJmYWlsXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiB0aHJvdyBleGNlcHRpb24gYmVmb3JlIGxvZ2dpbmcgaXMgY3JlYXRlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENMSSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb2JqLnJ1big8Tm9kZUpTLlByb2Nlc3M+eyBhcmd2OiBbIFwibm9kZVwiLCBcIi4vYmluL3NjcmlwdC5qc1wiLCBcImZhaWxcIiwgXCItLWxvZ1ByZWZpeD1AQEBcIiwgXCItLWxvZ0ZpbGU9Pyo/Kj8qL3Rlc3QudHh0XCIgXX0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzdWx0KS50by5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
