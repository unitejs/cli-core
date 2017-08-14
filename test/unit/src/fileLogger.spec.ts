/**
 * Tests for FileLogger.
 */
import * as Chai from "chai";
import * as os from "os";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { FileLogger } from "../../../dist/fileLogger";

describe("FileLogger", () => {
    let sandbox: Sinon.SinonSandbox;
    let stubFileSystem: IFileSystem;
    let fileWriteTextSpy: Sinon.SinonSpy;
    let originalConsoleLog: (message?: any, ...optionalParams: any[]) => void;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        stubFileSystem = <IFileSystem>{};
        stubFileSystem.pathGetDirectory = sandbox.stub().returns("test/unit/temp/");
        stubFileSystem.pathGetFilename = sandbox.stub().returns("test.txt");
        stubFileSystem.directoryExists = async (directoryName) => Promise.resolve(false);
        stubFileSystem.directoryCreate = async (directoryName) => Promise.resolve();
        stubFileSystem.fileExists = async (directoryName, fileName) => Promise.resolve(false);
        stubFileSystem.fileDelete = async (directoryName, fileName) => Promise.resolve();
        stubFileSystem.fileWriteText = async (directoryName, fileName, contents, append) => Promise.resolve();

        fileWriteTextSpy = Sinon.spy(stubFileSystem, "fileWriteText");

        originalConsoleLog = console.log;
        console.log = (message?: any, ...optionalParams: any[]) => {
            if (message && message.indexOf("@@@") < 0 && !message.startsWith("ERROR: ")) {
                originalConsoleLog(message, ...optionalParams);
            }
        };
    });

    afterEach(async () => {
        sandbox.restore();
        console.log = originalConsoleLog;
    });

    it("can be created", () => {
        const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can be called with existing directory", async () => {
            stubFileSystem.directoryExists = async (directoryName) => Promise.resolve(true);
            const directoryCreateSpy: Sinon.SinonSpy = sandbox.spy(stubFileSystem, "directoryCreate");
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            return obj.initialise()
                .then(async () => {
                    Chai.expect(directoryCreateSpy.called).to.equal(false);
                    return obj.closedown();
                });
        });

        it("can be called with no existing directory", async () => {
            const directoryCreateSpy: Sinon.SinonSpy = sandbox.spy(stubFileSystem, "directoryCreate");
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            return obj.initialise()
                .then(async () => {
                    Chai.expect(directoryCreateSpy.called).to.equal(true);
                    return obj.closedown();
                });
        });

        it("can be called with existing file", async () => {
            stubFileSystem.fileExists = async (directoryName, fileName) => Promise.resolve(true);
            const fileDeleteSpy: Sinon.SinonSpy = sandbox.spy(stubFileSystem, "fileDelete");
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            return obj.initialise()
                .then(async () => {
                    Chai.expect(fileDeleteSpy.called).to.equal(true);
                    return obj.closedown();
                });
        });
        it("can throw an error", async () => {
            stubFileSystem.fileExists = async (directoryName, fileName) => Promise.reject(new Error("kaboom"));
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            return obj.initialise()
                .catch(async (err) => {
                    Chai.expect(err).not.to.equal(undefined);
                    return obj.closedown();
                });
        });
    });

    describe("closedown", () => {
        it("can be called even without initialise", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            return obj.closedown()
                .then(() => {
                    Chai.should().exist(obj);
                });
        });
    });

    describe("banner", () => {
        it("can be called with null message and no args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.banner(null);
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(os.EOL);
        });

        it("can be called with undefined message and no args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.banner(undefined);
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(os.EOL);
        });

        it("can be called with empty message and no args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.banner("");
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(os.EOL);
        });

        it("can be called with message and no args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.banner("message");
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`===  message${os.EOL}`);
        });

        it("can be called with message and args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.banner("message", { arg1: "foo", arg2: "bar" });
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`===  message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
        });
    });

    describe("info", () => {
        it("can be called with message and no args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.info("message");
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`INFO: message${os.EOL}`);
        });

        it("can be called with message and args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.info("message", { arg1: "foo", arg2: "bar" });
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`INFO: message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
        });
    });

    describe("warning", () => {
        it("can be called with message and no args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.warning("message");
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`WARNING: message${os.EOL}`);
        });

        it("can be called with message and args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.warning("message", { arg1: "foo", arg2: "bar" });
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`WARNING: message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
        });
    });

    describe("error", () => {
        it("can be called with message, no error and no args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.error("message");
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`ERROR: message${os.EOL}`);
        });

        it("can be called with message, no error and args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.error("message", undefined, { arg1: "foo", arg2: "bar" });
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`ERROR: message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
        });

        it("can be called with message, error and args", async () => {
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.error("message", new Error("@@@kaboom"), { arg1: "foo", arg2: "bar" });
            await obj.closedown();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`ERROR: message${os.EOL}\t\targ1: \"foo\"${os.EOL}\t\targ2: \"bar\"${os.EOL}EXCEPTION: @@@kaboom${os.EOL}`);
        });
    });

    describe("flushData", () => {
        it("can call on timer", async () => {
            const setIntervalStub = Sinon.stub(global, "setInterval");
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            await obj.initialise();
            obj.error("message", undefined, { arg1: "foo", arg2: "bar" });
            const flushData = setIntervalStub.args[0][0];
            flushData();
            Chai.expect(fileWriteTextSpy.args[0][2]).to.equal(`ERROR: message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
            await obj.closedown();
        });

        it("can throw an error", async () => {
            const consoleLogSpy: Sinon.SinonSpy = sandbox.spy(console, "log");
            stubFileSystem.fileWriteText = async (directoryName, fileName, contents, append) => Promise.reject(new Error("kaboom"));
            const obj = new FileLogger("test/unit/temp/test.txt", stubFileSystem);
            obj.error("message");
            await obj.closedown();
            Chai.expect(consoleLogSpy.args[0][0]).to.equal("ERROR: Logging To File 'test.txt': kaboom");
        });
    });
});
