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
        sandbox = Sinon.createSandbox();
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
            yield obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", Buffer.from("content"));
            const content = yield obj.fileReadBinary("./test/unit/temp", "fileWrite.bin");
            Chai.expect(Buffer.from(content).toString()).to.equal("content");
        }));
        it("can be called with path and filename and append content", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new fileSystem_1.FileSystem();
            yield obj.directoryCreate("./test/unit/temp/");
            yield obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", Buffer.from("content"));
            yield obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", Buffer.from("extra"), true);
            const content = yield obj.fileReadBinary("./test/unit/temp", "fileWrite.bin");
            Chai.expect(Buffer.from(content).toString()).to.equal("contentextra");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZmlsZVN5c3RlbS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQiw2QkFBNkI7QUFDN0Isd0RBQXFEO0FBRXJELFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLElBQUksT0FBMkIsQ0FBQztJQUVoQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztJQUVILFNBQVMsQ0FBQyxHQUFTLEVBQUU7UUFDakIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xCLE1BQU0sR0FBRyxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1FBQzdCLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLE1BQU0sR0FBRyxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNFLENB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QUFHLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDL0MsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDckQsTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZmlsZVN5c3RlbS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgRmlsZVN5c3RlbS5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcInV0aWxcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2ZpbGVTeXN0ZW1cIjtcblxuZGVzY3JpYmUoXCJGaWxlU3lzdGVtXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5jcmVhdGVTYW5kYm94KCk7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwYXRoQ29tYmluZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGFsbCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoQ29tYmluZSh1bmRlZmluZWQsIHVuZGVmaW5lZCkpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggdW5kZWZpbmVkXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aENvbWJpbmUodW5kZWZpbmVkLCBcImEudHh0XCIpKS50by5lcXVhbChcImEudHh0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhZGRpdGlvbmFsIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhDb21iaW5lKFwiL2EvYlwiLCB1bmRlZmluZWQpKS50by5lcXVhbChgJHtwYXRoLnNlcH1hJHtwYXRoLnNlcH1iYCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGgsIG5vIHNsYXNoIGFuZCBhZGRpdGlvbmFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aENvbWJpbmUoXCIvYS9iXCIsIFwidGVzdC50eHRcIikpLnRvLmVxdWFsKGAke3BhdGguc2VwfWEke3BhdGguc2VwfWIke3BhdGguc2VwfXRlc3QudHh0YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGgsIHNsYXNoIGFuZCBhZGRpdGlvbmFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aENvbWJpbmUoXCIvYS9iL1wiLCBcInRlc3QudHh0XCIpKS50by5lcXVhbChgJHtwYXRoLnNlcH1hJHtwYXRoLnNlcH1iJHtwYXRoLnNlcH10ZXN0LnR4dGApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicGF0aERpcmVjdG9yeVJlbGF0aXZlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYWxsIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhEaXJlY3RvcnlSZWxhdGl2ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCkpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGhOYW1lMSB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRGlyZWN0b3J5UmVsYXRpdmUodW5kZWZpbmVkLCBcIi9hL2JcIikpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGhOYW1lMiB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRGlyZWN0b3J5UmVsYXRpdmUoXCIvYS9iXCIsIHVuZGVmaW5lZCkpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGhOYW1lMSBhbmQgcGF0aE5hbWUyXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aERpcmVjdG9yeVJlbGF0aXZlKFwiL2EvYlwiLCBcIi9hL2IvY1wiKSkudG8uZXF1YWwoYC4ke3BhdGguc2VwfWMke3BhdGguc2VwfWApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicGF0aEZpbGVSZWxhdGl2ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGFsbCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRmlsZVJlbGF0aXZlKHVuZGVmaW5lZCwgdW5kZWZpbmVkKSkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aE5hbWUxIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhGaWxlUmVsYXRpdmUodW5kZWZpbmVkLCBcIi9hL2JcIikpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGhOYW1lMiB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoRmlsZVJlbGF0aXZlKFwiL2EvYlwiLCB1bmRlZmluZWQpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoTmFtZTEgYW5kIHBhdGhOYW1lMlwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhGaWxlUmVsYXRpdmUoXCIvYS9iXCIsIFwiL2EvYi9jL3Rlc3QudHh0XCIpKS50by5lcXVhbChgLiR7cGF0aC5zZXB9YyR7cGF0aC5zZXB9dGVzdC50eHRgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInBhdGhUb1dlYlwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhUb1dlYih1bmRlZmluZWQpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB3aW5kb3dzIHNsYXNoZXNcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoVG9XZWIoXCJcXFxcYVxcXFxiXCIpKS50by5lcXVhbChcIi9hL2JcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuaXggc2xhc2hlc1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhUb1dlYihcIi9hL2JcIikpLnRvLmVxdWFsKFwiL2EvYlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInBhdGhBYnNvbHV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhBYnNvbHV0ZSh1bmRlZmluZWQpKS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCByb290IHBhdGhcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoQWJzb2x1dGUoXCIvYS9iXCIpKS50by5lcXVhbChgJHtwYXRoLnJlc29sdmUoYCR7cGF0aC5zZXB9JHtwYXRoLnNlcH1gKX1hJHtwYXRoLnNlcH1iYCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHJlbGF0aXZlIHBhdGhcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoQWJzb2x1dGUoXCIuL2EvYlwiKSkudG8uZXF1YWwoYCR7cGF0aC5yZXNvbHZlKFwiLlwiKX0ke3BhdGguc2VwfWEke3BhdGguc2VwfWJgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicGF0aEdldERpcmVjdG9yeVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3Qob2JqLnBhdGhHZXREaXJlY3RvcnkodW5kZWZpbmVkKSkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm8gdHJhaWxpbmcgc2xhc2hcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoR2V0RGlyZWN0b3J5KFwiL2EvYlwiKSkudG8uZXF1YWwoYCR7cGF0aC5zZXB9YSR7cGF0aC5zZXB9YiR7cGF0aC5zZXB9YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHRyYWlsaW5nIHNsYXNoXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldERpcmVjdG9yeShcIi9hL2IvXCIpKS50by5lcXVhbChgJHtwYXRoLnNlcH1hJHtwYXRoLnNlcH1iJHtwYXRoLnNlcH1gKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYSBmaWxlIG5hbWVcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoR2V0RGlyZWN0b3J5KFwiL2EvYi90ZW1wLnR4dFwiKSkudG8uZXF1YWwoYCR7cGF0aC5zZXB9YSR7cGF0aC5zZXB9YiR7cGF0aC5zZXB9YCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwYXRoR2V0RmlsZW5hbWVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoR2V0RmlsZW5hbWUodW5kZWZpbmVkKSkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm8gdHJhaWxpbmcgc2xhc2hcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG9iai5wYXRoR2V0RmlsZW5hbWUoXCIvYS9iXCIpKS50by5lcXVhbChcImJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHRyYWlsaW5nIHNsYXNoXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldEZpbGVuYW1lKFwiL2EvYi9cIikpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgZmlsZSBuYW1lXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChvYmoucGF0aEdldEZpbGVuYW1lKFwiL2EvYi90ZW1wLnR4dFwiKSkudG8uZXF1YWwoXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImRpcmVjdG9yeUV4aXN0c1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIi4vdGVzdFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIHBhdGggYW5kIHN5bWxpbmsgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL2ZvbGRlclwiKTtcbiAgICAgICAgICAgIGNvbnN0IGFzeW5jU3ltbGluayA9IHV0aWwucHJvbWlzaWZ5KGZzLnN5bWxpbmspO1xuICAgICAgICAgICAgYXdhaXQgYXN5bmNTeW1saW5rKFwiLi90ZXN0L3VuaXQvdGVtcC9mb2xkZXJcIiwgXCIuL3Rlc3QvdW5pdC90ZW1wL2ZvbGRlcmxpbmtcIik7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBvYmouZGlyZWN0b3J5RXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC9mb2xkZXJsaW5rXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm9uIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIi4vYmxhaFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBpbnZhbGlkIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIi4vdGVzdC91bml0L3NyYy9maWxlU3lzdGVtL3NwZWMudHNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gdGhyb3cgYW4gZXJyb3JcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbHN0YXRTdHViID0gc2FuZGJveC5zdHViKGZzLCBcImxzdGF0XCIpO1xuICAgICAgICAgICAgbHN0YXRTdHViLmNhbGxzRmFrZSgoZGlyTmFtZTogc3RyaW5nLCBjYjogKGVycjogTm9kZUpTLkVycm5vRXhjZXB0aW9uLCBzdGF0czogZnMuU3RhdHMpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICBjYih7IG5hbWU6IFwiZXJyXCIsIGNvZGU6IFwiYmxhaFwiLCBtZXNzYWdlOiBcIlwiIH0sIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIj8qPyo/Kj8qPypcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIuY29kZSkudG8uZXF1YWwoXCJibGFoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZGlyZWN0b3J5Q3JlYXRlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3RcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBub24gZXhpc3RpbmcgZGlyZWN0b3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9mb28vYmFyXCIpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvZm9vL2JhclwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJkaXJlY3RvcnlEZWxldGVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhpc3RpbmcgZGlyZWN0b3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9mb28vYmFyXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmRpcmVjdG9yeUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeSB3aXRoIGZpbGVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9mb28vYmFyXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wL2Zvby9iYXJcIiwgXCJ0ZW1wLnR4dFwiLCBcImJsYWhcIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5RGVsZXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBvYmouZGlyZWN0b3J5RXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm9uIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeURlbGV0ZShcIi4vYmxhaFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImRpcmVjdG9yeUdldEZpbGVzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5R2V0RmlsZXModW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vbiBleGlzdGluZyBkaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5kaXJlY3RvcnlHZXRGaWxlcyhcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5kZWVwLmVxdWFsKFtdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhpc3RpbmcgZGlyZWN0b3J5IHdpdGggZmlsZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJ0ZW1wLnR4dFwiLCBcImJsYWhcIik7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5R2V0RmlsZXMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXCJ0ZW1wLnR4dFwiXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeSB3aXRoIGZpbGVzIGFuZCBmb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL2Zvb1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJ0ZW1wLnR4dFwiLCBcImJsYWhcIik7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5R2V0RmlsZXMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXCJ0ZW1wLnR4dFwiXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJkaXJlY3RvcnlHZXRGb2xkZXJzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5R2V0Rm9sZGVycyh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5kZWVwLmVxdWFsKFtdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm9uIGV4aXN0aW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZvbGRlcnMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeSB3aXRoIGZpbGVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmRpcmVjdG9yeUdldEZvbGRlcnMoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZGVlcC5lcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4aXN0aW5nIGRpcmVjdG9yeSB3aXRoIGZpbGVzIGFuZCBmb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL2Zvb1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJ0ZW1wLnR4dFwiLCBcImJsYWhcIik7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZGlyZWN0b3J5R2V0Rm9sZGVycyhcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5kZWVwLmVxdWFsKFtcImZvb1wiXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlRXhpc3RzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBvYmouZmlsZUV4aXN0cyh1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmZpbGVFeGlzdHModW5kZWZpbmVkLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBvYmouZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBwYXRoIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBleGlzdGluZyBwYXRoIGFuZCBzeW1saW5rIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJ0ZW1wLnR4dFwiLCBcImJsYWhcIik7XG4gICAgICAgICAgICBjb25zdCBhc3luY1N5bWxpbmsgPSB1dGlsLnByb21pc2lmeShmcy5zeW1saW5rKTtcbiAgICAgICAgICAgIGF3YWl0IGFzeW5jU3ltbGluayhcIi4vdGVzdC91bml0L3RlbXAvdGVtcC50eHRcIiwgXCIuL3Rlc3QvdW5pdC90ZW1wL3RlbXBsaW5rLnR4dFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcInRlbXBsaW5rLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHRocm93IGFuIGVycm9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxzdGF0U3R1YiA9IHNhbmRib3guc3R1YihmcywgXCJsc3RhdFwiKTtcbiAgICAgICAgICAgIGxzdGF0U3R1Yi5jYWxsc0Zha2UoKGRpck5hbWU6IHN0cmluZywgY2I6IChlcnI6IE5vZGVKUy5FcnJub0V4Y2VwdGlvbiwgc3RhdHM6IGZzLlN0YXRzKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgY2IoeyBuYW1lOiBcImVyclwiLCBjb2RlOiBcImJsYWhcIiwgbWVzc2FnZTogXCJcIiB9LCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IG9iai5maWxlRXhpc3RzKFwiPyo/Kj8qPyo/KlwiLCBcIlwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci5jb2RlKS50by5lcXVhbChcImJsYWhcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlV3JpdGVUZXh0XCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQodW5kZWZpbmVkLCBcInRlbXAudHh0XCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCB1bmRlZmluZWQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlVGV4dC50eHRcIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0ID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlVGV4dC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdCkudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlVGV4dC50eHRcIiwgXCJjb250ZW50XCIpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IG9iai5maWxlUmVhZFRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlVGV4dC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjb250ZW50KS50by5lcXVhbChcImNvbnRlbnRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCBhcHBlbmQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvXCIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlVGV4dDIudHh0XCIsIFwiY29udGVudFwiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZVRleHQyLnR4dFwiLCBcImV4dHJhXCIsIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IG9iai5maWxlUmVhZFRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlVGV4dDIudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY29udGVudCkudG8uZXF1YWwoXCJjb250ZW50ZXh0cmFcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlV3JpdGVMaW5lc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVXcml0ZUxpbmVzKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVdyaXRlTGluZXModW5kZWZpbmVkLCBcInRlbXAudHh0XCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCB1bmRlZmluZWQgY29udGVudFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUxpbmVzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS50eHRcIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0ID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0KS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHBhdGggYW5kIGZpbGVuYW1lIGFuZCBjb250ZW50XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlTGluZXMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLnR4dFwiLCBbXCJjb250ZW50XCJdKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBvYmouZmlsZVJlYWRMaW5lcyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY29udGVudCkudG8uZGVlcC5lcXVhbChbXCJjb250ZW50XCIsIFwiXCJdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIGFwcGVuZCBjb250ZW50XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlTGluZXMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLnR4dFwiLCBbXCJjb250ZW50XCJdKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVMaW5lcyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUudHh0XCIsIFtcImV4dHJhXCJdLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBvYmouZmlsZVJlYWRMaW5lcyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY29udGVudCkudG8uZGVlcC5lcXVhbChbXCJjb250ZW50XCIsIFwiZXh0cmFcIiwgXCJcIl0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZVdyaXRlQmluYXJ5XCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVdyaXRlQmluYXJ5KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVdyaXRlQmluYXJ5KHVuZGVmaW5lZCwgXCJ0ZW1wLmJpblwiLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgdW5kZWZpbmVkIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVCaW5hcnkoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmJpblwiLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3QgPSBhd2FpdCBvYmouZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUuYmluXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3QpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVCaW5hcnkoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmJpblwiLCBCdWZmZXIuZnJvbShcImNvbnRlbnRcIikpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IG9iai5maWxlUmVhZEJpbmFyeShcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUuYmluXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoQnVmZmVyLmZyb20oY29udGVudCkudG9TdHJpbmcoKSkudG8uZXF1YWwoXCJjb250ZW50XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgYXBwZW5kIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVCaW5hcnkoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwiZmlsZVdyaXRlLmJpblwiLCBCdWZmZXIuZnJvbShcImNvbnRlbnRcIikpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVXcml0ZUJpbmFyeShcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUuYmluXCIsIEJ1ZmZlci5mcm9tKFwiZXh0cmFcIiksIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IG9iai5maWxlUmVhZEJpbmFyeShcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJmaWxlV3JpdGUuYmluXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoQnVmZmVyLmZyb20oY29udGVudCkudG9TdHJpbmcoKSkudG8uZXF1YWwoXCJjb250ZW50ZXh0cmFcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlV3JpdGVKc29uXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVdyaXRlSnNvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVXcml0ZUpzb24odW5kZWZpbmVkLCBcInRlbXAuanNvblwiLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZSBhbmQgdW5kZWZpbmVkIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVKc29uKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5qc29uXCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCBleGlzdCA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5qc29uXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3QpLnRvLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGF0aCBhbmQgZmlsZW5hbWUgYW5kIGNvbnRlbnRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5maWxlV3JpdGVKc29uKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5qc29uXCIsIHsgZm9vOiBcIjEyM1wiLCBiYXI6IHRydWV9KTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBvYmouZmlsZVJlYWRKc29uKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcImZpbGVXcml0ZS5qc29uXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY29udGVudCkudG8uZGVlcC5lcXVhbCh7IGZvbzogXCIxMjNcIiwgYmFyOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlUmVhZFRleHRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZFRleHQodW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVJlYWRUZXh0KHVuZGVmaW5lZCwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVSZWFkTGluZXNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZExpbmVzKHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVSZWFkTGluZXModW5kZWZpbmVkLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZVJlYWRCaW5hcnlcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZEJpbmFyeSh1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBhbmQgZmlsZW5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZEJpbmFyeSh1bmRlZmluZWQsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWxlUmVhZEpzb25cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlUmVhZEpzb24odW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgYW5kIGZpbGVuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtKCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmouZmlsZVJlYWRKc29uKHVuZGVmaW5lZCwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbGVEZWxldGVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW0oKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5maWxlRGVsZXRlKHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLmZpbGVEZWxldGUodW5kZWZpbmVkLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXRoIGFuZCBmaWxlbmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICAgICAgbGV0IGV4aXN0cyA9IGF3YWl0IG9iai5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcFwiLCBcInRlbXAudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC9cIik7XG4gICAgICAgICAgICBhd2FpdCBvYmouZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidGVtcC50eHRcIiwgXCJibGFoXCIpO1xuICAgICAgICAgICAgZXhpc3RzID0gYXdhaXQgb2JqLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmZpbGVEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIsIFwidGVtcC50eHRcIik7XG4gICAgICAgICAgICBleGlzdHMgPSBhd2FpdCBvYmouZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXBcIiwgXCJ0ZW1wLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
