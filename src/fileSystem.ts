/**
 * File system class
 */
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";

export class FileSystem implements IFileSystem {
    public pathCombine(pathName: string, additional: string): string {
        pathName = this.pathFormat(pathName);
        additional = this.cleanupSeparators(additional);
        return path.join(pathName, additional);
    }

    public pathDirectoryRelative(pathName1: string, pathName2: string): string {
        return `.${path.sep}${path.relative(pathName1, pathName2)}${path.sep}`;
    }

    public pathFileRelative(pathName1: string, pathName2: string): string {
        return `.${path.sep}${path.relative(pathName1, pathName2)}`;
    }

    public pathToWeb(pathName: string): string {
        return pathName.replace(/\\/g, "/");
    }

    public pathFormat(pathName: string): string {
        if (pathName === undefined || pathName === null) {
            return pathName;
        } else {
            return path.resolve(this.cleanupSeparators(pathName));
        }
    }

    public pathGetDirectory(pathName: string): string {
        if (pathName === undefined || pathName === null) {
            return pathName;
        } else {
            return path.dirname(this.cleanupSeparators(pathName));
        }
    }

    public async directoryExists(directoryName: string): Promise<boolean> {
        directoryName = this.pathFormat(directoryName);
        return new Promise<boolean>((resolve, reject) => {
            fs.lstat(directoryName, (err, stats) => {
                if (err) {
                    if (err.code === "ENOENT") {
                        resolve(false);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(stats.isDirectory());
                }
            });
        });
    }

    public async directoryCreate(directoryName: string): Promise<void> {
        directoryName = this.pathFormat(directoryName);
        return new Promise<void>((resolve, reject) => {
            fs.lstat(directoryName, (err, stats) => {
                if (err && err.code !== "ENOENT") {
                    reject(err);
                }

                if (!err && stats.isDirectory()) {
                    resolve();
                } else {
                    const parts = directoryName.split(path.sep);
                    parts.pop();
                    const parentFolder = parts.join(path.sep);
                    this.directoryCreate(parentFolder)
                        .then(() => {
                            fs.mkdir(directoryName, (err2) => {
                                if (err2) {
                                    reject(err2);
                                } else {
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
    }

    public async directoryDelete(directoryName: string): Promise<void> {
        directoryName = this.pathFormat(directoryName);
        return new Promise<void>((resolve, reject) => {
            if (fs.existsSync(directoryName)) {
                fs.readdir(directoryName, (err, files) => {
                    if (err) {
                        reject(err);
                    } else {
                        const allPromises: Promise<void>[] = [];
                        files.forEach((file, index) => {
                            const curPath = path.join(directoryName, file);
                            allPromises.push(new Promise<void>((resolve2, reject2) => {
                                fs.lstat(curPath, (err2, stats) => {
                                    if (err2) {
                                        reject2(err2);
                                    } else {
                                        if (stats.isDirectory()) {
                                            this.directoryDelete(curPath)
                                                .then(() => {
                                                    resolve2();
                                                })
                                                .catch((err5) => {
                                                    reject2(err5);
                                                });
                                        } else {
                                            fs.unlink(curPath, (err3) => {
                                                if (err3) {
                                                    reject2(err3);
                                                } else {
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
                                    } else {
                                        resolve();
                                    }
                                });
                            })
                            .catch((err5) => {
                                reject(err5);
                            });
                    }
                });
            } else {
                resolve();
            }
        });
    }

    public async fileExists(directoryName: string, fileName: string): Promise<boolean> {
        directoryName = this.pathFormat(directoryName);
        return new Promise<boolean>((resolve, reject) => {
            fs.lstat(path.join(directoryName, fileName), (err, stats) => {
                if (err) {
                    if (err.code === "ENOENT") {
                        resolve(false);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(stats.isFile());
                }
            });
        });
    }

    public async fileWriteJson(directoryName: string, fileName: string, object: any): Promise<void> {
        directoryName = this.pathFormat(directoryName);

        return new Promise<void>((resolve, reject) => {
            fs.writeFile(path.join(directoryName, fileName), JSON.stringify(object, null, "\t"), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async fileWriteLines(directoryName: string, fileName: string, lines: string[]): Promise<void> {
        directoryName = this.pathFormat(directoryName);

        return new Promise<void>((resolve, reject) => {
            fs.writeFile(path.join(directoryName, fileName), lines ? lines.join(os.EOL) : "", (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async fileReadJson<T>(directoryName: string, fileName: string): Promise<T> {
        directoryName = this.pathFormat(directoryName);

        return new Promise<T>((resolve, reject) => {
            fs.readFile(path.join(directoryName, fileName), (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const obj = JSON.parse(data.toString());
                        resolve(obj);
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });
    }

    public async fileReadLines(directoryName: string, fileName: string): Promise<string[]> {
        directoryName = this.pathFormat(directoryName);

        return new Promise<string[]>((resolve, reject) => {
            fs.readFile(path.join(directoryName, fileName), (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString().replace(/\r/g, "").split("\n"));
                }
            });
        });
    }

    public async fileDelete(directoryName: string, fileName: string): Promise<void> {
        directoryName = this.pathFormat(directoryName);

        return new Promise<void>((resolve, reject) => {
            fs.unlink(path.join(directoryName, fileName), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private cleanupSeparators(pathName: string): string {
        if (pathName === undefined || pathName === null) {
            return pathName;
        } else {
            return pathName.replace(path.sep === "\\" ? /\//g : /\\/g, path.sep);
        }
    }
}
