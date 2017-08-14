/**
 * Tests for AggregateLogger.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { AggregateLogger } from "../../../dist/aggregateLogger";

describe("AggregateLogger", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let spiedBannerMethod: Sinon.SinonSpy;
    let spiedInfoMethod: Sinon.SinonSpy;
    let spiedWarningMethod: Sinon.SinonSpy;
    let spiedErrorMethod: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.warning = () => { };
        loggerStub.error = () => { };
        spiedBannerMethod = sandbox.spy(loggerStub, "banner");
        spiedInfoMethod = sandbox.spy(loggerStub, "info");
        spiedWarningMethod = sandbox.spy(loggerStub, "warning");
        spiedErrorMethod = sandbox.spy(loggerStub, "error");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        const obj = new AggregateLogger(undefined);
        Chai.should().exist(obj);
    });

    describe("banner", () => {
        it("can be called with no loggers", () => {
            const obj = new AggregateLogger(undefined);
            Chai.expect(obj.banner("")).to.be.equal(undefined);
        });

        it("can be called with logger", () => {
            const obj = new AggregateLogger([loggerStub]);
            obj.banner("message");
            Chai.expect(spiedBannerMethod.calledWith("message"));
        });
    });

    describe("info", () => {
        it("can be called with no loggers", () => {
            const obj = new AggregateLogger(undefined);
            Chai.expect(obj.info("")).to.be.equal(undefined);
        });

        it("can be called with message only", () => {
            const obj = new AggregateLogger([loggerStub]);
            obj.info("message");
            Chai.expect(spiedInfoMethod.calledWith("message", undefined));
        });

        it("can be called with message and args", () => {
            const obj = new AggregateLogger([loggerStub]);
            obj.info("message", ["arg"]);
            Chai.expect(spiedInfoMethod.calledWith("message", ["arg"]));
        });
    });

    describe("warning", () => {
        it("can be called with no loggers", () => {
            const obj = new AggregateLogger(undefined);
            Chai.expect(obj.warning("")).to.be.equal(undefined);
        });

        it("can be called with message only", () => {
            const obj = new AggregateLogger([loggerStub]);
            obj.warning("message");
            Chai.expect(spiedWarningMethod.calledWith("message", undefined));
        });

        it("can be called with message and args", () => {
            const obj = new AggregateLogger([loggerStub]);
            obj.warning("message", ["arg"]);
            Chai.expect(spiedWarningMethod.calledWith("message", ["arg"]));
        });
    });

    describe("error", () => {
        it("can be called with no loggers", () => {
            const obj = new AggregateLogger(undefined);
            Chai.expect(obj.error("")).to.be.equal(undefined);
        });

        it("can be called with message only", () => {
            const obj = new AggregateLogger([loggerStub]);
            obj.error("message");
            Chai.expect(spiedErrorMethod.calledWith("message", undefined));
        });

        it("can be called with message and args", () => {
            const obj = new AggregateLogger([loggerStub]);
            obj.error("message", ["arg"]);
            Chai.expect(spiedErrorMethod.calledWith("message", ["arg"]));
        });
    });
});
