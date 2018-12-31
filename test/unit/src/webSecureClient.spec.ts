/**
 * Tests for WebSecureClient.
 */
import * as Chai from "chai";
import { ClientRequest, IncomingMessage } from "http";
import * as https from "https";
import * as Sinon from "sinon";
import { WebSecureClient } from "../../../src/webSecureClient";

describe("WebSecureClient", () => {
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", () => {
        const obj = new WebSecureClient();
        Chai.should().exist(obj);
    });

    describe("getText", () => {
        it("can be called url undefined", async () => {
            const obj = new WebSecureClient();
            try {
                await obj.getText(undefined);
            } catch (err) {
                Chai.expect(err).to.contain("Invalid");
            }
        });

        it("can be called and return an error", async () => {
            sandbox.stub(https, "get").throws(new Error("Invalid"));
            const obj = new WebSecureClient();
            try {
                await obj.getText("https://a.com");
            } catch (err) {
                Chai.expect(err.message).to.contain("Invalid");
            }
        });

        it("can return an error", async () => {
            const requestMock = <ClientRequest>{
                on: (type: string, cb: (data: Error) => {}) => {
                    if (type === "error") {
                        cb(new Error("Invalid"));
                    }
                }
            };
            sandbox.stub(https, "get").returns(requestMock);
            const obj = new WebSecureClient();
            try {
                await obj.getText("https://a.com");
            } catch (err) {
                Chai.expect(err.message).to.contain("Invalid");
            }
        });

        it("can timeout", async () => {
            const socketMock = {
                on: (type: string, cb: (data: Error) => {}) => {
                    if (type === "timeout") {
                        cb(new Error("Invalid"));
                    }
                },
                setTimeout: () => {
                }
            };
            const requestMock = <ClientRequest><any>{
                on: (type: string, cb: (data: any) => {}) => {
                    if (type === "socket") {
                        cb(socketMock);
                    }
                },
                abort: () => {
                    throw new Error("Aborted");
                }
            };
            sandbox.stub(https, "get").returns(requestMock);
            const obj = new WebSecureClient();
            try {
                await obj.getText("https://a.com", 1);
            } catch (err) {
                Chai.expect(err.message).to.contain("Aborted");
            }
        });

        it("can return data", async () => {
            const responseMock = <IncomingMessage>{
                on: (type: string, cb: (data: string) => {}) => {
                    if (type === "data") {
                        cb("hello");
                    } else if (type === "end") {
                        cb("");
                    }
                }
            };
            const getStub = sandbox.stub(https, "get");
            (<any>getStub).callsFake((url: string, callback?: (res: IncomingMessage) => void) => {
                callback(responseMock);
                return <ClientRequest>{};
            });
            const obj = new WebSecureClient();
            const data = await obj.getText("https://a.com");
            Chai.expect(data).to.contain("hello");
        });
    });

    describe("getJson", () => {
        it("can be called and get data", async () => {
            const responseMock = <IncomingMessage>{
                on: (type: string, cb: (data: string) => {}) => {
                    if (type === "data") {
                        cb(JSON.stringify({a: "b", c: [1, 2, 3]}));
                    } else if (type === "end") {
                        cb("");
                    }
                }
            };
            const getStub = sandbox.stub(https, "get");
            (<any>getStub).callsFake((url: string, callback?: (res: IncomingMessage) => void) => {
                callback(responseMock);
                return <ClientRequest>{};
            });
            const obj = new WebSecureClient();
            const data = await obj.getJson("https://a.com");
            Chai.expect(data).to.deep.equal({a: "b", c: [1, 2, 3]});
        });
    });
});
