/**
 * Tests for CommandLineParser.
 */
import * as Chai from "chai";
import { CommandLineParser } from "../../../src/commandLineParser";

describe("CommandLineParser", () => {
    it("can be created", () => {
        const obj = new CommandLineParser();
        Chai.should().exist(obj);
    });

    describe("parse", () => {
        it("can be called with no undefined", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(undefined)).to.be.deep.equal([]);
            Chai.expect(obj.getInterpreter()).to.be.equal(undefined);
            Chai.expect(obj.getScript()).to.be.equal(undefined);
            Chai.expect(obj.getCommand()).to.be.equal(undefined);
        });

        it("can be called with no null", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(null)).to.be.deep.equal([]);
            Chai.expect(obj.getInterpreter()).to.be.equal(undefined);
            Chai.expect(obj.getScript()).to.be.equal(undefined);
            Chai.expect(obj.getCommand()).to.be.equal(undefined);
        });

        it("can be called with no empty array", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse([])).to.be.deep.equal([]);
            Chai.expect(obj.getInterpreter()).to.be.equal(undefined);
            Chai.expect(obj.getScript()).to.be.equal(undefined);
            Chai.expect(obj.getCommand()).to.be.equal(undefined);
        });

        it("can be called with interpreter", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node"])).to.be.deep.equal([]);
            Chai.expect(obj.getInterpreter()).to.be.equal("node");
            Chai.expect(obj.getScript()).to.be.equal(undefined);
            Chai.expect(obj.getCommand()).to.be.equal(undefined);
        });

        it("can be called with interpreter, script", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript"])).to.be.deep.equal([]);
            Chai.expect(obj.getInterpreter()).to.be.equal("node");
            Chai.expect(obj.getScript()).to.be.equal("myscript");
            Chai.expect(obj.getCommand()).to.be.equal(undefined);
        });

        it("can be called with interpreter, script, command", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand"])).to.be.deep.equal([]);
            Chai.expect(obj.getInterpreter()).to.be.equal("node");
            Chai.expect(obj.getScript()).to.be.equal("myscript");
            Chai.expect(obj.getCommand()).to.be.equal("acommand");
        });

        it("can be called with interpreter, script, no command and arg", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "--noColor"])).to.be.deep.equal([]);
            Chai.expect(obj.getInterpreter()).to.be.equal("node");
            Chai.expect(obj.getScript()).to.be.equal("myscript");
            Chai.expect(obj.getCommand()).to.be.equal(undefined);
            Chai.expect(obj.hasArgument("noColor")).to.be.equal(true);
        });

        it("can be called with interpreter, script, no command and arg param", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "--logFile=myFile.txt"])).to.be.deep.equal([]);
            Chai.expect(obj.getInterpreter()).to.be.equal("node");
            Chai.expect(obj.getScript()).to.be.equal("myscript");
            Chai.expect(obj.getCommand()).to.be.equal(undefined);
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal("myFile.txt");
        });

        it("can be called with interpreter, script, command and arg param", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logFile=myFile.txt"])).to.be.deep.equal([]);
            Chai.expect(obj.getInterpreter()).to.be.equal("node");
            Chai.expect(obj.getScript()).to.be.equal("myscript");
            Chai.expect(obj.getCommand()).to.be.equal("acommand");
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal("myFile.txt");
        });

        it("can be called with interpreter, script, command and bad param", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "-logFile=myFile.txt"])).to.be.deep.equal(["-logFile=myFile.txt"]);
            Chai.expect(obj.getInterpreter()).to.be.equal("node");
            Chai.expect(obj.getScript()).to.be.equal("myscript");
            Chai.expect(obj.getCommand()).to.be.equal("acommand");
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal(undefined);
        });
    });

    describe("getStringArgument", () => {
        it("can fail getting an unknown argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(false);
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal(undefined);
        });

        it("can succeed getting an empty argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logFile"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(true);
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal(null);
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(false);
        });

        it("can succeed getting a zero length argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logFile="])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(true);
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal("");
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(false);
        });

        it("can succeed getting a value argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logFile=hello"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(true);
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal("hello");
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(false);
        });

        it("can succeed getting a double quoted value argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logFile=\"hello\""])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(true);
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal("hello");
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(false);
        });

        it("can succeed getting a single quoted value argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logFile='hello'"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(true);
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal("hello");
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(false);
        });

        it("can succeed getting a backtick quoted value argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logFile=`hello`"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(true);
            Chai.expect(obj.getStringArgument("logFile")).to.be.equal("hello");
            Chai.expect(obj.hasArgument("logFile")).to.be.equal(false);
        });
    });

    describe("getNumberArgument", () => {
        it("can fail getting an unknown argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(false);
            Chai.expect(obj.getNumberArgument("logLevel")).to.be.equal(undefined);
        });

        it("can fail getting an empty argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logLevel"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(true);
            Chai.expect(obj.getNumberArgument("logLevel")).to.be.equal(undefined);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(true);
        });

        it("can fail getting a zero length argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logLevel="])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(true);
            Chai.expect(obj.getNumberArgument("logLevel")).to.be.equal(undefined);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(true);
        });

        it("can fail getting a non numeric argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logLevel=bah"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(true);
            Chai.expect(obj.getNumberArgument("logLevel")).to.be.equal(undefined);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(true);
        });

        it("can succeed getting an integer argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logLevel=1"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(true);
            Chai.expect(obj.getNumberArgument("logLevel")).to.be.equal(1);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(false);
        });

        it("can succeed getting a float argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logLevel=1.23"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(true);
            Chai.expect(obj.getNumberArgument("logLevel")).to.be.equal(1.23);
            Chai.expect(obj.hasArgument("logLevel")).to.be.equal(false);
        });
    });

    describe("getBooleanArgument", () => {
        it("can fail getting an unknown argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(false);
            Chai.expect(obj.getBooleanArgument("logEnabled")).to.be.equal(undefined);
        });

        it("can succeed getting an empty argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logEnabled"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(true);
            Chai.expect(obj.getBooleanArgument("logEnabled")).to.be.equal(true);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(false);
        });

        it("can succeed getting a zero length argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logEnabled="])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(true);
            Chai.expect(obj.getBooleanArgument("logEnabled")).to.be.equal(true);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(false);
        });

        it("can fail getting a non true/false argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logEnabled=bah"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(true);
            Chai.expect(obj.getBooleanArgument("logEnabled")).to.be.equal(undefined);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(true);
        });

        it("can succeed getting a true argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logEnabled=true"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(true);
            Chai.expect(obj.getBooleanArgument("logEnabled")).to.be.equal(true);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(false);
        });

        it("can succeed getting a false argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--logEnabled=false"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(true);
            Chai.expect(obj.getBooleanArgument("logEnabled")).to.be.equal(false);
            Chai.expect(obj.hasArgument("logEnabled")).to.be.equal(false);
        });
    });

    describe("getStringArrayArgument", () => {
        it("can fail getting an unknown argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("myArray")).to.be.equal(false);
            Chai.expect(obj.getStringArrayArgument("myArray")).to.be.equal(undefined);
        });

        it("can succeed getting an empty argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--myArray"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("myArray")).to.be.equal(true);
            Chai.expect(obj.getStringArrayArgument("myArray")).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("myArray")).to.be.equal(false);
        });

        it("can succeed getting a zero length argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--myArray="])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("myArray")).to.be.equal(true);
            Chai.expect(obj.getStringArrayArgument("myArray")).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("myArray")).to.be.equal(false);
        });

        it("can succeed getting a single value argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--myArray=one"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("myArray")).to.be.equal(true);
            Chai.expect(obj.getStringArrayArgument("myArray")).to.be.deep.equal(["one"]);
            Chai.expect(obj.hasArgument("myArray")).to.be.equal(false);
        });

        it("can succeed getting a multiple value argument", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "acommand", "--myArray=one,two"])).to.be.deep.equal([]);
            Chai.expect(obj.hasArgument("myArray")).to.be.equal(true);
            Chai.expect(obj.getStringArrayArgument("myArray")).to.be.deep.equal(["one", "two"]);
            Chai.expect(obj.hasArgument("myArray")).to.be.equal(false);
        });
    });

    describe("getRemaining", () => {
        it("can get non remaining if no args", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript"])).to.be.deep.equal([]);
            Chai.expect(obj.getRemaining().length).to.be.equal(0);
        });

        it("can get non remaining if all consumed", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "--myarg"])).to.be.deep.equal([]);
            Chai.expect(obj.getStringArgument("myarg")).to.be.equal(null);
            Chai.expect(obj.getRemaining().length).to.be.equal(0);
        });

        it("can get remaining if not consumed", () => {
            const obj = new CommandLineParser();
            Chai.expect(obj.parse(["node", "myscript", "--myarg"])).to.be.deep.equal([]);
            Chai.expect(obj.getRemaining().length).to.be.equal(1);
        });
    });
});
