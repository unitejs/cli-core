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
class FileSystem {
    pathCombine(pathName, additional) {
        pathName = this.pathFormat(pathName);
        additional = this.cleanupSeparators(additional);
        return path.join(pathName, additional);
    }
    pathDirectoryRelative(pathName1, pathName2) {
        return `.${path.sep}${path.relative(pathName1, pathName2)}${path.sep}`;
    }
    pathFileRelative(pathName1, pathName2) {
        return `.${path.sep}${path.relative(pathName1, pathName2)}`;
    }
    pathToWeb(pathName) {
        return pathName.replace(/\\/g, "/");
    }
    pathFormat(pathName) {
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
            return path.dirname(this.cleanupSeparators(pathName));
        }
    }
    pathGetFilename(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            return path.basename(this.cleanupSeparators(pathName));
        }
    }
    directoryExists(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.lstat(directoryName, (err, stats) => {
                    if (err) {
                        if (err.code === "ENOENT") {
                            resolve(false);
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        resolve(stats.isDirectory());
                    }
                });
            });
        });
    }
    directoryCreate(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.lstat(directoryName, (err, stats) => {
                    if (err && err.code !== "ENOENT") {
                        reject(err);
                    }
                    if (!err && stats.isDirectory()) {
                        resolve();
                    }
                    else {
                        const parts = directoryName.split(path.sep);
                        parts.pop();
                        const parentFolder = parts.join(path.sep);
                        this.directoryCreate(parentFolder)
                            .then(() => {
                            fs.mkdir(directoryName, (err2) => {
                                if (err2) {
                                    reject(err2);
                                }
                                else {
                                    resolve();
                                }
                            });
                        })
                            .catch((err3) => {
                            reject(err3);
                        });
                    }
                });
            });
        });
    }
    directoryDelete(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                if (fs.existsSync(directoryName)) {
                    fs.readdir(directoryName, (err, files) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const allPromises = [];
                            files.forEach((file, index) => {
                                const curPath = path.join(directoryName, file);
                                allPromises.push(new Promise((resolve2, reject2) => {
                                    fs.lstat(curPath, (err2, stats) => {
                                        if (err2) {
                                            reject2(err2);
                                        }
                                        else {
                                            if (stats.isDirectory()) {
                                                this.directoryDelete(curPath)
                                                    .then(() => {
                                                    resolve2();
                                                })
                                                    .catch((err5) => {
                                                    reject2(err5);
                                                });
                                            }
                                            else {
                                                fs.unlink(curPath, (err3) => {
                                                    if (err3) {
                                                        reject2(err3);
                                                    }
                                                    else {
                                                        resolve2();
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }));
                            });
                            Promise.all(allPromises)
                                .then(() => {
                                fs.rmdir(directoryName, (err4) => {
                                    if (err4) {
                                        reject(err4);
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            })
                                .catch((err5) => {
                                reject(err5);
                            });
                        }
                    });
                }
                else {
                    resolve();
                }
            });
        });
    }
    fileExists(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.lstat(path.join(directoryName, fileName), (err, stats) => {
                    if (err) {
                        if (err.code === "ENOENT") {
                            resolve(false);
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        resolve(stats.isFile());
                    }
                });
            });
        });
    }
    fileWriteJson(directoryName, fileName, object) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.writeFile(path.join(directoryName, fileName), JSON.stringify(object, null, "\t"), (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    fileWriteLines(directoryName, fileName, lines) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.writeFile(path.join(directoryName, fileName), lines ? lines.join(os.EOL) : "", (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    fileWriteBinary(directoryName, fileName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.writeFile(path.join(directoryName, fileName), data, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    fileReadJson(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(directoryName, fileName), (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        try {
                            const obj = JSON.parse(data.toString());
                            resolve(obj);
                        }
                        catch (e) {
                            reject(e);
                        }
                    }
                });
            });
        });
    }
    fileReadLines(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(directoryName, fileName), (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.toString().replace(/\r/g, "").split("\n"));
                    }
                });
            });
        });
    }
    fileReadBinary(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(directoryName, fileName), (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.buffer);
                    }
                });
            });
        });
    }
    fileDelete(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            directoryName = this.pathFormat(directoryName);
            return new Promise((resolve, reject) => {
                fs.unlink(path.join(directoryName, fileName), (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    cleanupSeparators(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            return pathName.replace(path.sep === "\\" ? /\//g : /\\/g, path.sep);
        }
    }
}
exports.FileSystem = FileSystem;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFyUkQsZ0NBcVJDIiwiZmlsZSI6ImZpbGVTeXN0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZpbGUgc3lzdGVtIGNsYXNzXG4gKi9cbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgb3MgZnJvbSBcIm9zXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGNsYXNzIEZpbGVTeXN0ZW0gaW1wbGVtZW50cyBJRmlsZVN5c3RlbSB7XG4gICAgcHVibGljIHBhdGhDb21iaW5lKHBhdGhOYW1lOiBzdHJpbmcsIGFkZGl0aW9uYWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHBhdGhOYW1lID0gdGhpcy5wYXRoRm9ybWF0KHBhdGhOYW1lKTtcbiAgICAgICAgYWRkaXRpb25hbCA9IHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoYWRkaXRpb25hbCk7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4ocGF0aE5hbWUsIGFkZGl0aW9uYWwpO1xuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoRGlyZWN0b3J5UmVsYXRpdmUocGF0aE5hbWUxOiBzdHJpbmcsIHBhdGhOYW1lMjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAuJHtwYXRoLnNlcH0ke3BhdGgucmVsYXRpdmUocGF0aE5hbWUxLCBwYXRoTmFtZTIpfSR7cGF0aC5zZXB9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aEZpbGVSZWxhdGl2ZShwYXRoTmFtZTE6IHN0cmluZywgcGF0aE5hbWUyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYC4ke3BhdGguc2VwfSR7cGF0aC5yZWxhdGl2ZShwYXRoTmFtZTEsIHBhdGhOYW1lMil9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aFRvV2ViKHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gcGF0aE5hbWUucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhGb3JtYXQocGF0aE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHBhdGhOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMocGF0aE5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoR2V0RGlyZWN0b3J5KHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXRoTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguZGlybmFtZSh0aGlzLmNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aEdldEZpbGVuYW1lKHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXRoTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguYmFzZW5hbWUodGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhwYXRoTmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeUV4aXN0cyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgZGlyZWN0b3J5TmFtZSA9IHRoaXMucGF0aEZvcm1hdChkaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZzLmxzdGF0KGRpcmVjdG9yeU5hbWUsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09IFwiRU5PRU5UXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHN0YXRzLmlzRGlyZWN0b3J5KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5Q3JlYXRlKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBkaXJlY3RvcnlOYW1lID0gdGhpcy5wYXRoRm9ybWF0KGRpcmVjdG9yeU5hbWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMubHN0YXQoZGlyZWN0b3J5TmFtZSwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyICYmIGVyci5jb2RlICE9PSBcIkVOT0VOVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZXJyICYmIHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gZGlyZWN0b3J5TmFtZS5zcGxpdChwYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRGb2xkZXIgPSBwYXJ0cy5qb2luKHBhdGguc2VwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3RvcnlDcmVhdGUocGFyZW50Rm9sZGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLm1rZGlyKGRpcmVjdG9yeU5hbWUsIChlcnIyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeURlbGV0ZShkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgZGlyZWN0b3J5TmFtZSA9IHRoaXMucGF0aEZvcm1hdChkaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGRpcmVjdG9yeU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnMucmVhZGRpcihkaXJlY3RvcnlOYW1lLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbFByb21pc2VzOiBQcm9taXNlPHZvaWQ+W10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzLmZvckVhY2goKGZpbGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyUGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnlOYW1lLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxQcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlMiwgcmVqZWN0MikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5sc3RhdChjdXJQYXRoLCAoZXJyMiwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0MihlcnIyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3RvcnlEZWxldGUoY3VyUGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlMigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyNSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdDIoZXJyNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy51bmxpbmsoY3VyUGF0aCwgKGVycjMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0MihlcnIzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZTIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGFsbFByb21pc2VzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMucm1kaXIoZGlyZWN0b3J5TmFtZSwgKGVycjQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnI0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycjQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnI1KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnI1KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlRXhpc3RzKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBkaXJlY3RvcnlOYW1lID0gdGhpcy5wYXRoRm9ybWF0KGRpcmVjdG9yeU5hbWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMubHN0YXQocGF0aC5qb2luKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gXCJFTk9FTlRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc3RhdHMuaXNGaWxlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlSnNvbihkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcsIG9iamVjdDogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGRpcmVjdG9yeU5hbWUgPSB0aGlzLnBhdGhGb3JtYXQoZGlyZWN0b3J5TmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZShwYXRoLmpvaW4oZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpLCBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIFwiXFx0XCIpLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVMaW5lcyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcsIGxpbmVzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBkaXJlY3RvcnlOYW1lID0gdGhpcy5wYXRoRm9ybWF0KGRpcmVjdG9yeU5hbWUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGUocGF0aC5qb2luKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSwgbGluZXMgPyBsaW5lcy5qb2luKG9zLkVPTCkgOiBcIlwiLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVCaW5hcnkoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nLCBkYXRhOiBVaW50OEFycmF5KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGRpcmVjdG9yeU5hbWUgPSB0aGlzLnBhdGhGb3JtYXQoZGlyZWN0b3J5TmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZShwYXRoLmpvaW4oZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpLCBkYXRhLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZEpzb248VD4oZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIGRpcmVjdG9yeU5hbWUgPSB0aGlzLnBhdGhGb3JtYXQoZGlyZWN0b3J5TmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZzLnJlYWRGaWxlKHBhdGguam9pbihkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSksIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9iaik7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRMaW5lcyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGRpcmVjdG9yeU5hbWUgPSB0aGlzLnBhdGhGb3JtYXQoZGlyZWN0b3J5TmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZ1tdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy5yZWFkRmlsZShwYXRoLmpvaW4oZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHIvZywgXCJcIikuc3BsaXQoXCJcXG5cIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRCaW5hcnkoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxVaW50OEFycmF5PiB7XG4gICAgICAgIGRpcmVjdG9yeU5hbWUgPSB0aGlzLnBhdGhGb3JtYXQoZGlyZWN0b3J5TmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMucmVhZEZpbGUocGF0aC5qb2luKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhLmJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlRGVsZXRlKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBkaXJlY3RvcnlOYW1lID0gdGhpcy5wYXRoRm9ybWF0KGRpcmVjdG9yeU5hbWUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy51bmxpbmsocGF0aC5qb2luKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXRoTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lLnJlcGxhY2UocGF0aC5zZXAgPT09IFwiXFxcXFwiID8gL1xcLy9nIDogL1xcXFwvZywgcGF0aC5zZXApO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
