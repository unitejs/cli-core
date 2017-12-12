/**
 * Tests for FileSystem.
 */
import * as Chai from "chai";
import * as fs from "fs";
import * as path from "path";
import * as Sinon from "sinon";
import * as util from "util";
import { FileSystem } from "../../../src/fileSystem";

describe("FileSystem", () => {
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
    });

    afterEach(async () => {
        sandbox.restore();
        const obj = new FileSystem();
        await obj.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new FileSystem();
        Chai.should().exist(obj);
    });

    describe("pathCombine", () => {
        it("can be called with all undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathCombine(undefined, undefined)).to.equal(undefined);
        });

        it("can be called with path undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathCombine(undefined, "a.txt")).to.equal("a.txt");
        });

        it("can be called with additional undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathCombine("/a/b", undefined)).to.equal(`${path.sep}a${path.sep}b`);
        });

        it("can be called with path, no slash and additional", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathCombine("/a/b", "test.txt")).to.equal(`${path.sep}a${path.sep}b${path.sep}test.txt`);
        });

        it("can be called with path, slash and additional", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathCombine("/a/b/", "test.txt")).to.equal(`${path.sep}a${path.sep}b${path.sep}test.txt`);
        });
    });

    describe("pathDirectoryRelative", () => {
        it("can be called with all undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathDirectoryRelative(undefined, undefined)).to.equal(undefined);
        });

        it("can be called with pathName1 undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathDirectoryRelative(undefined, "/a/b")).to.equal(undefined);
        });

        it("can be called with pathName2 undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathDirectoryRelative("/a/b", undefined)).to.equal(undefined);
        });

        it("can be called with pathName1 and pathName2", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathDirectoryRelative("/a/b", "/a/b/c")).to.equal(`.${path.sep}c${path.sep}`);
        });
    });

    describe("pathFileRelative", () => {
        it("can be called with all undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathFileRelative(undefined, undefined)).to.equal(undefined);
        });

        it("can be called with pathName1 undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathFileRelative(undefined, "/a/b")).to.equal(undefined);
        });

        it("can be called with pathName2 undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathFileRelative("/a/b", undefined)).to.equal(undefined);
        });

        it("can be called with pathName1 and pathName2", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathFileRelative("/a/b", "/a/b/c/test.txt")).to.equal(`.${path.sep}c${path.sep}test.txt`);
        });
    });

    describe("pathToWeb", () => {
        it("can be called with undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathToWeb(undefined)).to.equal(undefined);
        });

        it("can be called with windows slashes", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathToWeb("\\a\\b")).to.equal("/a/b");
        });

        it("can be called with unix slashes", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathToWeb("/a/b")).to.equal("/a/b");
        });
    });

    describe("pathAbsolute", () => {
        it("can be called with undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathAbsolute(undefined)).to.equal(undefined);
        });

        it("can be called with root path", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathAbsolute("/a/b")).to.equal(`${path.resolve(`${path.sep}${path.sep}`)}a${path.sep}b`);
        });

        it("can be called with relative path", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathAbsolute("./a/b")).to.equal(`${path.resolve(".")}${path.sep}a${path.sep}b`);
        });

    });

    describe("pathGetDirectory", () => {
        it("can be called with undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathGetDirectory(undefined)).to.equal(undefined);
        });

        it("can be called with no trailing slash", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathGetDirectory("/a/b")).to.equal(`${path.sep}a${path.sep}b${path.sep}`);
        });

        it("can be called with trailing slash", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathGetDirectory("/a/b/")).to.equal(`${path.sep}a${path.sep}b${path.sep}`);
        });

        it("can be called with a file name", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathGetDirectory("/a/b/temp.txt")).to.equal(`${path.sep}a${path.sep}b${path.sep}`);
        });
    });

    describe("pathGetFilename", () => {
        it("can be called with undefined", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathGetFilename(undefined)).to.equal(undefined);
        });

        it("can be called with no trailing slash", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathGetFilename("/a/b")).to.equal("b");
        });

        it("can be called with trailing slash", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathGetFilename("/a/b/")).to.equal(undefined);
        });

        it("can be called with a file name", () => {
            const obj = new FileSystem();
            Chai.expect(obj.pathGetFilename("/a/b/temp.txt")).to.equal("temp.txt");
        });
    });

    describe("directoryExists", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const exists = await obj.directoryExists(undefined);
            Chai.expect(exists).to.equal(false);
        });

        it("can be called with existing directory", async () => {
            const obj = new FileSystem();
            const exists = await obj.directoryExists("./test");
            Chai.expect(exists).to.equal(true);
        });

        it("can be called with existing path and symlink filename", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.directoryCreate("./test/unit/temp/folder");
            const asyncSymlink = util.promisify(fs.symlink);
            await asyncSymlink("./test/unit/temp/folder", "./test/unit/temp/folderlink");
            const exists = await obj.directoryExists("./test/unit/temp/folderlink");
            Chai.expect(exists).to.equal(true);
        });

        it("can be called with non existing directory", async () => {
            const obj = new FileSystem();
            const exists = await obj.directoryExists("./blah");
            Chai.expect(exists).to.equal(false);
        });

        it("can be called with invalid directory", async () => {
            const obj = new FileSystem();
            const exists = await obj.directoryExists("./test/unit/src/fileSystem/spec.ts");
            Chai.expect(exists).to.equal(false);
        });

        it("can throw an error", async () => {
            const lstatStub = sandbox.stub(fs, "lstat");
            lstatStub.callsFake((dirName: string, cb: (err: NodeJS.ErrnoException, stats: fs.Stats) => void) => {
                cb({ name: "err", code: "blah", message: "" }, undefined);
            });

            const obj = new FileSystem();
            try {
                await obj.directoryExists("?*?*?*?*?*");
            } catch (err) {
                Chai.expect(err.code).to.equal("blah");
            }
        });
    });

    describe("directoryCreate", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.directoryCreate(undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with existing directory", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test");
            const exists = await obj.directoryExists("./test");
            Chai.expect(exists).to.equal(true);
        });

        it("can be called with non existing directory", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/foo/bar");
            const exists = await obj.directoryExists("./test/unit/temp/foo/bar");
            Chai.expect(exists).to.equal(true);
        });
    });

    describe("directoryDelete", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.directoryDelete(undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with existing directory", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/foo/bar");
            await obj.directoryDelete("./test/unit/temp/");
            const exists = await obj.directoryExists("./test/unit/temp/");
            Chai.expect(exists).to.equal(false);
        });

        it("can be called with existing directory with files", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/foo/bar");
            await obj.fileWriteText("./test/unit/temp/foo/bar", "temp.txt", "blah");
            await obj.directoryDelete("./test/unit/temp/");
            const exists = await obj.directoryExists("./test/unit/temp/");
            Chai.expect(exists).to.equal(false);
        });

        it("can be called with non existing directory", async () => {
            const obj = new FileSystem();
            const ret = await obj.directoryDelete("./blah");
            Chai.expect(ret).to.equal(undefined);
        });
    });

    describe("directoryGetFiles", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.directoryGetFiles(undefined);
            Chai.expect(ret).to.deep.equal([]);
        });

        it("can be called with non existing directory", async () => {
            const obj = new FileSystem();
            const ret = await obj.directoryGetFiles("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal([]);
        });

        it("can be called with existing directory with files", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            const ret = await obj.directoryGetFiles("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal(["temp.txt"]);
        });

        it("can be called with existing directory with files and folder", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/foo");
            await obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            const ret = await obj.directoryGetFiles("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal(["temp.txt"]);
        });
    });

    describe("directoryGetFolders", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.directoryGetFolders(undefined);
            Chai.expect(ret).to.deep.equal([]);
        });

        it("can be called with non existing directory", async () => {
            const obj = new FileSystem();
            const ret = await obj.directoryGetFolders("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal([]);
        });

        it("can be called with existing directory with files", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            const ret = await obj.directoryGetFolders("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal([]);
        });

        it("can be called with existing directory with files and folder", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/foo");
            await obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            const ret = await obj.directoryGetFolders("./test/unit/temp/");
            Chai.expect(ret).to.deep.equal(["foo"]);
        });
    });

    describe("fileExists", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const exists = await obj.fileExists(undefined, undefined);
            Chai.expect(exists).to.equal(false);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const exists = await obj.fileExists(undefined, "temp.txt");
            Chai.expect(exists).to.equal(false);
        });

        it("can be called with path and filename", async () => {
            const obj = new FileSystem();
            const exists = await obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(false);
        });

        it("can be called with existing path and filename", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteText("./test/unit/temp", "temp.txt", "blah");
            const exists = await obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(true);
        });

        it("can be called with existing path and symlink filename", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteText("./test/unit/temp", "temp.txt", "blah");
            const asyncSymlink = util.promisify(fs.symlink);
            await asyncSymlink("./test/unit/temp/temp.txt", "./test/unit/temp/templink.txt");
            const exists = await obj.fileExists("./test/unit/temp", "templink.txt");
            Chai.expect(exists).to.equal(true);
        });

        it("can throw an error", async () => {
            const lstatStub = sandbox.stub(fs, "lstat");
            lstatStub.callsFake((dirName: string, cb: (err: NodeJS.ErrnoException, stats: fs.Stats) => void) => {
                cb({ name: "err", code: "blah", message: "" }, undefined);
            });

            const obj = new FileSystem();
            try {
                await obj.fileExists("?*?*?*?*?*", "");
            } catch (err) {
                Chai.expect(err.code).to.equal("blah");
            }
        });
    });

    describe("fileWriteText", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileWriteText(undefined, undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileWriteText(undefined, "temp.txt", undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with path and filename and undefined content", async () => {
            const obj = new FileSystem();
            await obj.fileWriteText("./test/unit/temp", "fileWriteText.txt", undefined);
            const exist = await obj.fileExists("./test/unit/temp", "fileWriteText.txt");
            Chai.expect(exist).to.equal(false);
        });

        it("can be called with path and filename and content", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteText("./test/unit/temp", "fileWriteText.txt", "content");
            const content = await obj.fileReadText("./test/unit/temp", "fileWriteText.txt");
            Chai.expect(content).to.equal("content");
        });

        it("can be called with path and filename and append content", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteText("./test/unit/temp", "fileWriteText2.txt", "content");
            await obj.fileWriteText("./test/unit/temp", "fileWriteText2.txt", "extra", true);
            const content = await obj.fileReadText("./test/unit/temp", "fileWriteText2.txt");
            Chai.expect(content).to.equal("contentextra");
        });
    });

    describe("fileWriteLines", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileWriteLines(undefined, undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileWriteLines(undefined, "temp.txt", undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with path and filename and undefined content", async () => {
            const obj = new FileSystem();
            await obj.fileWriteLines("./test/unit/temp", "fileWrite.txt", undefined);
            const exist = await obj.fileExists("./test/unit/temp", "fileWrite.txt");
            Chai.expect(exist).to.equal(false);
        });

        it("can be called with path and filename and content", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteLines("./test/unit/temp", "fileWrite.txt", ["content"]);
            const content = await obj.fileReadLines("./test/unit/temp", "fileWrite.txt");
            Chai.expect(content).to.deep.equal(["content", ""]);
        });

        it("can be called with path and filename and append content", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteLines("./test/unit/temp", "fileWrite.txt", ["content"]);
            await obj.fileWriteLines("./test/unit/temp", "fileWrite.txt", ["extra"], true);
            const content = await obj.fileReadLines("./test/unit/temp", "fileWrite.txt");
            Chai.expect(content).to.deep.equal(["content", "extra", ""]);
        });
    });

    describe("fileWriteBinary", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileWriteBinary(undefined, undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileWriteBinary(undefined, "temp.bin", undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with path and filename and undefined content", async () => {
            const obj = new FileSystem();
            await obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", undefined);
            const exist = await obj.fileExists("./test/unit/temp", "fileWrite.bin");
            Chai.expect(exist).to.equal(false);
        });

        it("can be called with path and filename and content", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", new Buffer("content"));
            const content = await obj.fileReadBinary("./test/unit/temp", "fileWrite.bin");
            Chai.expect(new Buffer(content).toString()).to.equal("content");
        });

        it("can be called with path and filename and append content", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", new Buffer("content"));
            await obj.fileWriteBinary("./test/unit/temp", "fileWrite.bin", new Buffer("extra"), true);
            const content = await obj.fileReadBinary("./test/unit/temp", "fileWrite.bin");
            Chai.expect(new Buffer(content).toString()).to.equal("contentextra");
        });
    });

    describe("fileWriteJson", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileWriteJson(undefined, undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileWriteJson(undefined, "temp.json", undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with path and filename and undefined content", async () => {
            const obj = new FileSystem();
            await obj.fileWriteJson("./test/unit/temp", "fileWrite.json", undefined);
            const exist = await obj.fileExists("./test/unit/temp", "fileWrite.json");
            Chai.expect(exist).to.equal(false);
        });

        it("can be called with path and filename and content", async () => {
            const obj = new FileSystem();
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteJson("./test/unit/temp", "fileWrite.json", { foo: "123", bar: true});
            const content = await obj.fileReadJson("./test/unit/temp", "fileWrite.json");
            Chai.expect(content).to.deep.equal({ foo: "123", bar: true});
        });
    });

    describe("fileReadText", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileReadText(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileReadText(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        });
    });

    describe("fileReadLines", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileReadLines(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileReadLines(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        });
    });

    describe("fileReadBinary", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileReadBinary(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileReadBinary(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        });
    });

    describe("fileReadJson", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileReadJson(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileReadJson(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        });
    });

    describe("fileDelete", () => {
        it("can be called with undefined", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileDelete(undefined, undefined);
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with undefined and filename", async () => {
            const obj = new FileSystem();
            const ret = await obj.fileDelete(undefined, "temp.txt");
            Chai.expect(ret).to.equal(undefined);
        });

        it("can be called with path and filename", async () => {
            const obj = new FileSystem();
            let exists = await obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(false);
            await obj.directoryCreate("./test/unit/temp/");
            await obj.fileWriteText("./test/unit/temp/", "temp.txt", "blah");
            exists = await obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(true);
            await obj.fileDelete("./test/unit/temp", "temp.txt");
            exists = await obj.fileExists("./test/unit/temp", "temp.txt");
            Chai.expect(exists).to.equal(false);
        });
    });
});
