/**
 * Tests for DisplayLogger.
 */
import * as Chai from "chai";
import * as os from "os";
import * as Sinon from "sinon";
import { DisplayLogger } from "../../../dist/displayLogger";

describe("DisplayLogger", () => {
    let sandbox: Sinon.SinonSandbox;
    let processStub: NodeJS.Process;
    let spiedConsoleLogMethod: Sinon.SinonSpy;
    let originalConsoleLog: (message?: any, ...optionalParams: any[]) => void;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        processStub = <NodeJS.Process>{ platform: "win32" };
        originalConsoleLog = console.log;
        console.log = (message?: any, ...optionalParams: any[]) => {
            if (message && message.indexOf("@@@") < 0 && !message.startsWith("ERROR: ")) {
                originalConsoleLog(message, ...optionalParams);
            }
        };
        spiedConsoleLogMethod = sandbox.spy(console, "log");
    });

    afterEach(() => {
        sandbox.restore();
        console.log = originalConsoleLog;
    });

    it("can be created", () => {
        const obj = new DisplayLogger(undefined, undefined);
        Chai.should().exist(obj);
    });

    describe("banner", () => {
        it("can be called with undefined message with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner(undefined);
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("");
        });

        it("can be called with undefined message no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner(undefined);
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("");
        });

        it("can be called with no message with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner("");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("");
        });

        it("can be called with no message no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner("");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("");
        });

        it("can be called with message only with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can be called with message only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });

        it("can be called with message and undefined args with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner("@@@message", undefined);
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can be called with message and undefined args only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner("@@@message", undefined);
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });

        it("can be called with message and single arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner("@@@message", { arg1: "foo" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message: \u001b[39m\u001b[37mfoo\u001b[39m");
        });

        it("can be called with message and single arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner("@@@message", { arg1: "foo" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message: foo");
        });

        it("can be called with no message and single arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner("", { arg1: "@@@foo" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[37m@@@foo\u001b[39m");
        });

        it("can be called with no message and single arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner("", { arg1: "@@@foo" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@foo");
        });

        it("can be called with no message and multiple arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner("", { arg1: "@@@foo", args2: "@@@bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`\u001b[37marg1: @@@foo${os.EOL}\targs2: @@@bar\u001b[39m`);
        });

        it("can be called with no message and multiple arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner("", { arg1: "@@@foo", args2: "@@@bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`arg1: @@@foo${os.EOL}\targs2: @@@bar`);
        });

        it("can be called with message and multiple arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner("@@@message", { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`\u001b[32m@@@message: \u001b[39m\u001b[37m${os.EOL}\targ1: foo${os.EOL}\targ2: bar\u001b[39m`);
        });

        it("can be called with message and multiple arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner("@@@message", { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`@@@message: ${os.EOL}\targ1: foo${os.EOL}\targ2: bar`);
        });

        it("can be called with message and single undefined arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner("@@@message", { arg1: undefined });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message: \u001b[39m\u001b[37mundefined\u001b[39m");
        });

        it("can be called with message and single undefined arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner("@@@message", { arg1: undefined });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message: undefined");
        });

        it("can be called with message and multiple undefined arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.banner("@@@message", { arg1: undefined, arg2: undefined });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`\u001b[32m@@@message: \u001b[39m\u001b[37m${os.EOL}\targ1: undefined${os.EOL}\targ2: undefined\u001b[39m`);
        });

        it("can be called with message and multiple undefined arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.banner("@@@message", { arg1: undefined, arg2: undefined });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`@@@message: ${os.EOL}\targ1: undefined${os.EOL}\targ2: undefined`);
        });
    });

    describe("info", () => {
        it("can be called with message and multiple arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.info("@@@message", { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`\u001b[37m@@@message: \u001b[39m\u001b[36m${os.EOL}\targ1: foo${os.EOL}\targ2: bar\u001b[39m`);
        });

        it("can be called with message and multiple arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.info("@@@message", { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`@@@message: ${os.EOL}\targ1: foo${os.EOL}\targ2: bar`);
        });
    });

    describe("warning", () => {
        it("can be called with message and multiple arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.warning("@@@message", { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`\u001b[33m@@@message: \u001b[39m\u001b[36m${os.EOL}\targ1: foo${os.EOL}\targ2: bar\u001b[39m`);
        });

        it("can be called with message and multiple arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.warning("@@@message", { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`@@@message: ${os.EOL}\targ1: foo${os.EOL}\targ2: bar`);
        });
    });

    describe("error", () => {
        it("can be called with no message, no error and multiple arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.error(undefined, undefined, { arg1: "@@@foo", arg2: "@@@bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`\u001b[31mERROR: \u001b[39m\u001b[31m${os.EOL}\targ1: @@@foo${os.EOL}\targ2: @@@bar\u001b[39m`);
        });

        it("can be called with no message, no error and multiple arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.error(undefined, undefined, { arg1: "@@@foo", arg2: "@@@bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`ERROR: ${os.EOL}\targ1: @@@foo${os.EOL}\targ2: @@@bar`);
        });

        it("can be called with message, no error and multiple arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.error("@@@message", undefined, { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`\u001b[31mERROR: @@@message: \u001b[39m\u001b[31m${os.EOL}\targ1: foo${os.EOL}\targ2: bar\u001b[39m`);
        });

        it("can be called with message, no error and multiple arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.error("@@@message", undefined, { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`ERROR: @@@message: ${os.EOL}\targ1: foo${os.EOL}\targ2: bar`);
        });

        it("can be called with message, error and multiple arg with color", () => {
            const obj = new DisplayLogger(processStub, false);
            obj.error("@@@message", new Error("@@@this is the error"), { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`\u001b[31mERROR: @@@message: \u001b[39m\u001b[31m${os.EOL}\targ1: foo${os.EOL}\targ2: bar\u001b[39m`);
            Chai.expect(spiedConsoleLogMethod.args[1][0]).to.equal("\u001b[31m@@@this is the error\u001b[39m");
        });

        it("can be called with message, no error and multiple arg only no color", () => {
            const obj = new DisplayLogger(processStub, true);
            obj.error("@@@message", new Error("@@@this is the error"), { arg1: "foo", arg2: "bar" });
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal(`ERROR: @@@message: ${os.EOL}\targ1: foo${os.EOL}\targ2: bar`);
            Chai.expect(spiedConsoleLogMethod.args[1][0]).to.equal("@@@this is the error");
        });
    });

    describe("calculateColors", () => {
        it("can have no color if noColor is set", () => {
            const obj = new DisplayLogger(<NodeJS.Process>{ platform: "win32" }, true);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });

        it("can have no color if stdout is not TTY", () => {
            const obj = new DisplayLogger(<NodeJS.Process>{ stdout: {} }, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });

        it("can have color if platform is win32", () => {
            const obj = new DisplayLogger(<NodeJS.Process>{ platform: "win32" }, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have color if platform is win32 but not disabled", () => {
            const obj = new DisplayLogger(<NodeJS.Process>{ platform: "win32" }, true);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });

        it("can have color if env contains CI and TRAVIS", () => {
            const process: any = { env: { CI: true, TRAVIS: true } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have color if env contains CI and CIRCLECI", () => {
            const process: any = { env: { CI: true, CIRCLECI: true } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have color if env contains CI and APPVEYOR", () => {
            const process: any = { env: { CI: true, APPVEYOR: true } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have color if env contains CI and GITLAB_CI", () => {
            const process: any = { env: { CI: true, GITLAB_CI: true } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have no color if env contains CI and nothing else", () => {
            const process: any = { env: { CI: true } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });

        it("can have color if env contains TEAMCITY_VERSION >= 9.1", () => {
            const process: any = { env: { TEAMCITY_VERSION: "9.1.0" } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have no color if env contains TEAMCITY_VERSION < 9.1", () => {
            const process: any = { env: { TEAMCITY_VERSION: "9.0.5" } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });

        it("can have color if env contains TERM_PROGRAM of iTerm.app", () => {
            const process: any = { env: { TERM_PROGRAM: "iTerm.app" } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have color if env contains TERM_PROGRAM of Hyper", () => {
            const process: any = { env: { TERM_PROGRAM: "Hyper" } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have color if env contains TERM_PROGRAM of Apple_Terminal", () => {
            const process: any = { env: { TERM_PROGRAM: "Apple_Terminal" } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have no color if env contains TERM_PROGRAM of unknown", () => {
            const process: any = { env: { TERM_PROGRAM: "something" } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });

        it("can have color if env TERM of screen-256", () => {
            const process: any = { env: { TERM: "screen-256" } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have color if env TERM of color", () => {
            const process: any = { env: { TERM: "color" } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have color if environment contains COLORTERM", () => {
            const process: any = { env: { COLORTERM: true } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("\u001b[32m@@@message\u001b[39m");
        });

        it("can have no color if environment TERM is dumb", () => {
            const process: any = { env: { TERM: "dumb" } };
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });

        it("can have no color if environment is undefined", () => {
            const process: any = {};
            const obj = new DisplayLogger(process, false);
            obj.banner("@@@message");
            Chai.expect(spiedConsoleLogMethod.args[0][0]).to.equal("@@@message");
        });
    });
});
