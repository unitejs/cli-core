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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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TSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDdEM7UUFDTCxDQUFDO0tBQUE7SUFFWSxVQUFVLENBQUMsYUFBcUIsRUFBRSxRQUFnQjs7WUFDM0QsSUFBSSxhQUFhLEtBQUssU0FBUyxJQUFJLGFBQWEsS0FBSyxJQUFJO2dCQUNyRCxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7Z0JBQzdDLE9BQU8sU0FBUyxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUNoRztRQUNMLENBQUM7S0FBQTtJQUVPLGlCQUFpQixDQUFDLFFBQWdCO1FBQ3RDLElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQzdDLE9BQU8sUUFBUSxDQUFDO1NBQ25CO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbkM7SUFDTCxDQUFDO0NBQ0o7QUFwUkQsZ0NBb1JDIiwiZmlsZSI6ImZpbGVTeXN0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZpbGUgc3lzdGVtIGNsYXNzXG4gKi9cbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgb3MgZnJvbSBcIm9zXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBKc29uSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9qc29uSGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcInV0aWxcIjtcblxuZXhwb3J0IGNsYXNzIEZpbGVTeXN0ZW0gaW1wbGVtZW50cyBJRmlsZVN5c3RlbSB7XG4gICAgcHVibGljIHBhdGhDb21iaW5lKHBhdGhOYW1lOiBzdHJpbmcsIGFkZGl0aW9uYWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gbnVsbCB8fCBwYXRoTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhhZGRpdGlvbmFsKTtcbiAgICAgICAgfSBlbHNlIGlmIChhZGRpdGlvbmFsID09PSBudWxsIHx8IGFkZGl0aW9uYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW51cFNlcGFyYXRvcnMocGF0aE5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lKSwgdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhhZGRpdGlvbmFsKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aERpcmVjdG9yeVJlbGF0aXZlKHBhdGhOYW1lMTogc3RyaW5nLCBwYXRoTmFtZTI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZTEgPT09IG51bGwgfHwgcGF0aE5hbWUxID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTE7XG4gICAgICAgIH0gZWxzZSBpZiAocGF0aE5hbWUyID09PSBudWxsIHx8IHBhdGhOYW1lMiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWUyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGAuJHtwYXRoLnNlcH0ke3BhdGgucmVsYXRpdmUocGF0aE5hbWUxLCBwYXRoTmFtZTIpfSR7cGF0aC5zZXB9YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoRmlsZVJlbGF0aXZlKHBhdGhOYW1lMTogc3RyaW5nLCBwYXRoTmFtZTI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZTEgPT09IG51bGwgfHwgcGF0aE5hbWUxID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTE7XG4gICAgICAgIH0gZWxzZSBpZiAocGF0aE5hbWUyID09PSBudWxsIHx8IHBhdGhOYW1lMiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWUyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGAuJHtwYXRoLnNlcH0ke3BhdGgucmVsYXRpdmUocGF0aE5hbWUxLCBwYXRoTmFtZTIpfWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aFRvV2ViKHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IG51bGwgfHwgcGF0aE5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhBYnNvbHV0ZShwYXRoTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lID09PSB1bmRlZmluZWQgfHwgcGF0aE5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnJlc29sdmUodGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhwYXRoTmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhHZXREaXJlY3RvcnkocGF0aE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHBhdGhOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbmV3UGF0aE5hbWUgPSB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lKTtcbiAgICAgICAgICAgIGlmICghLy4qXFwuKC4qKSQvLnRlc3QobmV3UGF0aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgbmV3UGF0aE5hbWUgPSBwYXRoLmpvaW4obmV3UGF0aE5hbWUsIFwiZHVtbXkuZmlsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXRoLmRpcm5hbWUobmV3UGF0aE5hbWUpICsgcGF0aC5zZXA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aEdldEZpbGVuYW1lKHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXRoTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbmV3UGF0aE5hbWUgPSB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lKTtcbiAgICAgICAgICAgIGlmICgvW1xcL1xcXFxdKyQvLnRlc3QobmV3UGF0aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGguYmFzZW5hbWUobmV3UGF0aE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeUV4aXN0cyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RvcnlOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMubHN0YXQpKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0cy5pc0RpcmVjdG9yeSgpIHx8IHN0YXRzLmlzU3ltYm9saWNMaW5rKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09IFwiRU5PRU5UXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5Q3JlYXRlKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKS5zcGxpdChwYXRoLnNlcCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZE5hbWUgPSBwYXJ0cy5zbGljZSgwLCBpICsgMSkuam9pbihwYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgdGhpcy5kaXJlY3RvcnlFeGlzdHMoZE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMubWtkaXIpKGROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5RGVsZXRlKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0RpcmVjdG9yeU5hbWUgPSB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpO1xuXG4gICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCB0aGlzLmRpcmVjdG9yeUV4aXN0cyhuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgIGlmIChkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnJlYWRkaXIpKG5ld0RpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyUGF0aCA9IHBhdGguam9pbihuZXdEaXJlY3RvcnlOYW1lLCBmaWxlc1tpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLmxzdGF0KShjdXJQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRpcmVjdG9yeURlbGV0ZShjdXJQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnVubGluaykoY3VyUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoZnMucm1kaXIpKG5ld0RpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeUdldEZpbGVzKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgICAgY29uc3QgZGlyRmlsZXMgPSBbXTtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdEaXJlY3RvcnlOYW1lID0gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKTtcblxuICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgdGhpcy5kaXJlY3RvcnlFeGlzdHMobmV3RGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICBpZiAoZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkZGlyKShuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1clBhdGggPSBwYXRoLmpvaW4obmV3RGlyZWN0b3J5TmFtZSwgZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkoY3VyUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXQuaXNGaWxlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpckZpbGVzLnB1c2goZmlsZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXJGaWxlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5R2V0Rm9sZGVycyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IGRpckZvbGRlcnMgPSBbXTtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdEaXJlY3RvcnlOYW1lID0gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKTtcblxuICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgdGhpcy5kaXJlY3RvcnlFeGlzdHMobmV3RGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICBpZiAoZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkZGlyKShuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1clBhdGggPSBwYXRoLmpvaW4obmV3RGlyZWN0b3J5TmFtZSwgZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkoY3VyUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlyRm9sZGVycy5wdXNoKGZpbGVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlyRm9sZGVycztcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZUV4aXN0cyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RvcnlOYW1lID09PSBudWxsIHx8XG4gICAgICAgICAgICBmaWxlTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGZpbGVOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXQuaXNGaWxlKCkgfHwgc3RhdC5pc1N5bWJvbGljTGluaygpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSBcIkVOT0VOVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZVRleHQoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGFwcGVuZD86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBmaWxlTmFtZSAhPT0gdW5kZWZpbmVkICYmIGZpbGVOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBjb250ZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KGFwcGVuZCA/IGZzLmFwcGVuZEZpbGUgOiBmcy53cml0ZUZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSksIGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZUxpbmVzKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZywgbGluZXM6IHN0cmluZ1tdLCBhcHBlbmQ/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgZmlsZU5hbWUgIT09IHVuZGVmaW5lZCAmJiBmaWxlTmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgbGluZXMgIT09IHVuZGVmaW5lZCAmJiBsaW5lcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KGFwcGVuZCA/IGZzLmFwcGVuZEZpbGUgOiBmcy53cml0ZUZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSksIGxpbmVzLmpvaW4ob3MuRU9MKSArIG9zLkVPTCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlQmluYXJ5KGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZywgZGF0YTogVWludDhBcnJheSwgYXBwZW5kPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGZpbGVOYW1lICE9PSB1bmRlZmluZWQgJiYgZmlsZU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGRhdGEgIT09IHVuZGVmaW5lZCAmJiBkYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoYXBwZW5kID8gZnMuYXBwZW5kRmlsZSA6IGZzLndyaXRlRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlSnNvbihkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcsIG9iamVjdDogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgZmlsZU5hbWUgIT09IHVuZGVmaW5lZCAmJiBmaWxlTmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgb2JqZWN0ICE9PSB1bmRlZmluZWQgJiYgb2JqZWN0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoZnMud3JpdGVGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpLCBKc29uSGVscGVyLnN0cmluZ2lmeShvYmplY3QsIFwiXFx0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZFRleHQoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RvcnlOYW1lID09PSBudWxsIHx8XG4gICAgICAgICAgICBmaWxlTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGZpbGVOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnJlYWRGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRMaW5lcyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSB1bmRlZmluZWQgfHwgZGlyZWN0b3J5TmFtZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgZmlsZU5hbWUgPT09IHVuZGVmaW5lZCB8fCBmaWxlTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xcci9nLCBcIlwiKS5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZEJpbmFyeShkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPFVpbnQ4QXJyYXk+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RvcnlOYW1lID09PSBudWxsIHx8XG4gICAgICAgICAgICBmaWxlTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGZpbGVOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KGZzLnJlYWRGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZEpzb248VD4oZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSB1bmRlZmluZWQgfHwgZGlyZWN0b3J5TmFtZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgZmlsZU5hbWUgPT09IHVuZGVmaW5lZCB8fCBmaWxlTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVEZWxldGUoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSB1bmRlZmluZWQgfHwgZGlyZWN0b3J5TmFtZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgZmlsZU5hbWUgPT09IHVuZGVmaW5lZCB8fCBmaWxlTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShmcy51bmxpbmspKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhbnVwU2VwYXJhdG9ycyhwYXRoTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lID09PSB1bmRlZmluZWQgfHwgcGF0aE5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLm5vcm1hbGl6ZShwYXRoTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
