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
const defaultLogger_1 = require("unitejs-framework/dist/loggers/defaultLogger");
const aggregateLogger_1 = require("./aggregateLogger");
const commandLineArgConstants_1 = require("./commandLineArgConstants");
const commandLineCommandConstants_1 = require("./commandLineCommandConstants");
const commandLineParser_1 = require("./commandLineParser");
const displayLogger_1 = require("./displayLogger");
const fileLogger_1 = require("./fileLogger");
const fileSystem_1 = require("./fileSystem");
const webSecureClient_1 = require("./webSecureClient");
class CLIBase {
    constructor(appName) {
        this._appName = appName;
    }
    initialise(logger, fileSystem) {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    run(process) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger;
            let fileLogger;
            let ret;
            try {
                const commandLineParser = new commandLineParser_1.CommandLineParser();
                const badCommands = commandLineParser.parse(process ? process.argv : undefined);
                const loggers = [];
                const fileSystem = new fileSystem_1.FileSystem();
                const noColor = commandLineParser.getBooleanArgument(commandLineArgConstants_1.CommandLineArgConstants.NO_COLOR);
                loggers.push(new displayLogger_1.DisplayLogger(process, noColor));
                this._disableVersionCheck = commandLineParser.getBooleanArgument(commandLineArgConstants_1.CommandLineArgConstants.DISABLE_VERSION_CHECK);
                const logFile = commandLineParser.getStringArgument(commandLineArgConstants_1.CommandLineArgConstants.LOG_FILE);
                if (logFile !== undefined && logFile !== null && logFile.length > 0) {
                    fileLogger = new fileLogger_1.FileLogger(logFile, fileSystem);
                    yield fileLogger.initialise();
                    loggers.push(fileLogger);
                }
                logger = new aggregateLogger_1.AggregateLogger(loggers);
                if (commandLineParser.getInterpreter() === undefined) {
                    logger.error("The command line contained no interpreter");
                    ret = 1;
                }
                else if (commandLineParser.getScript() === undefined) {
                    logger.error("The command line contained no script");
                    ret = 1;
                }
                else if (badCommands.length > 0) {
                    logger.error("The following arguments are badly formed", badCommands);
                    ret = 1;
                }
                else {
                    ret = yield this.initialise(logger, fileSystem);
                    if (ret === 0) {
                        const isVersionCommand = commandLineParser.getCommand() === commandLineCommandConstants_1.CommandLineCommandConstants.VERSION;
                        yield this.displayBanner(logger, fileSystem, !isVersionCommand, commandLineParser);
                        if (!isVersionCommand) {
                            if (noColor) {
                                const value = true;
                                logger.info(commandLineArgConstants_1.CommandLineArgConstants.NO_COLOR, { value });
                            }
                            if (logFile !== undefined && logFile !== null && logFile.length > 0) {
                                logger.info(commandLineArgConstants_1.CommandLineArgConstants.LOG_FILE, { logFile });
                            }
                        }
                        ret = yield this.handleCommand(logger, fileSystem, commandLineParser);
                    }
                }
            }
            catch (err) {
                ret = 1;
                if (logger !== undefined) {
                    logger.error("Unhandled Exception", err);
                }
                else {
                    defaultLogger_1.DefaultLogger.log("An error occurred: ", err);
                }
            }
            if (fileLogger !== undefined) {
                yield fileLogger.closedown();
            }
            return ret;
        });
    }
    displayAdditionalVersion(logger) {
    }
    checkRemaining(logger, commandLineParser) {
        const remaining = commandLineParser.getRemaining();
        if (remaining.length > 0) {
            logger.error("Unrecognized arguments on the command line", undefined, { remaining });
            return 1;
        }
        else {
            return 0;
        }
    }
    checkVersion(client) {
        return __awaiter(this, void 0, void 0, function* () {
            let isNewer = false;
            try {
                let newVersion = "";
                if (this._packageName && this._packageVersion) {
                    const response = yield client.getJson(`https://registry.npmjs.org/${this._packageName}/latest/`, 1000);
                    if (response && response.version) {
                        const parts = response.version.split(".");
                        const currentParts = this._packageVersion.split(".");
                        if (parts.length === 3 && currentParts.length === 3) {
                            const major = parseInt(parts[0], 10);
                            const majorCurrent = parseInt(currentParts[0], 10);
                            if (major > majorCurrent) {
                                isNewer = true;
                            }
                            else if (major === majorCurrent) {
                                const minor = parseInt(parts[1], 10);
                                const minorCurrent = parseInt(currentParts[1], 10);
                                if (minor > minorCurrent) {
                                    isNewer = true;
                                }
                                else if (minor === minorCurrent) {
                                    const patch = parseInt(parts[2], 10);
                                    const patchCurrent = parseInt(currentParts[2], 10);
                                    isNewer = patch > patchCurrent;
                                }
                            }
                            if (isNewer) {
                                newVersion = response.version;
                            }
                        }
                    }
                }
                this._newVersion = newVersion;
            }
            catch (err) {
                // We will ignore errors as the version check doesn't warrant failing anything
                // bet set the new version to empty so the cli exits
                this._newVersion = "";
            }
            return isNewer;
        });
    }
    markdownTableToCli(logger, row) {
        if (row !== undefined && row !== null && row.length > 2) {
            const newRow = row.substring(0, row.length - 1).trim().replace(/\|/g, "");
            if (newRow[2] === " ") {
                logger.info(`   ${newRow.substring(1)}`);
            }
            else {
                logger.info(` --${newRow.substring(1)}`);
            }
        }
    }
    handleCommand(logger, fileSystem, commandLineParser) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = 0;
            const command = commandLineParser.getCommand();
            switch (command) {
                case commandLineCommandConstants_1.CommandLineCommandConstants.VERSION: {
                    ret = this.checkRemaining(logger, commandLineParser);
                    // Nothing else to display
                    break;
                }
                case commandLineCommandConstants_1.CommandLineCommandConstants.HELP: {
                    ret = this.checkRemaining(logger, commandLineParser);
                    if (ret === 0) {
                        this.displayHelp(logger);
                    }
                    break;
                }
                default: {
                    ret = yield this.handleCustomCommand(logger, fileSystem, commandLineParser);
                    if (ret < 0) {
                        if (command === undefined) {
                            logger.error("No command specified try help");
                        }
                        else {
                            logger.error(`Unknown command - ${command}`);
                        }
                        ret = 1;
                    }
                }
            }
            if (!this._disableVersionCheck) {
                yield new Promise((resolve) => {
                    const versionCheckIntervalId = setInterval(() => {
                        if (this._newVersion !== undefined) {
                            clearInterval(versionCheckIntervalId);
                            if (this._newVersion.length > 0) {
                                logger.info("");
                                logger.warning(`A new version v${this._newVersion} of ${this._packageName} is available.`);
                                logger.warning(`You are current using version v${this._packageVersion}.`);
                            }
                            resolve();
                        }
                    }, 50);
                });
            }
            return ret;
        });
    }
    displayBanner(logger, fileSystem, includeTitle, commandLineParser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (includeTitle) {
                logger.banner(`${this._appName} CLI`);
            }
            const packageJsonDir = fileSystem.pathCombine(fileSystem.pathGetDirectory(`${commandLineParser.getScript()}.js`), "../");
            const packageJsonExists = yield fileSystem.fileExists(packageJsonDir, "package.json");
            if (packageJsonExists) {
                const packageJson = yield fileSystem.fileReadJson(packageJsonDir, "package.json");
                this._packageName = packageJson.name;
                this._packageVersion = packageJson.version;
                logger.banner(`CLI v${packageJson.version}`);
            }
            else {
                this._disableVersionCheck = true;
            }
            this.displayAdditionalVersion(logger);
            if (includeTitle) {
                logger.banner("");
            }
            if (!this._disableVersionCheck) {
                // We don't wait for the promise to resolve as we don't want it to hold up anything else
                // message will be displayed at the end
                /* tslint:disable:no-floating-promises */
                this.checkVersion(new webSecureClient_1.WebSecureClient());
            }
        });
    }
}
exports.CLIBase = CLIBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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SSxDQUFDLFlBQVksQ0FBQyxJQUFJLGlDQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQXRQRCwwQkFzUEMiLCJmaWxlIjoiY2xpQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbnRyeSBwb2ludC5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBEZWZhdWx0TG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvbG9nZ2Vycy9kZWZhdWx0TG9nZ2VyXCI7XG5pbXBvcnQgeyBBZ2dyZWdhdGVMb2dnZXIgfSBmcm9tIFwiLi9hZ2dyZWdhdGVMb2dnZXJcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29tbWFuZExpbmVBcmdDb25zdGFudHNcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cyB9IGZyb20gXCIuL2NvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVQYXJzZXIgfSBmcm9tIFwiLi9jb21tYW5kTGluZVBhcnNlclwiO1xuaW1wb3J0IHsgRGlzcGxheUxvZ2dlciB9IGZyb20gXCIuL2Rpc3BsYXlMb2dnZXJcIjtcbmltcG9ydCB7IEZpbGVMb2dnZXIgfSBmcm9tIFwiLi9maWxlTG9nZ2VyXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSBcIi4vZmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgV2ViU2VjdXJlQ2xpZW50IH0gZnJvbSBcIi4vd2ViU2VjdXJlQ2xpZW50XCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDTElCYXNlIHtcbiAgICBwcm90ZWN0ZWQgX2Rpc2FibGVWZXJzaW9uQ2hlY2s6IGJvb2xlYW47XG4gICAgcHJvdGVjdGVkIF9hcHBOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIF9wYWNrYWdlTmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfcGFja2FnZVZlcnNpb246IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgX25ld1ZlcnNpb246IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGFwcE5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9hcHBOYW1lID0gYXBwTmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bihwcm9jZXNzOiBOb2RlSlMuUHJvY2Vzcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBsb2dnZXI6IElMb2dnZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBmaWxlTG9nZ2VyOiBGaWxlTG9nZ2VyIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcmV0OiBudW1iZXI7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRMaW5lUGFyc2VyID0gbmV3IENvbW1hbmRMaW5lUGFyc2VyKCk7XG4gICAgICAgICAgICBjb25zdCBiYWRDb21tYW5kcyA9IGNvbW1hbmRMaW5lUGFyc2VyLnBhcnNlKHByb2Nlc3MgPyBwcm9jZXNzLmFyZ3YgOiB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBjb25zdCBsb2dnZXJzID0gW107XG4gICAgICAgICAgICBjb25zdCBmaWxlU3lzdGVtID0gbmV3IEZpbGVTeXN0ZW0oKTtcblxuICAgICAgICAgICAgY29uc3Qgbm9Db2xvciA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldEJvb2xlYW5Bcmd1bWVudChDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5OT19DT0xPUik7XG4gICAgICAgICAgICBsb2dnZXJzLnB1c2gobmV3IERpc3BsYXlMb2dnZXIocHJvY2Vzcywgbm9Db2xvcikpO1xuXG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlVmVyc2lvbkNoZWNrID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Qm9vbGVhbkFyZ3VtZW50KENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkRJU0FCTEVfVkVSU0lPTl9DSEVDSyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBjb21tYW5kTGluZVBhcnNlci5nZXRTdHJpbmdBcmd1bWVudChDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5MT0dfRklMRSk7XG4gICAgICAgICAgICBpZiAobG9nRmlsZSAhPT0gdW5kZWZpbmVkICYmIGxvZ0ZpbGUgIT09IG51bGwgJiYgbG9nRmlsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZmlsZUxvZ2dlciA9IG5ldyBGaWxlTG9nZ2VyKGxvZ0ZpbGUsIGZpbGVTeXN0ZW0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVMb2dnZXIuaW5pdGlhbGlzZSgpO1xuICAgICAgICAgICAgICAgIGxvZ2dlcnMucHVzaChmaWxlTG9nZ2VyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyID0gbmV3IEFnZ3JlZ2F0ZUxvZ2dlcihsb2dnZXJzKTtcblxuICAgICAgICAgICAgaWYgKGNvbW1hbmRMaW5lUGFyc2VyLmdldEludGVycHJldGVyKCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlRoZSBjb21tYW5kIGxpbmUgY29udGFpbmVkIG5vIGludGVycHJldGVyXCIpO1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmRMaW5lUGFyc2VyLmdldFNjcmlwdCgpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJUaGUgY29tbWFuZCBsaW5lIGNvbnRhaW5lZCBubyBzY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFkQ29tbWFuZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlRoZSBmb2xsb3dpbmcgYXJndW1lbnRzIGFyZSBiYWRseSBmb3JtZWRcIiwgYmFkQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuaW5pdGlhbGlzZShsb2dnZXIsIGZpbGVTeXN0ZW0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1ZlcnNpb25Db21tYW5kID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Q29tbWFuZCgpID09PSBDb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHMuVkVSU0lPTjtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXNwbGF5QmFubmVyKGxvZ2dlciwgZmlsZVN5c3RlbSwgIWlzVmVyc2lvbkNvbW1hbmQsIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmVyc2lvbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub0NvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLk5PX0NPTE9SLCB7IHZhbHVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ0ZpbGUgIT09IHVuZGVmaW5lZCAmJiBsb2dGaWxlICE9PSBudWxsICYmIGxvZ0ZpbGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkxPR19GSUxFLCB7IGxvZ0ZpbGUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmhhbmRsZUNvbW1hbmQobG9nZ2VyLCBmaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICBpZiAobG9nZ2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJVbmhhbmRsZWQgRXhjZXB0aW9uXCIsIGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIERlZmF1bHRMb2dnZXIubG9nKFwiQW4gZXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbGVMb2dnZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYXdhaXQgZmlsZUxvZ2dlci5jbG9zZWRvd24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFic3RyYWN0IGFzeW5jIGhhbmRsZUN1c3RvbUNvbW1hbmQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTxudW1iZXI+O1xuICAgIHB1YmxpYyBhYnN0cmFjdCBkaXNwbGF5SGVscChsb2dnZXI6IElMb2dnZXIpOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgZGlzcGxheUFkZGl0aW9uYWxWZXJzaW9uKGxvZ2dlcjogSUxvZ2dlcik6IHZvaWQge1xuICAgIH1cblxuICAgIHB1YmxpYyBjaGVja1JlbWFpbmluZyhsb2dnZXI6IElMb2dnZXIsIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHJlbWFpbmluZyA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldFJlbWFpbmluZygpO1xuICAgICAgICBpZiAocmVtYWluaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlVucmVjb2duaXplZCBhcmd1bWVudHMgb24gdGhlIGNvbW1hbmQgbGluZVwiLCB1bmRlZmluZWQsIHsgcmVtYWluaW5nIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBjaGVja1ZlcnNpb24oY2xpZW50OiBXZWJTZWN1cmVDbGllbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgbGV0IGlzTmV3ZXIgPSBmYWxzZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IG5ld1ZlcnNpb24gPSBcIlwiO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3BhY2thZ2VOYW1lICYmIHRoaXMuX3BhY2thZ2VWZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgdHlwZSBSZWdpc3RyeVBhY2thZ2UgPSB7IHZlcnNpb246IHN0cmluZyB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlOiBSZWdpc3RyeVBhY2thZ2UgPVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuZ2V0SnNvbjxSZWdpc3RyeVBhY2thZ2U+KGBodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy8ke3RoaXMuX3BhY2thZ2VOYW1lfS9sYXRlc3QvYCwgMTAwMCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UudmVyc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHJlc3BvbnNlLnZlcnNpb24uc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UGFydHMgPSB0aGlzLl9wYWNrYWdlVmVyc2lvbi5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDMgJiYgY3VycmVudFBhcnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFqb3IgPSBwYXJzZUludChwYXJ0c1swXSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFqb3JDdXJyZW50ID0gcGFyc2VJbnQoY3VycmVudFBhcnRzWzBdLCAxMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYWpvciA+IG1ham9yQ3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTmV3ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYWpvciA9PT0gbWFqb3JDdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWlub3IgPSBwYXJzZUludChwYXJ0c1sxXSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pbm9yQ3VycmVudCA9IHBhcnNlSW50KGN1cnJlbnRQYXJ0c1sxXSwgMTApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbm9yID4gbWlub3JDdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTmV3ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWlub3IgPT09IG1pbm9yQ3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRjaCA9IHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoQ3VycmVudCA9IHBhcnNlSW50KGN1cnJlbnRQYXJ0c1syXSwgMTApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTmV3ZXIgPSBwYXRjaCA+IHBhdGNoQ3VycmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05ld2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmVyc2lvbiA9IHJlc3BvbnNlLnZlcnNpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9uZXdWZXJzaW9uID0gbmV3VmVyc2lvbjtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBXZSB3aWxsIGlnbm9yZSBlcnJvcnMgYXMgdGhlIHZlcnNpb24gY2hlY2sgZG9lc24ndCB3YXJyYW50IGZhaWxpbmcgYW55dGhpbmdcbiAgICAgICAgICAgIC8vIGJldCBzZXQgdGhlIG5ldyB2ZXJzaW9uIHRvIGVtcHR5IHNvIHRoZSBjbGkgZXhpdHNcbiAgICAgICAgICAgIHRoaXMuX25ld1ZlcnNpb24gPSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzTmV3ZXI7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG1hcmtkb3duVGFibGVUb0NsaShsb2dnZXI6IElMb2dnZXIsIHJvdzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChyb3cgIT09IHVuZGVmaW5lZCAmJiByb3cgIT09IG51bGwgJiYgcm93Lmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JvdyA9IHJvdy5zdWJzdHJpbmcoMCwgcm93Lmxlbmd0aCAtIDEpLnRyaW0oKS5yZXBsYWNlKC9cXHwvZywgXCJcIik7XG4gICAgICAgICAgICBpZiAobmV3Um93WzJdID09PSBcIiBcIikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgICAke25ld1Jvdy5zdWJzdHJpbmcoMSl9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgLS0ke25ld1Jvdy5zdWJzdHJpbmcoMSl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZUNvbW1hbmQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldDogbnVtYmVyID0gMDtcblxuICAgICAgICBjb25zdCBjb21tYW5kID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Q29tbWFuZCgpO1xuXG4gICAgICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgICAgICAgY2FzZSBDb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHMuVkVSU0lPTjoge1xuICAgICAgICAgICAgICAgIHJldCA9IHRoaXMuY2hlY2tSZW1haW5pbmcobG9nZ2VyLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICAvLyBOb3RoaW5nIGVsc2UgdG8gZGlzcGxheVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5IRUxQOiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gdGhpcy5jaGVja1JlbWFpbmluZyhsb2dnZXIsIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5SGVscChsb2dnZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuaGFuZGxlQ3VzdG9tQ29tbWFuZChsb2dnZXIsIGZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tYW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIk5vIGNvbW1hbmQgc3BlY2lmaWVkIHRyeSBoZWxwXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBVbmtub3duIGNvbW1hbmQgLSAke2NvbW1hbmR9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2Rpc2FibGVWZXJzaW9uQ2hlY2spIHtcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmVyc2lvbkNoZWNrSW50ZXJ2YWxJZCA9XG4gICAgICAgICAgICAgICAgICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9uZXdWZXJzaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHZlcnNpb25DaGVja0ludGVydmFsSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9uZXdWZXJzaW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuaW5nKGBBIG5ldyB2ZXJzaW9uIHYke3RoaXMuX25ld1ZlcnNpb259IG9mICR7dGhpcy5fcGFja2FnZU5hbWV9IGlzIGF2YWlsYWJsZS5gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm5pbmcoYFlvdSBhcmUgY3VycmVudCB1c2luZyB2ZXJzaW9uIHYke3RoaXMuX3BhY2thZ2VWZXJzaW9ufS5gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA1MCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBkaXNwbGF5QmFubmVyKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGluY2x1ZGVUaXRsZTogYm9vbGVhbiwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChpbmNsdWRlVGl0bGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoYCR7dGhpcy5fYXBwTmFtZX0gQ0xJYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRpciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZmlsZVN5c3RlbS5wYXRoR2V0RGlyZWN0b3J5KGAke2NvbW1hbmRMaW5lUGFyc2VyLmdldFNjcmlwdCgpfS5qc2ApLCBcIi4uL1wiKTtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb25FeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICBpZiAocGFja2FnZUpzb25FeGlzdHMpIHtcbiAgICAgICAgICAgIHR5cGUgUGFja2FnZSA9IHsgbmFtZTogc3RyaW5nOyB2ZXJzaW9uOiBzdHJpbmcgfTtcbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248UGFja2FnZT4ocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICAgICAgdGhpcy5fcGFja2FnZU5hbWUgPSBwYWNrYWdlSnNvbi5uYW1lO1xuICAgICAgICAgICAgdGhpcy5fcGFja2FnZVZlcnNpb24gPSBwYWNrYWdlSnNvbi52ZXJzaW9uO1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihgQ0xJIHYke3BhY2thZ2VKc29uLnZlcnNpb259YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlVmVyc2lvbkNoZWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXlBZGRpdGlvbmFsVmVyc2lvbihsb2dnZXIpO1xuICAgICAgICBpZiAoaW5jbHVkZVRpdGxlKSB7XG4gICAgICAgICAgICBsb2dnZXIuYmFubmVyKFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fZGlzYWJsZVZlcnNpb25DaGVjaykge1xuICAgICAgICAgICAgLy8gV2UgZG9uJ3Qgd2FpdCBmb3IgdGhlIHByb21pc2UgdG8gcmVzb2x2ZSBhcyB3ZSBkb24ndCB3YW50IGl0IHRvIGhvbGQgdXAgYW55dGhpbmcgZWxzZVxuICAgICAgICAgICAgLy8gbWVzc2FnZSB3aWxsIGJlIGRpc3BsYXllZCBhdCB0aGUgZW5kXG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1mbG9hdGluZy1wcm9taXNlcyAqL1xuICAgICAgICAgICAgdGhpcy5jaGVja1ZlcnNpb24obmV3IFdlYlNlY3VyZUNsaWVudCgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
