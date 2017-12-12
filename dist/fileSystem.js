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
 * File system class
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const util = require("util");
class FileSystem {
    pathCombine(pathName, additional) {
        if (pathName === null || pathName === undefined) {
            return this.cleanupSeparators(additional);
        }
        else if (additional === null || additional === undefined) {
            return this.cleanupSeparators(pathName);
        }
        else {
            return path.join(this.cleanupSeparators(pathName), this.cleanupSeparators(additional));
        }
    }
    pathDirectoryRelative(pathName1, pathName2) {
        if (pathName1 === null || pathName1 === undefined) {
            return pathName1;
        }
        else if (pathName2 === null || pathName2 === undefined) {
            return pathName2;
        }
        else {
            return `.${path.sep}${path.relative(pathName1, pathName2)}${path.sep}`;
        }
    }
    pathFileRelative(pathName1, pathName2) {
        if (pathName1 === null || pathName1 === undefined) {
            return pathName1;
        }
        else if (pathName2 === null || pathName2 === undefined) {
            return pathName2;
        }
        else {
            return `.${path.sep}${path.relative(pathName1, pathName2)}`;
        }
    }
    pathToWeb(pathName) {
        if (pathName === null || pathName === undefined) {
            return pathName;
        }
        else {
            return pathName.replace(/\\/g, "/");
        }
    }
    pathAbsolute(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            return path.resolve(this.cleanupSeparators(pathName));
        }
    }
    pathGetDirectory(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            let newPathName = this.cleanupSeparators(pathName);
            if (!/.*\.(.*)$/.test(newPathName)) {
                newPathName = path.join(newPathName, "dummy.file");
            }
            return path.dirname(newPathName) + path.sep;
        }
    }
    pathGetFilename(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            const newPathName = this.cleanupSeparators(pathName);
            if (/[\/\\]+$/.test(newPathName)) {
                return undefined;
            }
            else {
                return path.basename(newPathName);
            }
        }
    }
    directoryExists(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null) {
                return false;
            }
            else {
                try {
                    const stats = yield util.promisify(fs.lstat)(this.cleanupSeparators(directoryName));
                    return stats.isDirectory() || stats.isSymbolicLink();
                }
                catch (err) {
                    if (err.code === "ENOENT") {
                        return false;
                    }
                    else {
                        throw err;
                    }
                }
            }
        });
    }
    directoryCreate(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null) {
                const parts = this.cleanupSeparators(directoryName).split(path.sep);
                for (let i = 0; i < parts.length; i++) {
                    const dName = parts.slice(0, i + 1).join(path.sep);
                    const dirExists = yield this.directoryExists(dName);
                    if (!dirExists) {
                        yield util.promisify(fs.mkdir)(dName);
                    }
                }
            }
        });
    }
    directoryDelete(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null) {
                const newDirectoryName = this.cleanupSeparators(directoryName);
                const dirExists = yield this.directoryExists(newDirectoryName);
                if (dirExists) {
                    const files = yield util.promisify(fs.readdir)(newDirectoryName);
                    for (let i = 0; i < files.length; i++) {
                        const curPath = path.join(newDirectoryName, files[i]);
                        const stat = yield util.promisify(fs.lstat)(curPath);
                        if (stat.isDirectory()) {
                            yield this.directoryDelete(curPath);
                        }
                        else {
                            yield util.promisify(fs.unlink)(curPath);
                        }
                    }
                    return util.promisify(fs.rmdir)(newDirectoryName);
                }
            }
        });
    }
    directoryGetFiles(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirFiles = [];
            if (directoryName !== undefined && directoryName !== null) {
                const newDirectoryName = this.cleanupSeparators(directoryName);
                const dirExists = yield this.directoryExists(newDirectoryName);
                if (dirExists) {
                    const files = yield util.promisify(fs.readdir)(newDirectoryName);
                    for (let i = 0; i < files.length; i++) {
                        const curPath = path.join(newDirectoryName, files[i]);
                        const stat = yield util.promisify(fs.lstat)(curPath);
                        if (stat.isFile()) {
                            dirFiles.push(files[i]);
                        }
                    }
                }
            }
            return dirFiles;
        });
    }
    directoryGetFolders(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirFolders = [];
            if (directoryName !== undefined && directoryName !== null) {
                const newDirectoryName = this.cleanupSeparators(directoryName);
                const dirExists = yield this.directoryExists(newDirectoryName);
                if (dirExists) {
                    const files = yield util.promisify(fs.readdir)(newDirectoryName);
                    for (let i = 0; i < files.length; i++) {
                        const curPath = path.join(newDirectoryName, files[i]);
                        const stat = yield util.promisify(fs.lstat)(curPath);
                        if (stat.isDirectory()) {
                            dirFolders.push(files[i]);
                        }
                    }
                }
            }
            return dirFolders;
        });
    }
    fileExists(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return false;
            }
            else {
                try {
                    const stat = yield util.promisify(fs.lstat)(path.join(this.cleanupSeparators(directoryName), fileName));
                    return stat.isFile() || stat.isSymbolicLink();
                }
                catch (err) {
                    if (err.code === "ENOENT") {
                        return false;
                    }
                    else {
                        throw err;
                    }
                }
            }
        });
    }
    fileWriteText(directoryName, fileName, content, append) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null &&
                fileName !== undefined && fileName !== null &&
                content !== undefined && content !== null) {
                return util.promisify(append ? fs.appendFile : fs.writeFile)(path.join(this.cleanupSeparators(directoryName), fileName), content);
            }
        });
    }
    fileWriteLines(directoryName, fileName, lines, append) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null &&
                fileName !== undefined && fileName !== null &&
                lines !== undefined && lines !== null) {
                return util.promisify(append ? fs.appendFile : fs.writeFile)(path.join(this.cleanupSeparators(directoryName), fileName), lines.join(os.EOL) + os.EOL);
            }
        });
    }
    fileWriteBinary(directoryName, fileName, data, append) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null &&
                fileName !== undefined && fileName !== null &&
                data !== undefined && data !== null) {
                return util.promisify(append ? fs.appendFile : fs.writeFile)(path.join(this.cleanupSeparators(directoryName), fileName), data);
            }
        });
    }
    fileWriteJson(directoryName, fileName, object) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null &&
                fileName !== undefined && fileName !== null &&
                object !== undefined && object !== null) {
                return util.promisify(fs.writeFile)(path.join(this.cleanupSeparators(directoryName), fileName), jsonHelper_1.JsonHelper.stringify(object, "\t"));
            }
        });
    }
    fileReadText(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                const data = yield util.promisify(fs.readFile)(path.join(this.cleanupSeparators(directoryName), fileName));
                return data.toString();
            }
        });
    }
    fileReadLines(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                const data = yield util.promisify(fs.readFile)(path.join(this.cleanupSeparators(directoryName), fileName));
                return data.toString().replace(/\r/g, "").split("\n");
            }
        });
    }
    fileReadBinary(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                return util.promisify(fs.readFile)(path.join(this.cleanupSeparators(directoryName), fileName));
            }
        });
    }
    fileReadJson(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                const data = yield util.promisify(fs.readFile)(path.join(this.cleanupSeparators(directoryName), fileName));
                return JSON.parse(data.toString());
            }
        });
    }
    fileDelete(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                return util.promisify(fs.unlink)(path.join(this.cleanupSeparators(directoryName), fileName));
            }
        });
    }
    cleanupSeparators(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            return path.normalize(pathName);
        }
    }
}
exports.FileSystem = FileSystem;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUMsYUFBcUIsRUFBRSxRQUFnQjs7WUFDM0QsRUFBRSxDQUFDLENBQUMsYUFBYSxLQUFLLFNBQVMsSUFBSSxhQUFhLEtBQUssSUFBSTtnQkFDckQsUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakcsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGlCQUFpQixDQUFDLFFBQWdCO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxTQUFTLElBQUksUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQyxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBcFJELGdDQW9SQyIsImZpbGUiOiJmaWxlU3lzdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaWxlIHN5c3RlbSBjbGFzc1xuICovXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCAqIGFzIG9zIGZyb20gXCJvc1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgSnNvbkhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvanNvbkhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCJ1dGlsXCI7XG5cbmV4cG9ydCBjbGFzcyBGaWxlU3lzdGVtIGltcGxlbWVudHMgSUZpbGVTeXN0ZW0ge1xuICAgIHB1YmxpYyBwYXRoQ29tYmluZShwYXRoTmFtZTogc3RyaW5nLCBhZGRpdGlvbmFsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IG51bGwgfHwgcGF0aE5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoYWRkaXRpb25hbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYWRkaXRpb25hbCA9PT0gbnVsbCB8fCBhZGRpdGlvbmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhwYXRoTmFtZSksIHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoYWRkaXRpb25hbCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhEaXJlY3RvcnlSZWxhdGl2ZShwYXRoTmFtZTE6IHN0cmluZywgcGF0aE5hbWUyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUxID09PSBudWxsIHx8IHBhdGhOYW1lMSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWUxO1xuICAgICAgICB9IGVsc2UgaWYgKHBhdGhOYW1lMiA9PT0gbnVsbCB8fCBwYXRoTmFtZTIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgLiR7cGF0aC5zZXB9JHtwYXRoLnJlbGF0aXZlKHBhdGhOYW1lMSwgcGF0aE5hbWUyKX0ke3BhdGguc2VwfWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aEZpbGVSZWxhdGl2ZShwYXRoTmFtZTE6IHN0cmluZywgcGF0aE5hbWUyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUxID09PSBudWxsIHx8IHBhdGhOYW1lMSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWUxO1xuICAgICAgICB9IGVsc2UgaWYgKHBhdGhOYW1lMiA9PT0gbnVsbCB8fCBwYXRoTmFtZTIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgLiR7cGF0aC5zZXB9JHtwYXRoLnJlbGF0aXZlKHBhdGhOYW1lMSwgcGF0aE5hbWUyKX1gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhUb1dlYihwYXRoTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lID09PSBudWxsIHx8IHBhdGhOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoQWJzb2x1dGUocGF0aE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHBhdGhOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMocGF0aE5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoR2V0RGlyZWN0b3J5KHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXRoTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG5ld1BhdGhOYW1lID0gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhwYXRoTmFtZSk7XG4gICAgICAgICAgICBpZiAoIS8uKlxcLiguKikkLy50ZXN0KG5ld1BhdGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIG5ld1BhdGhOYW1lID0gcGF0aC5qb2luKG5ld1BhdGhOYW1lLCBcImR1bW15LmZpbGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5kaXJuYW1lKG5ld1BhdGhOYW1lKSArIHBhdGguc2VwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhHZXRGaWxlbmFtZShwYXRoTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lID09PSB1bmRlZmluZWQgfHwgcGF0aE5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhOYW1lID0gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhwYXRoTmFtZSk7XG4gICAgICAgICAgICBpZiAoL1tcXC9cXFxcXSskLy50ZXN0KG5ld1BhdGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKG5ld1BhdGhOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBkaXJlY3RvcnlFeGlzdHMoZGlyZWN0b3J5TmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSB1bmRlZmluZWQgfHwgZGlyZWN0b3J5TmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0cyA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLmxzdGF0KSh0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHMuaXNEaXJlY3RvcnkoKSB8fCBzdGF0cy5pc1N5bWJvbGljTGluaygpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSBcIkVOT0VOVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeUNyZWF0ZShkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSkuc3BsaXQocGF0aC5zZXApO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGROYW1lID0gcGFydHMuc2xpY2UoMCwgaSArIDEpLmpvaW4ocGF0aC5zZXApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpckV4aXN0cyA9IGF3YWl0IHRoaXMuZGlyZWN0b3J5RXhpc3RzKGROYW1lKTtcblxuICAgICAgICAgICAgICAgIGlmICghZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLm1rZGlyKShkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeURlbGV0ZShkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdEaXJlY3RvcnlOYW1lID0gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKTtcblxuICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgdGhpcy5kaXJlY3RvcnlFeGlzdHMobmV3RGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICBpZiAoZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkZGlyKShuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1clBhdGggPSBwYXRoLmpvaW4obmV3RGlyZWN0b3J5TmFtZSwgZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkoY3VyUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXJlY3RvcnlEZWxldGUoY3VyUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB1dGlsLnByb21pc2lmeShmcy51bmxpbmspKGN1clBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KGZzLnJtZGlyKShuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBkaXJlY3RvcnlHZXRGaWxlcyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IGRpckZpbGVzID0gW107XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgbmV3RGlyZWN0b3J5TmFtZSA9IHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRpckV4aXN0cyA9IGF3YWl0IHRoaXMuZGlyZWN0b3J5RXhpc3RzKG5ld0RpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgaWYgKGRpckV4aXN0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMucmVhZGRpcikobmV3RGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJQYXRoID0gcGF0aC5qb2luKG5ld0RpcmVjdG9yeU5hbWUsIGZpbGVzW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMubHN0YXQpKGN1clBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0LmlzRmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJGaWxlcy5wdXNoKGZpbGVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlyRmlsZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeUdldEZvbGRlcnMoZGlyZWN0b3J5TmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBjb25zdCBkaXJGb2xkZXJzID0gW107XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgbmV3RGlyZWN0b3J5TmFtZSA9IHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRpckV4aXN0cyA9IGF3YWl0IHRoaXMuZGlyZWN0b3J5RXhpc3RzKG5ld0RpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgaWYgKGRpckV4aXN0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMucmVhZGRpcikobmV3RGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJQYXRoID0gcGF0aC5qb2luKG5ld0RpcmVjdG9yeU5hbWUsIGZpbGVzW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMubHN0YXQpKGN1clBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpckZvbGRlcnMucHVzaChmaWxlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpckZvbGRlcnM7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVFeGlzdHMoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSB1bmRlZmluZWQgfHwgZGlyZWN0b3J5TmFtZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgZmlsZU5hbWUgPT09IHVuZGVmaW5lZCB8fCBmaWxlTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMubHN0YXQpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0LmlzRmlsZSgpIHx8IHN0YXQuaXNTeW1ib2xpY0xpbmsoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gXCJFTk9FTlRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVUZXh0KGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBhcHBlbmQ/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgZmlsZU5hbWUgIT09IHVuZGVmaW5lZCAmJiBmaWxlTmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgY29udGVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShhcHBlbmQgPyBmcy5hcHBlbmRGaWxlIDogZnMud3JpdGVGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpLCBjb250ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVMaW5lcyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcsIGxpbmVzOiBzdHJpbmdbXSwgYXBwZW5kPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGZpbGVOYW1lICE9PSB1bmRlZmluZWQgJiYgZmlsZU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGxpbmVzICE9PSB1bmRlZmluZWQgJiYgbGluZXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShhcHBlbmQgPyBmcy5hcHBlbmRGaWxlIDogZnMud3JpdGVGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpLCBsaW5lcy5qb2luKG9zLkVPTCkgKyBvcy5FT0wpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZUJpbmFyeShkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcsIGRhdGE6IFVpbnQ4QXJyYXksIGFwcGVuZD86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBmaWxlTmFtZSAhPT0gdW5kZWZpbmVkICYmIGZpbGVOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBkYXRhICE9PSB1bmRlZmluZWQgJiYgZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KGFwcGVuZCA/IGZzLmFwcGVuZEZpbGUgOiBmcy53cml0ZUZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSksIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZUpzb24oZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nLCBvYmplY3Q6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGZpbGVOYW1lICE9PSB1bmRlZmluZWQgJiYgZmlsZU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIG9iamVjdCAhPT0gdW5kZWZpbmVkICYmIG9iamVjdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KGZzLndyaXRlRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSwgSnNvbkhlbHBlci5zdHJpbmdpZnkob2JqZWN0LCBcIlxcdFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRUZXh0KGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSB1bmRlZmluZWQgfHwgZGlyZWN0b3J5TmFtZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgZmlsZU5hbWUgPT09IHVuZGVmaW5lZCB8fCBmaWxlTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkTGluZXMoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGZpbGVOYW1lID09PSB1bmRlZmluZWQgfHwgZmlsZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMucmVhZEZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSkpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHIvZywgXCJcIikuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRCaW5hcnkoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxVaW50OEFycmF5PiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSB1bmRlZmluZWQgfHwgZGlyZWN0b3J5TmFtZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgZmlsZU5hbWUgPT09IHVuZGVmaW5lZCB8fCBmaWxlTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShmcy5yZWFkRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRKc29uPFQ+KGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGZpbGVOYW1lID09PSB1bmRlZmluZWQgfHwgZmlsZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMucmVhZEZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSkpO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlRGVsZXRlKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGZpbGVOYW1lID09PSB1bmRlZmluZWQgfHwgZmlsZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoZnMudW5saW5rKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYW51cFNlcGFyYXRvcnMocGF0aE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHBhdGhOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUocGF0aE5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
