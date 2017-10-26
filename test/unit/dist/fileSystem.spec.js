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
 * Tests for FileSystem.
 */
const Chai = require("chai");
const fs = require("fs");
const path = require("path");
const Sinon = require("sinon");
const fileSystem_1 = require("../../../dist/fileSystem");
describe("FileSystem", () => {
    let sandbox;
    let pathRelativeStub;
    let pathJoinStub;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        pathRelativeStub = sandbox.spy(path, "relative");
        pathJoinStub = sandbox.spy(path, "join");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        const obj = new fileSystem_1.FileSystem();
        yield obj.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new fileSystem_1.FileSystem();
        Chai.should().exist(obj);
    });
    describe("pathCombine", () => {
        it("can be called with all undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathCombine(undefined, undefined)).to.equal(undefined);
        });
        it("can be called with path undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathCombine(undefined, "a.txt")).to.equal("a.txt");
        });
        it("can be called with additional undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathCombine("/a/b", undefined)).to.equal(`${path.sep}a${path.sep}b`);
        });
        it("can be called with path, no slash and additional", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathCombine("/a/b", "test.txt")).to.equal(`${path.sep}a${path.sep}b${path.sep}test.txt`);
        });
        it("can be called with path, slash and additional", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathCombine("/a/b/", "test.txt")).to.equal(`${path.sep}a${path.sep}b${path.sep}test.txt`);
        });
    });
    describe("pathDirectoryRelative", () => {
        it("can be called with all undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathDirectoryRelative(undefined, undefined)).to.equal(undefined);
        });
        it("can be called with pathName1 undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathDirectoryRelative(undefined, "/a/b")).to.equal(undefined);
        });
        it("can be called with pathName2 undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathDirectoryRelative("/a/b", undefined)).to.equal(undefined);
        });
        it("can be called with pathName1 and pathName2", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathDirectoryRelative("/a/b", "/a/b/c")).to.equal(`.${path.sep}c${path.sep}`);
        });
    });
    describe("pathFileRelative", () => {
        it("can be called with all undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathFileRelative(undefined, undefined)).to.equal(undefined);
        });
        it("can be called with pathName1 undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathFileRelative(undefined, "/a/b")).to.equal(undefined);
        });
        it("can be called with pathName2 undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathFileRelative("/a/b", undefined)).to.equal(undefined);
        });
        it("can be called with pathName1 and pathName2", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathFileRelative("/a/b", "/a/b/c/test.txt")).to.equal(`.${path.sep}c${path.sep}test.txt`);
        });
    });
    describe("pathToWeb", () => {
        it("can be called with undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathToWeb(undefined)).to.equal(undefined);
        });
        it("can be called with windows slashes", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathToWeb("\\a\\b")).to.equal("/a/b");
        });
        it("can be called with unix slashes", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathToWeb("/a/b")).to.equal("/a/b");
        });
    });
    describe("pathAbsolute", () => {
        it("can be called with undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathAbsolute(undefined)).to.equal(undefined);
        });
        it("can be called with root path", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathAbsolute("/a/b")).to.equal(`${path.resolve(`${path.sep}${path.sep}`)}a${path.sep}b`);
        });
        it("can be called with relative path", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathAbsolute("./a/b")).to.equal(`${path.resolve(".")}${path.sep}a${path.sep}b`);
        });
    });
    describe("pathGetDirectory", () => {
        it("can be called with undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathGetDirectory(undefined)).to.equal(undefined);
        });
        it("can be called with no trailing slash", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathGetDirectory("/a/b")).to.equal(`${path.sep}a${path.sep}b${path.sep}`);
        });
        it("can be called with trailing slash", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathGetDirectory("/a/b/")).to.equal(`${path.sep}a${path.sep}b${path.sep}`);
        });
        it("can be called with a file name", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathGetDirectory("/a/b/temp.txt")).to.equal(`${path.sep}a${path.sep}b${path.sep}`);
        });
    });
    describe("pathGetFilename", () => {
        it("can be called with undefined", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathGetFilename(undefined)).to.equal(undefined);
        });
        it("can be called with no trailing slash", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathGetFilename("/a/b")).to.equal("b");
        });
        it("can be called with trailing slash", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathGetFilename("/a/b/")).to.equal(undefined);
        });
        it("can be called with a file name", () => {
            const obj = new fileSystem_1.FileSystem();
            Chai.expect(obj.pathGetFilename("/a/b/temp.txt")).to.equal("temp.txt");
        });
    });
    describe("directoryExists", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const exists = yield obj.directoryExists(undefined);
            Chai.expect(exists).to.equal(false);
        }));
        it("can be called with existing directory", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const exists = yield obj.directoryExists("./test");
            Chai.expect(exists).to.equal(true);
        }));
        it("can be called with non existing directory", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const exists = yield obj.directoryExists("./blah");
            Chai.expect(exists).to.equal(false);
        }));
        it("can be called with invalid directory", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const exists = yield obj.directoryExists("./test/unit/src/fileSystem/spec.ts");
            Chai.expect(exists).to.equal(false);
        }));
        it("can throw an error", () => __awaiter(this, void 0, void 0, function* () {
            const lstatStub = sandbox.stub(fs, "lstat");
            lstatStub.callsFake((dirName, cb) => {
                cb({ name: "err", code: "blah", message: "" }, undefined);
            });
            const obj = new fileSystem_1.FileSystem();
            try {
                yield obj.directoryExists("?*?*?*?*?*");
            }
            catch (err) {
                Chai.expect(err.code).to.equal("blah");
            }
        }));
    });
    describe("directoryCreate", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.directoryCreate(undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with existing directory", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test");
            const exists = yield obj.directoryExists("./test");
            Chai.expect(exists).to.equal(true);
        }));
        it("can be called with non existing directory", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/foo/bar");
            const exists = yield obj.directoryExists("./test/unit/temp/foo/bar");
            Chai.expect(exists).to.equal(true);
        }));
    });
    describe("directoryDelete", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.directoryDelete(undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with existing directory", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/foo/bar");
            yield obj.directoryDelete("./test/unit/temp/");
            const exists = yield obj.directoryExists("./test/unit/temp/");
            Chai.expect(exists).to.equal(false);
        }));
        it("can be called with existing directory with files", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/foo/bar");
            yield obj.fileWriteText("./test/unit/temp/foo/bar", "temp.txt", "blah");
            yield obj.directoryDelete("./test/unit/temp/");
            const exists = yield obj.directoryExists("./test/unit/temp/");
            Chai.expect(exists).to.equal(false);
        }));
        it("can be called with non existing directory", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.directoryDelete("./blah");
            Chai.expect(ret).to.equal(undefined);
        }));
    });
    describe("directoryGetFiles", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.directoryGetFiles(undefined);
            Chai.expect(ret).to.deep.equal([]);
        }));
        it("can be called with non existing directory", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.directoryGetFiles("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal([]);
        }));
        it("can be called with existing directory with files", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            const ret = yield obj.directoryGetFiles("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal(["temp.txt"]);
        }));
        it("can be called with existing directory with files and folder", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/foo");
            yield obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            const ret = yield obj.directoryGetFiles("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal(["temp.txt"]);
        }));
    });
    describe("directoryGetFolders", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.directoryGetFolders(undefined);
            Chai.expect(ret).to.deep.equal([]);
        }));
        it("can be called with non existing directory", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.directoryGetFolders("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal([]);
        }));
        it("can be called with existing directory with files", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            const ret = yield obj.directoryGetFolders("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal([]);
        }));
        it("can be called with existing directory with files and folder", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/foo");
            yield obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            const ret = yield obj.directoryGetFolders("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal(["foo"]);
        }));
    });
    describe("fileExists", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const exists = yield obj.fileExists(undefined, undefined);
            Chai.expect(exists).to.equal(false);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const exists = yield obj.fileExists(undefined, "temp.txt");
            Chai.expect(exists).to.equal(false);
        }));
        it("can be called with path and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const exists = yield obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(false);
        }));
        it("can be called with existing path and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteText("./test/unit/temp", "temp.txt", "blah");
            const exists = yield obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(true);
        }));
        it("can throw an error", () => __awaiter(this, void 0, void 0, function* () {
            const lstatStub = sandbox.stub(fs, "lstat");
            lstatStub.callsFake((dirName, cb) => {
                cb({ name: "err", code: "blah", message: "" }, undefined);
            });
            const obj = new fileSystem_1.FileSystem();
            try {
                yield obj.fileExists("?*?*?*?*?*", "");
            }
            catch (err) {
                Chai.expect(err.code).to.equal("blah");
            }
        }));
    });
    describe("fileWriteText", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileWriteText(undefined, undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileWriteText(undefined, "temp.txt", undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with path and filename and undefined content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.fileWriteText("./test/unit/temp", "fileWriteText.txt", undefined);
            const exist = yield obj.fileExists("./test/unit/temp", "fileWriteText.txt");
            Chai.expect(exist).to.equal(false);
        }));
        it("can be called with path and filename and content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteText("./test/unit/temp", "fileWriteText.txt", "content");
            const content = yield obj.fileReadText("./test/unit/temp", "fileWriteText.txt");
            Chai.expect(content).to.equal("content");
        }));
        it("can be called with path and filename and append content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteText("./test/unit/temp", "fileWriteText2.txt", "content");
            yield obj.fileWriteText("./test/unit/temp", "fileWriteText2.txt", "extra", true);
            const content = yield obj.fileReadText("./test/unit/temp", "fileWriteText2.txt");
            Chai.expect(content).to.equal("contentextra");
        }));
    });
    describe("fileWriteLines", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileWriteLines(undefined, undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileWriteLines(undefined, "temp.txt", undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with path and filename and undefined content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.fileWriteLines("./test/unit/temp", "fileWrite.txt", undefined);
            const exist = yield obj.fileExists("./test/unit/temp", "fileWrite.txt");
            Chai.expect(exist).to.equal(false);
        }));
        it("can be called with path and filename and content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteLines("./test/unit/temp", "fileWrite.txt", ["content"]);
            const content = yield obj.fileReadLines("./test/unit/temp", "fileWrite.txt");
            Chai.expect(content).to.deep.equal(["content", ""]);
        }));
        it("can be called with path and filename and append content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteLines("./test/unit/temp", "fileWrite.txt", ["content"]);
            yield obj.fileWriteLines("./test/unit/temp", "fileWrite.txt", ["extra"], true);
            const content = yield obj.fileReadLines("./test/unit/temp", "fileWrite.txt");
            Chai.expect(content).to.deep.equal(["content", "extra", ""]);
        }));
    });
    describe("fileWriteBinary", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileWriteBinary(undefined, undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileWriteBinary(undefined, "temp.bin", undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with path and filename and undefined content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", undefined);
            const exist = yield obj.fileExists("./test/unit/temp", "fileWrite.bin");
            Chai.expect(exist).to.equal(false);
        }));
        it("can be called with path and filename and content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", new Buffer("content"));
            const content = yield obj.fileReadBinary("./test/unit/temp", "fileWrite.bin");
            Chai.expect(new Buffer(content).toString()).to.equal("content");
        }));
        it("can be called with path and filename and append content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", new Buffer("content"));
            yield obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", new Buffer("extra"), true);
            const content = yield obj.fileReadBinary("./test/unit/temp", "fileWrite.bin");
            Chai.expect(new Buffer(content).toString()).to.equal("contentextra");
        }));
    });
    describe("fileWriteJson", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileWriteJson(undefined, undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileWriteJson(undefined, "temp.json", undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with path and filename and undefined content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.fileWriteJson("./test/unit/temp", "fileWrite.json", undefined);
            const exist = yield obj.fileExists("./test/unit/temp", "fileWrite.json");
            Chai.expect(exist).to.equal(false);
        }));
        it("can be called with path and filename and content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteJson("./test/unit/temp", "fileWrite.json", { foo: "123", bar: true });
            const content = yield obj.fileReadJson("./test/unit/temp", "fileWrite.json");
            Chai.expect(content).to.deep.equal({ foo: "123", bar: true });
        }));
    });
    describe("fileReadText", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileReadText(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileReadText(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        }));
    });
    describe("fileReadLines", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileReadLines(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileReadLines(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        }));
    });
    describe("fileReadBinary", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileReadBinary(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileReadBinary(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        }));
    });
    describe("fileReadJson", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileReadJson(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileReadJson(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        }));
    });
    describe("fileDelete", () => {
        it("can be called with undefined", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileDelete(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with undefined and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            const ret = yield obj.fileDelete(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        }));
        it("can be called with path and filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            let exists = yield obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(false);
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            exists = yield obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(true);
            yield obj.fileDelete("./test/unit/temp", "temp.txt");
            exists = yield obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(false);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZmlsZVN5c3RlbS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQix3REFBcUQ7QUFFckQsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDeEIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksZ0JBQWdDLENBQUM7SUFDckMsSUFBSSxZQUE0QixDQUFDO0lBRWpDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRCxZQUFZLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsR0FBUyxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztRQUM3QixNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcs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QVksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBUyxFQUFFO1lBQ3ZELE1BQU0sR0FBRyxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1lBQzdCLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzNCLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFTLEVBQUU7WUFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7WUFDN0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxHQUFTLEVBQUU7WUFDdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7WUFDN0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFL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QUUsQ0FBQztZQUM3QixJQUFJLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakUsTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImZpbGVTeXN0ZW0uc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIEZpbGVTeXN0ZW0uXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9maWxlU3lzdGVtXCI7XG5cbmRlc2NyaWJlKFwiRmlsZVN5c3RlbVwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgcGF0aFJlbGF0aXZlU3R1YjogU2lub24uU2lub25TcHk7XG4gICAgbGV0IHBhdGhKb2luU3R1YjogU2lub24uU2lub25TcHk7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIHBhdGhSZWxhdGl2ZVN0dWIgPSBzYW5kYm94LnNweShwYXRoLCBcInJlbGF0aXZlXCIpO1xuICAgICAgICBwYXRoSm9pblN0dWIgPSBzYW5kYm94LnNweShwYXRoLCBcImpvaW5cIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwYXRoQ29tYmluZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGFsbCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoQ29tYmluZSh1bmRlZmluZWQsIHVuZGVmaW5lZCkpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggdW5kZWZpbmVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aENvbWJpbmUodW5kZWZpbmVkLCBcImEudHh0XCIpKS50by5lcXVhbChcImEudHh0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhZGRpdGlvbmFsIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhDb21iaW5lKFwiL2EvYlwiLCB1bmRlZmluZWQpKS50by5lcXVhbChgJHtwYXRoLnNlcH1hJHtwYXRoLnNlcH1iYCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGgsIG5vIHNsYXNoIGFuZCBhZGRpdGlvbmFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aENvbWJpbmUoXCIvYS9iXCIsIFwidGVzdC50eHRcIikpLnRvLmVxdWFsKGAke3BhdGguc2VwfWEke3BhdGguc2VwfWIke3BhdGguc2VwfXRlc3QudHh0YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGgsIHNsYXNoIGFuZCBhZGRpdGlvbmFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aENvbWJpbmUoXCIvYS9iL1wiLCBcInRlc3QudHh0XCIpKS50by5lcXVhbChgJHtwYXRoLnNlcH1hJHtwYXRoLnNlcH1iJHtwYXRoLnNlcH10ZXN0LnR4dGApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicGF0aERpcmVjdG9yeVJlbGF0aXZlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYWxsIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCkpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGhOYW1lMSB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRGlyZWN0b3J5UmVsYXRpdmUodW5kZWZpbmVkLCBcIi9hL2JcIikpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGhOYW1lMiB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRGlyZWN0b3J5UmVsYXRpdmUoXCIvYS9iXCIsIHVuZGVmaW5lZCkpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGhOYW1lMSBhbmQgcGF0aE5hbWUyXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aERpcmVjdG9yeVJlbGF0aXZlKFwiL2EvYlwiLCBcIi9hL2IvY1wiKSkudG8uZXF1YWwoYC4ke3BhdGguc2VwfWMke3BhdGguc2VwfWApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicGF0aEZpbGVSZWxhdGl2ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGFsbCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRmlsZVJlbGF0aXZlKHVuZGVmaW5lZCwgdW5kZWZpbmVkKSkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aE5hbWUxIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhGaWxlUmVsYXRpdmUodW5kZWZpbmVkLCBcIi9hL2JcIikpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGhOYW1lMiB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRmlsZVJlbGF0aXZlKFwiL2EvYlwiLCB1bmRlZmluZWQpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoTmFtZTEgYW5kIHBhdGhOYW1lMlwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhGaWxlUmVsYXRpdmUoXCIvYS9iXCIsIFwiL2EvYi9jL3Rlc3QudHh0XCIpKS50by5lcXVhbChgLiR7cGF0aC5zZXB9YyR7cGF0aC5zZXB9dGVzdC50eHRgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInBhdGhUb1dlYlwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhUb1dlYih1bmRlZmluZWQpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB3aW5kb3dzIHNsYXNoZXNcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoVG9XZWIoXCJcXFxcYVxcXFxiXCIpKS50by5lcXVhbChcIi9hL2JcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuaXggc2xhc2hlc1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhUb1dlYihcIi9hL2JcIikpLnRvLmVxdWFsKFwiL2EvYlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInBhdGhBYnNvbHV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhBYnNvbHV0ZSh1bmRlZmluZWQpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCByb290IHBhdGhcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoQWJzb2x1dGUoXCIvYS9iXCIpKS50by5lcXVhbChgJHtwYXRoLnJlc29sdmUoYCR7cGF0aC5zZXB9JHtwYXRoLnNlcH1gKX1hJHtwYXRoLnNlcH1iYCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHJlbGF0aXZlIHBhdGhcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoQWJzb2x1dGUoXCIuL2EvYlwiKSkudG8uZXF1YWwoYCR7cGF0aC5yZXNvbHZlKFwiLlwiKX0ke3BhdGguc2VwfWEke3BhdGguc2VwfWJgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicGF0aEdldERpcmVjdG9yeVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhHZXREaXJlY3RvcnkodW5kZWZpbmVkKSkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm8gdHJhaWxpbmcgc2xhc2hcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoR2V0RGlyZWN0b3J5KFwiL2EvYlwiKSkudG8uZXF1YWwoYCR7cGF0aC5zZXB9YSR7cGF0aC5zZXB9YiR7cGF0aC5zZXB9YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHRyYWlsaW5nIHNsYXNoXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldERpcmVjdG9yeShcIi9hL2IvXCIpKS50by5lcXVhbChgJHtwYXRoLnNlcH1hJHtwYXRoLnNlcH1iJHtwYXRoLnNlcH1gKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYSBmaWxlIG5hbWVcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoR2V0RGlyZWN0b3J5KFwiL2EvYi90ZW1wLnR4dFwiKSkudG8uZXF1YWwoYCR7cGF0aC5zZXB9YSR7cGF0aC5zZXB9YiR7cGF0aC5zZXB9YCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwYXRoR2V0RmlsZW5hbWVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoR2V0RmlsZW5hbWUodW5kZWZpbmVkKSkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm8gdHJhaWxpbmcgc2xhc2hcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoR2V0RmlsZW5hbWUoXCIvYS9iXCIpKS50by5lcXVhbChcImJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHRyYWlsaW5nIHNsYXNoXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldEZpbGVuYW1lKFwiL2EvYi9cIikpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgZmlsZSBuYW1lXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldEZpbGVuYW1lKFwiL2EvYi90ZW1wLnR4dFwiKSkudG8uZXF1YWwoXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImRpcmVjdG9yeUV4aXN0c1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIi4vdGVzdFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vbiBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL2JsYWhcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggaW52YWxpZCBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC9zcmMvZmlsZVN5c3RlbS9zcGVjLnRzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHRocm93IGFuIGVycm9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxzdGF0U3R1YiA9IHNhbmRib3guc3R1YihmcywgXCJsc3RhdFwiKTtcbiAgICAgICAgICAgIGxzdGF0U3R1Yi5jYWxsc0Zha2UoKGRpck5hbWU6IHN0cmluZywgY2I6IChlcnI6IE5vZGVKUy5FcnJub0V4Y2VwdGlvbiwgc3RhdHM6IGZzLlN0YXRzKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgY2IoeyBuYW1lOiBcImVyclwiLCBjb2RlOiBcImJsYWhcIiwgbWVzc2FnZTogXCJcIiB9LCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCI/Kj8qPyo/Kj8qXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyLmNvZGUpLnRvLmVxdWFsKFwiYmxhaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImRpcmVjdG9yeUNyZWF0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3RcIik7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBvYmouZGlyZWN0b3J5RXhpc3RzKFwiLi90ZXN0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm9uIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvZm9vL2JhclwiKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL2Zvby9iYXJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZGlyZWN0b3J5RGVsZXRlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5RGVsZXRlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvZm9vL2JhclwiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3Rvcnkgd2l0aCBmaWxlc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvZm9vL2JhclwiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9mb28vYmFyXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vbiBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL2JsYWhcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJkaXJlY3RvcnlHZXRGaWxlc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZpbGVzKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBub24gZXhpc3RpbmcgZGlyZWN0b3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5R2V0RmlsZXMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeSB3aXRoIGZpbGVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZpbGVzKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW1widGVtcC50eHRcIl0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3Rvcnkgd2l0aCBmaWxlcyBhbmQgZm9sZGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9mb29cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZpbGVzKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW1widGVtcC50eHRcIl0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZGlyZWN0b3J5R2V0Rm9sZGVyc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZvbGRlcnModW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vbiBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5kaXJlY3RvcnlHZXRGb2xkZXJzKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3Rvcnkgd2l0aCBmaWxlc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcInRlbXAudHh0XCIsIFwiYmxhaFwiKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5kaXJlY3RvcnlHZXRGb2xkZXJzKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3Rvcnkgd2l0aCBmaWxlcyBhbmQgZm9sZGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9mb29cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZvbGRlcnMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXCJmb29cIl0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZUV4aXN0c1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmZpbGVFeGlzdHModW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5maWxlRXhpc3RzKHVuZGVmaW5lZCwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhpc3RpbmcgcGF0aCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcInRlbXAudHh0XCIsIFwiYmxhaFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gdGhyb3cgYW4gZXJyb3JcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbHN0YXRTdHViID0gc2FuZGJveC5zdHViKGZzLCBcImxzdGF0XCIpO1xuICAgICAgICAgICAgbHN0YXRTdHViLmNhbGxzRmFrZSgoZGlyTmFtZTogc3RyaW5nLCBjYjogKGVycjogTm9kZUpTLkVycm5vRXhjZXB0aW9uLCBzdGF0czogZnMuU3RhdHMpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICBjYih7IG5hbWU6IFwiZXJyXCIsIGNvZGU6IFwiYmxhaFwiLCBtZXNzYWdlOiBcIlwiIH0sIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCI/Kj8qPyo/Kj8qXCIsIFwiXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyLmNvZGUpLnRvLmVxdWFsKFwiYmxhaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVXcml0ZVRleHRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dCh1bmRlZmluZWQsIFwidGVtcC50eHRcIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIHVuZGVmaW5lZCBjb250ZW50XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGVUZXh0LnR4dFwiLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3QgPSBhd2FpdCBvYmouZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGVUZXh0LnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0KS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCBjb250ZW50XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGVUZXh0LnR4dFwiLCBcImNvbnRlbnRcIik7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgb2JqLmZpbGVSZWFkVGV4dChcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGVUZXh0LnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNvbnRlbnQpLnRvLmVxdWFsKFwiY29udGVudFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIGFwcGVuZCBjb250ZW50XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGVUZXh0Mi50eHRcIiwgXCJjb250ZW50XCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlVGV4dDIudHh0XCIsIFwiZXh0cmFcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgb2JqLmZpbGVSZWFkVGV4dChcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGVUZXh0Mi50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjb250ZW50KS50by5lcXVhbChcImNvbnRlbnRleHRyYVwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVXcml0ZUxpbmVzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVdyaXRlTGluZXModW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlV3JpdGVMaW5lcyh1bmRlZmluZWQsIFwidGVtcC50eHRcIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIHVuZGVmaW5lZCBjb250ZW50XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlTGluZXMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLnR4dFwiLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3QgPSBhd2FpdCBvYmouZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3QpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVMaW5lcyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUudHh0XCIsIFtcImNvbnRlbnRcIl0pO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IG9iai5maWxlUmVhZExpbmVzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjb250ZW50KS50by5kZWVwLmVxdWFsKFtcImNvbnRlbnRcIiwgXCJcIl0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgYXBwZW5kIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVMaW5lcyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUudHh0XCIsIFtcImNvbnRlbnRcIl0pO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUxpbmVzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS50eHRcIiwgW1wiZXh0cmFcIl0sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IG9iai5maWxlUmVhZExpbmVzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjb250ZW50KS50by5kZWVwLmVxdWFsKFtcImNvbnRlbnRcIiwgXCJleHRyYVwiLCBcIlwiXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlV3JpdGVCaW5hcnlcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlV3JpdGVCaW5hcnkodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlV3JpdGVCaW5hcnkodW5kZWZpbmVkLCBcInRlbXAuYmluXCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCB1bmRlZmluZWQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUJpbmFyeShcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUuYmluXCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCBleGlzdCA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5iaW5cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUJpbmFyeShcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUuYmluXCIsIG5ldyBCdWZmZXIoXCJjb250ZW50XCIpKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBvYmouZmlsZVJlYWRCaW5hcnkoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmJpblwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG5ldyBCdWZmZXIoY29udGVudCkudG9TdHJpbmcoKSkudG8uZXF1YWwoXCJjb250ZW50XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgYXBwZW5kIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVCaW5hcnkoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmJpblwiLCBuZXcgQnVmZmVyKFwiY29udGVudFwiKSk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlQmluYXJ5KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5iaW5cIiwgbmV3IEJ1ZmZlcihcImV4dHJhXCIpLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBvYmouZmlsZVJlYWRCaW5hcnkoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmJpblwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG5ldyBCdWZmZXIoY29udGVudCkudG9TdHJpbmcoKSkudG8uZXF1YWwoXCJjb250ZW50ZXh0cmFcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlV3JpdGVKc29uXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVdyaXRlSnNvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVXcml0ZUpzb24odW5kZWZpbmVkLCBcInRlbXAuanNvblwiLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgdW5kZWZpbmVkIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVKc29uKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5qc29uXCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCBleGlzdCA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5qc29uXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3QpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVKc29uKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5qc29uXCIsIHsgZm9vOiBcIjEyM1wiLCBiYXI6IHRydWV9KTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBvYmouZmlsZVJlYWRKc29uKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5qc29uXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY29udGVudCkudG8uZGVlcC5lcXVhbCh7IGZvbzogXCIxMjNcIiwgYmFyOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlUmVhZFRleHRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZFRleHQodW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVJlYWRUZXh0KHVuZGVmaW5lZCwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVSZWFkTGluZXNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZExpbmVzKHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVSZWFkTGluZXModW5kZWZpbmVkLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZVJlYWRCaW5hcnlcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZEJpbmFyeSh1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZEJpbmFyeSh1bmRlZmluZWQsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlUmVhZEpzb25cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZEpzb24odW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVJlYWRKc29uKHVuZGVmaW5lZCwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVEZWxldGVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlRGVsZXRlKHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVEZWxldGUodW5kZWZpbmVkLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgbGV0IGV4aXN0cyA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgZXhpc3RzID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBleGlzdHMgPSBhd2FpdCBvYmouZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
