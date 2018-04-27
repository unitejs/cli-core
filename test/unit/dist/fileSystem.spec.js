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
const util = require("util");
const fileSystem_1 = require("../../../dist/fileSystem");
describe("FileSystem", () => {
    let sandbox;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
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
        it("can be called with existing path and symlink filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.directoryCreate("./test/unit/temp/folder");
            const asyncSymlink = util.promisify(fs.symlink);
            yield asyncSymlink("./test/unit/temp/folder", "./test/unit/temp/folderlink");
            const exists = yield obj.directoryExists("./test/unit/temp/folderlink");
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
        it("can be called with existing path and symlink filename", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteText("./test/unit/temp", "temp.txt", "blah");
            const asyncSymlink = util.promisify(fs.symlink);
            yield asyncSymlink("./test/unit/temp/temp.txt", "./test/unit/temp/templink.txt");
            const exists = yield obj.fileExists("./test/unit/temp", "templink.txt");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZmlsZVN5c3RlbS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQiw2QkFBNkI7QUFDN0Isd0RBQXFEO0FBRXJELFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLElBQUksT0FBMkIsQ0FBQztJQUVoQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsR0FBUyxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztRQUM3QixNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtZQUN4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FB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QUFDLG1CQUFtQixDQUFDLENBQUM7WUFDL0MsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDckQsTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZmlsZVN5c3RlbS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgRmlsZVN5c3RlbS5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcInV0aWxcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2ZpbGVTeXN0ZW1cIjtcblxuZGVzY3JpYmUoXCJGaWxlU3lzdGVtXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicGF0aENvbWJpbmVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhbGwgdW5kZWZpbmVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aENvbWJpbmUodW5kZWZpbmVkLCB1bmRlZmluZWQpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhDb21iaW5lKHVuZGVmaW5lZCwgXCJhLnR4dFwiKSkudG8uZXF1YWwoXCJhLnR4dFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYWRkaXRpb25hbCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoQ29tYmluZShcIi9hL2JcIiwgdW5kZWZpbmVkKSkudG8uZXF1YWwoYCR7cGF0aC5zZXB9YSR7cGF0aC5zZXB9YmApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoLCBubyBzbGFzaCBhbmQgYWRkaXRpb25hbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhDb21iaW5lKFwiL2EvYlwiLCBcInRlc3QudHh0XCIpKS50by5lcXVhbChgJHtwYXRoLnNlcH1hJHtwYXRoLnNlcH1iJHtwYXRoLnNlcH10ZXN0LnR4dGApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoLCBzbGFzaCBhbmQgYWRkaXRpb25hbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhDb21iaW5lKFwiL2EvYi9cIiwgXCJ0ZXN0LnR4dFwiKSkudG8uZXF1YWwoYCR7cGF0aC5zZXB9YSR7cGF0aC5zZXB9YiR7cGF0aC5zZXB9dGVzdC50eHRgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInBhdGhEaXJlY3RvcnlSZWxhdGl2ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGFsbCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRGlyZWN0b3J5UmVsYXRpdmUodW5kZWZpbmVkLCB1bmRlZmluZWQpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoTmFtZTEgdW5kZWZpbmVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aERpcmVjdG9yeVJlbGF0aXZlKHVuZGVmaW5lZCwgXCIvYS9iXCIpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoTmFtZTIgdW5kZWZpbmVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aERpcmVjdG9yeVJlbGF0aXZlKFwiL2EvYlwiLCB1bmRlZmluZWQpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoTmFtZTEgYW5kIHBhdGhOYW1lMlwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZShcIi9hL2JcIiwgXCIvYS9iL2NcIikpLnRvLmVxdWFsKGAuJHtwYXRoLnNlcH1jJHtwYXRoLnNlcH1gKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInBhdGhGaWxlUmVsYXRpdmVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhbGwgdW5kZWZpbmVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEZpbGVSZWxhdGl2ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCkpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGhOYW1lMSB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRmlsZVJlbGF0aXZlKHVuZGVmaW5lZCwgXCIvYS9iXCIpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoTmFtZTIgdW5kZWZpbmVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEZpbGVSZWxhdGl2ZShcIi9hL2JcIiwgdW5kZWZpbmVkKSkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aE5hbWUxIGFuZCBwYXRoTmFtZTJcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRmlsZVJlbGF0aXZlKFwiL2EvYlwiLCBcIi9hL2IvYy90ZXN0LnR4dFwiKSkudG8uZXF1YWwoYC4ke3BhdGguc2VwfWMke3BhdGguc2VwfXRlc3QudHh0YCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwYXRoVG9XZWJcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoVG9XZWIodW5kZWZpbmVkKSkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggd2luZG93cyBzbGFzaGVzXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aFRvV2ViKFwiXFxcXGFcXFxcYlwiKSkudG8uZXF1YWwoXCIvYS9iXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bml4IHNsYXNoZXNcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoVG9XZWIoXCIvYS9iXCIpKS50by5lcXVhbChcIi9hL2JcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwYXRoQWJzb2x1dGVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoQWJzb2x1dGUodW5kZWZpbmVkKSkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcm9vdCBwYXRoXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEFic29sdXRlKFwiL2EvYlwiKSkudG8uZXF1YWwoYCR7cGF0aC5yZXNvbHZlKGAke3BhdGguc2VwfSR7cGF0aC5zZXB9YCl9YSR7cGF0aC5zZXB9YmApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCByZWxhdGl2ZSBwYXRoXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEFic29sdXRlKFwiLi9hL2JcIikpLnRvLmVxdWFsKGAke3BhdGgucmVzb2x2ZShcIi5cIil9JHtwYXRoLnNlcH1hJHtwYXRoLnNlcH1iYCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInBhdGhHZXREaXJlY3RvcnlcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoR2V0RGlyZWN0b3J5KHVuZGVmaW5lZCkpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vIHRyYWlsaW5nIHNsYXNoXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldERpcmVjdG9yeShcIi9hL2JcIikpLnRvLmVxdWFsKGAke3BhdGguc2VwfWEke3BhdGguc2VwfWIke3BhdGguc2VwfWApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB0cmFpbGluZyBzbGFzaFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhHZXREaXJlY3RvcnkoXCIvYS9iL1wiKSkudG8uZXF1YWwoYCR7cGF0aC5zZXB9YSR7cGF0aC5zZXB9YiR7cGF0aC5zZXB9YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgZmlsZSBuYW1lXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldERpcmVjdG9yeShcIi9hL2IvdGVtcC50eHRcIikpLnRvLmVxdWFsKGAke3BhdGguc2VwfWEke3BhdGguc2VwfWIke3BhdGguc2VwfWApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicGF0aEdldEZpbGVuYW1lXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldEZpbGVuYW1lKHVuZGVmaW5lZCkpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vIHRyYWlsaW5nIHNsYXNoXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldEZpbGVuYW1lKFwiL2EvYlwiKSkudG8uZXF1YWwoXCJiXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB0cmFpbGluZyBzbGFzaFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhHZXRGaWxlbmFtZShcIi9hL2IvXCIpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIGZpbGUgbmFtZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhHZXRGaWxlbmFtZShcIi9hL2IvdGVtcC50eHRcIikpLnRvLmVxdWFsKFwidGVtcC50eHRcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJkaXJlY3RvcnlFeGlzdHNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHModW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3RcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBwYXRoIGFuZCBzeW1saW5rIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9mb2xkZXJcIik7XG4gICAgICAgICAgICBjb25zdCBhc3luY1N5bWxpbmsgPSB1dGlsLnByb21pc2lmeShmcy5zeW1saW5rKTtcbiAgICAgICAgICAgIGF3YWl0IGFzeW5jU3ltbGluayhcIi4vdGVzdC91bml0L3RlbXAvZm9sZGVyXCIsIFwiLi90ZXN0L3VuaXQvdGVtcC9mb2xkZXJsaW5rXCIpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvZm9sZGVybGlua1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vbiBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL2JsYWhcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggaW52YWxpZCBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC9zcmMvZmlsZVN5c3RlbS9zcGVjLnRzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHRocm93IGFuIGVycm9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxzdGF0U3R1YiA9IHNhbmRib3guc3R1YihmcywgXCJsc3RhdFwiKTtcbiAgICAgICAgICAgIGxzdGF0U3R1Yi5jYWxsc0Zha2UoKGRpck5hbWU6IHN0cmluZywgY2I6IChlcnI6IE5vZGVKUy5FcnJub0V4Y2VwdGlvbiwgc3RhdHM6IGZzLlN0YXRzKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgY2IoeyBuYW1lOiBcImVyclwiLCBjb2RlOiBcImJsYWhcIiwgbWVzc2FnZTogXCJcIiB9LCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCI/Kj8qPyo/Kj8qXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyLmNvZGUpLnRvLmVxdWFsKFwiYmxhaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImRpcmVjdG9yeUNyZWF0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3RcIik7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBvYmouZGlyZWN0b3J5RXhpc3RzKFwiLi90ZXN0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm9uIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvZm9vL2JhclwiKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL2Zvby9iYXJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZGlyZWN0b3J5RGVsZXRlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5RGVsZXRlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvZm9vL2JhclwiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3Rvcnkgd2l0aCBmaWxlc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvZm9vL2JhclwiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9mb28vYmFyXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vbiBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL2JsYWhcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJkaXJlY3RvcnlHZXRGaWxlc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZpbGVzKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBub24gZXhpc3RpbmcgZGlyZWN0b3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5R2V0RmlsZXMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeSB3aXRoIGZpbGVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZpbGVzKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW1widGVtcC50eHRcIl0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3Rvcnkgd2l0aCBmaWxlcyBhbmQgZm9sZGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9mb29cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZpbGVzKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW1widGVtcC50eHRcIl0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZGlyZWN0b3J5R2V0Rm9sZGVyc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZvbGRlcnModW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vbiBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5kaXJlY3RvcnlHZXRGb2xkZXJzKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3Rvcnkgd2l0aCBmaWxlc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcInRlbXAudHh0XCIsIFwiYmxhaFwiKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5kaXJlY3RvcnlHZXRGb2xkZXJzKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmRlZXAuZXF1YWwoW10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBkaXJlY3Rvcnkgd2l0aCBmaWxlcyBhbmQgZm9sZGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9mb29cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZvbGRlcnMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXCJmb29cIl0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZUV4aXN0c1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmZpbGVFeGlzdHModW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5maWxlRXhpc3RzKHVuZGVmaW5lZCwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhpc3RpbmcgcGF0aCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcInRlbXAudHh0XCIsIFwiYmxhaFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhpc3RpbmcgcGF0aCBhbmQgc3ltbGluayBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgY29uc3QgYXN5bmNTeW1saW5rID0gdXRpbC5wcm9taXNpZnkoZnMuc3ltbGluayk7XG4gICAgICAgICAgICBhd2FpdCBhc3luY1N5bWxpbmsoXCIuL3Rlc3QvdW5pdC90ZW1wL3RlbXAudHh0XCIsIFwiLi90ZXN0L3VuaXQvdGVtcC90ZW1wbGluay50eHRcIik7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBvYmouZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJ0ZW1wbGluay50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiB0aHJvdyBhbiBlcnJvclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsc3RhdFN0dWIgPSBzYW5kYm94LnN0dWIoZnMsIFwibHN0YXRcIik7XG4gICAgICAgICAgICBsc3RhdFN0dWIuY2FsbHNGYWtlKChkaXJOYW1lOiBzdHJpbmcsIGNiOiAoZXJyOiBOb2RlSlMuRXJybm9FeGNlcHRpb24sIHN0YXRzOiBmcy5TdGF0cykgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNiKHsgbmFtZTogXCJlcnJcIiwgY29kZTogXCJibGFoXCIsIG1lc3NhZ2U6IFwiXCIgfSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBvYmouZmlsZUV4aXN0cyhcIj8qPyo/Kj8qPypcIiwgXCJcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIuY29kZSkudG8uZXF1YWwoXCJibGFoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZVdyaXRlVGV4dFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KHVuZGVmaW5lZCwgXCJ0ZW1wLnR4dFwiLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgdW5kZWZpbmVkIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZVRleHQudHh0XCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCBleGlzdCA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZVRleHQudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3QpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZVRleHQudHh0XCIsIFwiY29udGVudFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBvYmouZmlsZVJlYWRUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZVRleHQudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY29udGVudCkudG8uZXF1YWwoXCJjb250ZW50XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgYXBwZW5kIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZVRleHQyLnR4dFwiLCBcImNvbnRlbnRcIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGVUZXh0Mi50eHRcIiwgXCJleHRyYVwiLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBvYmouZmlsZVJlYWRUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZVRleHQyLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNvbnRlbnQpLnRvLmVxdWFsKFwiY29udGVudGV4dHJhXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZVdyaXRlTGluZXNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlV3JpdGVMaW5lcyh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVXcml0ZUxpbmVzKHVuZGVmaW5lZCwgXCJ0ZW1wLnR4dFwiLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgdW5kZWZpbmVkIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVMaW5lcyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUudHh0XCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCBleGlzdCA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUxpbmVzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS50eHRcIiwgW1wiY29udGVudFwiXSk7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgb2JqLmZpbGVSZWFkTGluZXMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNvbnRlbnQpLnRvLmRlZXAuZXF1YWwoW1wiY29udGVudFwiLCBcIlwiXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCBhcHBlbmQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUxpbmVzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS50eHRcIiwgW1wiY29udGVudFwiXSk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlTGluZXMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLnR4dFwiLCBbXCJleHRyYVwiXSwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgb2JqLmZpbGVSZWFkTGluZXMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNvbnRlbnQpLnRvLmRlZXAuZXF1YWwoW1wiY29udGVudFwiLCBcImV4dHJhXCIsIFwiXCJdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVXcml0ZUJpbmFyeVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVXcml0ZUJpbmFyeSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVXcml0ZUJpbmFyeSh1bmRlZmluZWQsIFwidGVtcC5iaW5cIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIHVuZGVmaW5lZCBjb250ZW50XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlQmluYXJ5KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5iaW5cIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0ID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmJpblwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0KS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCBjb250ZW50XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlQmluYXJ5KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5iaW5cIiwgbmV3IEJ1ZmZlcihcImNvbnRlbnRcIikpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IG9iai5maWxlUmVhZEJpbmFyeShcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUuYmluXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobmV3IEJ1ZmZlcihjb250ZW50KS50b1N0cmluZygpKS50by5lcXVhbChcImNvbnRlbnRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCBhcHBlbmQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUJpbmFyeShcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUuYmluXCIsIG5ldyBCdWZmZXIoXCJjb250ZW50XCIpKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVCaW5hcnkoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmJpblwiLCBuZXcgQnVmZmVyKFwiZXh0cmFcIiksIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IG9iai5maWxlUmVhZEJpbmFyeShcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUuYmluXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobmV3IEJ1ZmZlcihjb250ZW50KS50b1N0cmluZygpKS50by5lcXVhbChcImNvbnRlbnRleHRyYVwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVXcml0ZUpzb25cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlV3JpdGVKc29uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVdyaXRlSnNvbih1bmRlZmluZWQsIFwidGVtcC5qc29uXCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCB1bmRlZmluZWQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUpzb24oXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmpzb25cIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0ID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmpzb25cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUpzb24oXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmpzb25cIiwgeyBmb286IFwiMTIzXCIsIGJhcjogdHJ1ZX0pO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IG9iai5maWxlUmVhZEpzb24oXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmpzb25cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjb250ZW50KS50by5kZWVwLmVxdWFsKHsgZm9vOiBcIjEyM1wiLCBiYXI6IHRydWV9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVSZWFkVGV4dFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVSZWFkVGV4dCh1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZFRleHQodW5kZWZpbmVkLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZVJlYWRMaW5lc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVSZWFkTGluZXModW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVJlYWRMaW5lcyh1bmRlZmluZWQsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlUmVhZEJpbmFyeVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVSZWFkQmluYXJ5KHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVSZWFkQmluYXJ5KHVuZGVmaW5lZCwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVSZWFkSnNvblwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVSZWFkSnNvbih1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZEpzb24odW5kZWZpbmVkLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZURlbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVEZWxldGUodW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZURlbGV0ZSh1bmRlZmluZWQsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBsZXQgZXhpc3RzID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJ0ZW1wLnR4dFwiLCBcImJsYWhcIik7XG4gICAgICAgICAgICBleGlzdHMgPSBhd2FpdCBvYmouZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIGV4aXN0cyA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
