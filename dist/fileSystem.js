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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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
