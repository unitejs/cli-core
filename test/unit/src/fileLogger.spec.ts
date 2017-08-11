/**
 * Tests for FileLogger.
 */
import * as Chai from "chai";
import * as fs from "fs";
import * as os from "os";
import * as Sinon from "sinon";
import { FileLogger } from "../../../dist/fileLogger";

describe("FileLogger", () => {
    let sandbox: Sinon.SinonSandbox;
    let stubExistsMethod: Sinon.SinonStub;
    let stubDeleteMethod: Sinon.SinonStub;
    let stubAppendMethod: Sinon.SinonStub;
    let originalConsoleLog: (message?: any, ...optionalParams: any[]) => void;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        stubExistsMethod = sandbox.stub(fs, "existsSync");
        stubDeleteMethod = sandbox.stub(fs, "unlinkSync");
        stubAppendMethod = sandbox.stub(fs, "appendFileSync");
        originalConsoleLog = console.log;
        console.log = (message?: any, ...optionalParams: any[]) => {
            if (message && message.indexOf("@@@") < 0) {
                originalConsoleLog(message, ...optionalParams);
            }
        };
    });

    afterEach(() => {
        sandbox.restore();
        console.log = originalConsoleLog;
    });

    it("can be created", () => {
        const obj = new FileLogger("log.txt");
        Chai.should().exist(obj);
    });

    it("can skip deleting log", () => {
        stubExistsMethod.onCall(0).returns(false);
        const obj = new FileLogger("log.txt");
        Chai.should().exist(obj);
        Chai.expect(stubExistsMethod.called).to.equal(true);
        Chai.expect(stubDeleteMethod.called).to.equal(false);
    });

    it("can delete existing log", () => {
        stubExistsMethod.onCall(0).returns(true);
        const obj = new FileLogger("log.txt");
        Chai.should().exist(obj);
        Chai.expect(stubExistsMethod.called).to.equal(true);
        Chai.expect(stubDeleteMethod.called).to.equal(true);
    });

    it("can delete throws error", () => {
        stubExistsMethod.onCall(0).throws(new Error("@@@kaboom"));
        const obj = new FileLogger("log.txt");
        Chai.should().exist(obj);
        Chai.expect(stubExistsMethod.called).to.equal(true);
        Chai.expect(stubDeleteMethod.called).to.equal(false);
    });

    describe("banner", () => {
        it("can be called with null message and no args", () => {
            const obj = new FileLogger("log.txt");
            obj.banner(null);
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(os.EOL);
        });

        it("can be called with undefined message and no args", () => {
            const obj = new FileLogger("log.txt");
            obj.banner(undefined);
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(os.EOL);
        });

        it("can be called with empty message and no args", () => {
            const obj = new FileLogger("log.txt");
            obj.banner("");
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(os.EOL);
        });

        it("can be called with message and no args", () => {
            const obj = new FileLogger("log.txt");
            obj.banner("message");
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`===  message${os.EOL}`);
        });

        it("can be called with message and args", () => {
            const obj = new FileLogger("log.txt");
            obj.banner("message", { arg1: "foo", arg2: "bar" });
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`===  message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
        });

        it("can throw error while writing", () => {
            stubAppendMethod.onCall(0).throws(new Error("@@@kaboom"));
            const obj = new FileLogger("log.txt");
            obj.banner("message", { arg1: "foo", arg2: "bar" });
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`===  message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
        });
    });

    describe("info", () => {
        it("can be called with message and no args", () => {
            const obj = new FileLogger("log.txt");
            obj.info("message");
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`INFO: message${os.EOL}`);
        });

        it("can be called with message and args", () => {
            const obj = new FileLogger("log.txt");
            obj.info("message", { arg1: "foo", arg2: "bar" });
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`INFO: message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
        });
    });

    describe("warning", () => {
        it("can be called with message and no args", () => {
            const obj = new FileLogger("log.txt");
            obj.warning("message");
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`WARNING: message${os.EOL}`);
        });

        it("can be called with message and args", () => {
            const obj = new FileLogger("log.txt");
            obj.warning("message", { arg1: "foo", arg2: "bar" });
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`WARNING: message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
        });
    });

    describe("error", () => {
        it("can be called with message, no error and no args", () => {
            const obj = new FileLogger("log.txt");
            obj.error("message");
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`ERROR: message${os.EOL}`);
        });

        it("can be called with message, no error and args", () => {
            const obj = new FileLogger("log.txt");
            obj.error("message", undefined, { arg1: "foo", arg2: "bar" });
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`ERROR: message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
        });

        it("can be called with message, error and args", () => {
            const obj = new FileLogger("log.txt");
            obj.error("message", new Error("@@@kaboom"), { arg1: "foo", arg2: "bar" });
            Chai.expect(stubAppendMethod.args[0][1]).to.equal(`ERROR: message${os.EOL}\t\targ1: "foo"${os.EOL}\t\targ2: "bar"${os.EOL}`);
            Chai.expect(stubAppendMethod.args[1][1]).to.equal(`EXCEPTION: @@@kaboom${os.EOL}`);
        });
    });
});
