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
    checkVersion(logger, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let isNewer = false;
            try {
                if (this._packageName && this._packageVersion) {
                    const response = yield client.getJson(`https://registry.npmjs.org/${this._packageName}/latest/`, 2000);
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
                                logger.info("");
                                logger.warning(`A new version v${response.version} of ${this._packageName} is available.`);
                                logger.warning(`You are current using version v${this._packageVersion}.`);
                            }
                        }
                    }
                }
            }
            catch (err) {
                // We will ignore errors as the version check doesn't warrant failing anything
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
                yield this.checkVersion(logger, new webSecureClient_1.WebSecureClient());
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
            this.displayAdditionalVersion(logger);
            if (includeTitle) {
                logger.banner("");
            }
        });
    }
}
exports.CLIBase = CLIBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQztnQkFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELENBQUM7WUFDRCxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDZixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTdORCwwQkE2TkMiLCJmaWxlIjoiY2xpQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbnRyeSBwb2ludC5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBEZWZhdWx0TG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvbG9nZ2Vycy9kZWZhdWx0TG9nZ2VyXCI7XG5pbXBvcnQgeyBBZ2dyZWdhdGVMb2dnZXIgfSBmcm9tIFwiLi9hZ2dyZWdhdGVMb2dnZXJcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29tbWFuZExpbmVBcmdDb25zdGFudHNcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cyB9IGZyb20gXCIuL2NvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVQYXJzZXIgfSBmcm9tIFwiLi9jb21tYW5kTGluZVBhcnNlclwiO1xuaW1wb3J0IHsgRGlzcGxheUxvZ2dlciB9IGZyb20gXCIuL2Rpc3BsYXlMb2dnZXJcIjtcbmltcG9ydCB7IEZpbGVMb2dnZXIgfSBmcm9tIFwiLi9maWxlTG9nZ2VyXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSBcIi4vZmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgV2ViU2VjdXJlQ2xpZW50IH0gZnJvbSBcIi4vd2ViU2VjdXJlQ2xpZW50XCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDTElCYXNlIHtcbiAgICBwcm90ZWN0ZWQgX2Rpc2FibGVWZXJzaW9uQ2hlY2s6IGJvb2xlYW47XG4gICAgcHJvdGVjdGVkIF9hcHBOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIF9wYWNrYWdlTmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfcGFja2FnZVZlcnNpb246IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGFwcE5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9hcHBOYW1lID0gYXBwTmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bihwcm9jZXNzOiBOb2RlSlMuUHJvY2Vzcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBsb2dnZXI6IElMb2dnZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBmaWxlTG9nZ2VyOiBGaWxlTG9nZ2VyIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcmV0OiBudW1iZXI7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRMaW5lUGFyc2VyID0gbmV3IENvbW1hbmRMaW5lUGFyc2VyKCk7XG4gICAgICAgICAgICBjb25zdCBiYWRDb21tYW5kcyA9IGNvbW1hbmRMaW5lUGFyc2VyLnBhcnNlKHByb2Nlc3MgPyBwcm9jZXNzLmFyZ3YgOiB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBjb25zdCBsb2dnZXJzID0gW107XG4gICAgICAgICAgICBjb25zdCBmaWxlU3lzdGVtID0gbmV3IEZpbGVTeXN0ZW0oKTtcblxuICAgICAgICAgICAgY29uc3Qgbm9Db2xvciA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldEJvb2xlYW5Bcmd1bWVudChDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5OT19DT0xPUik7XG4gICAgICAgICAgICBsb2dnZXJzLnB1c2gobmV3IERpc3BsYXlMb2dnZXIocHJvY2Vzcywgbm9Db2xvcikpO1xuXG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlVmVyc2lvbkNoZWNrID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Qm9vbGVhbkFyZ3VtZW50KENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkRJU0FCTEVfVkVSU0lPTl9DSEVDSyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBjb21tYW5kTGluZVBhcnNlci5nZXRTdHJpbmdBcmd1bWVudChDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5MT0dfRklMRSk7XG4gICAgICAgICAgICBpZiAobG9nRmlsZSAhPT0gdW5kZWZpbmVkICYmIGxvZ0ZpbGUgIT09IG51bGwgJiYgbG9nRmlsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZmlsZUxvZ2dlciA9IG5ldyBGaWxlTG9nZ2VyKGxvZ0ZpbGUsIGZpbGVTeXN0ZW0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVMb2dnZXIuaW5pdGlhbGlzZSgpO1xuICAgICAgICAgICAgICAgIGxvZ2dlcnMucHVzaChmaWxlTG9nZ2VyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyID0gbmV3IEFnZ3JlZ2F0ZUxvZ2dlcihsb2dnZXJzKTtcblxuICAgICAgICAgICAgaWYgKGNvbW1hbmRMaW5lUGFyc2VyLmdldEludGVycHJldGVyKCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlRoZSBjb21tYW5kIGxpbmUgY29udGFpbmVkIG5vIGludGVycHJldGVyXCIpO1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmRMaW5lUGFyc2VyLmdldFNjcmlwdCgpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJUaGUgY29tbWFuZCBsaW5lIGNvbnRhaW5lZCBubyBzY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFkQ29tbWFuZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlRoZSBmb2xsb3dpbmcgYXJndW1lbnRzIGFyZSBiYWRseSBmb3JtZWRcIiwgYmFkQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuaW5pdGlhbGlzZShsb2dnZXIsIGZpbGVTeXN0ZW0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1ZlcnNpb25Db21tYW5kID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Q29tbWFuZCgpID09PSBDb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHMuVkVSU0lPTjtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXNwbGF5QmFubmVyKGxvZ2dlciwgZmlsZVN5c3RlbSwgIWlzVmVyc2lvbkNvbW1hbmQsIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmVyc2lvbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub0NvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLk5PX0NPTE9SLCB7IHZhbHVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ0ZpbGUgIT09IHVuZGVmaW5lZCAmJiBsb2dGaWxlICE9PSBudWxsICYmIGxvZ0ZpbGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkxPR19GSUxFLCB7IGxvZ0ZpbGUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmhhbmRsZUNvbW1hbmQobG9nZ2VyLCBmaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICBpZiAobG9nZ2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJVbmhhbmRsZWQgRXhjZXB0aW9uXCIsIGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIERlZmF1bHRMb2dnZXIubG9nKFwiQW4gZXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbGVMb2dnZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYXdhaXQgZmlsZUxvZ2dlci5jbG9zZWRvd24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFic3RyYWN0IGFzeW5jIGhhbmRsZUN1c3RvbUNvbW1hbmQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTxudW1iZXI+O1xuICAgIHB1YmxpYyBhYnN0cmFjdCBkaXNwbGF5SGVscChsb2dnZXI6IElMb2dnZXIpOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgZGlzcGxheUFkZGl0aW9uYWxWZXJzaW9uKGxvZ2dlcjogSUxvZ2dlcik6IHZvaWQge1xuICAgIH1cblxuICAgIHB1YmxpYyBjaGVja1JlbWFpbmluZyhsb2dnZXI6IElMb2dnZXIsIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHJlbWFpbmluZyA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldFJlbWFpbmluZygpO1xuICAgICAgICBpZiAocmVtYWluaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlVucmVjb2duaXplZCBhcmd1bWVudHMgb24gdGhlIGNvbW1hbmQgbGluZVwiLCB1bmRlZmluZWQsIHsgcmVtYWluaW5nIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBjaGVja1ZlcnNpb24obG9nZ2VyOiBJTG9nZ2VyLCBjbGllbnQ6IFdlYlNlY3VyZUNsaWVudCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBsZXQgaXNOZXdlciA9IGZhbHNlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcGFja2FnZU5hbWUgJiYgdGhpcy5fcGFja2FnZVZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICB0eXBlIFJlZ2lzdHJ5UGFja2FnZSA9IHsgdmVyc2lvbjogc3RyaW5nIH07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2U6IFJlZ2lzdHJ5UGFja2FnZSA9XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsaWVudC5nZXRKc29uPFJlZ2lzdHJ5UGFja2FnZT4oYGh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnLyR7dGhpcy5fcGFja2FnZU5hbWV9L2xhdGVzdC9gLCAyMDAwKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS52ZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gcmVzcG9uc2UudmVyc2lvbi5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYXJ0cyA9IHRoaXMuX3BhY2thZ2VWZXJzaW9uLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMyAmJiBjdXJyZW50UGFydHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYWpvciA9IHBhcnNlSW50KHBhcnRzWzBdLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYWpvckN1cnJlbnQgPSBwYXJzZUludChjdXJyZW50UGFydHNbMF0sIDEwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ham9yID4gbWFqb3JDdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXdlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1ham9yID09PSBtYWpvckN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtaW5vciA9IHBhcnNlSW50KHBhcnRzWzFdLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWlub3JDdXJyZW50ID0gcGFyc2VJbnQoY3VycmVudFBhcnRzWzFdLCAxMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWlub3IgPiBtaW5vckN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXdlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtaW5vciA9PT0gbWlub3JDdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoID0gcGFyc2VJbnQocGFydHNbMl0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hDdXJyZW50ID0gcGFyc2VJbnQoY3VycmVudFBhcnRzWzJdLCAxMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXdlciA9IHBhdGNoID4gcGF0Y2hDdXJyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmV3ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybmluZyhgQSBuZXcgdmVyc2lvbiB2JHtyZXNwb25zZS52ZXJzaW9ufSBvZiAke3RoaXMuX3BhY2thZ2VOYW1lfSBpcyBhdmFpbGFibGUuYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm5pbmcoYFlvdSBhcmUgY3VycmVudCB1c2luZyB2ZXJzaW9uIHYke3RoaXMuX3BhY2thZ2VWZXJzaW9ufS5gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBXZSB3aWxsIGlnbm9yZSBlcnJvcnMgYXMgdGhlIHZlcnNpb24gY2hlY2sgZG9lc24ndCB3YXJyYW50IGZhaWxpbmcgYW55dGhpbmdcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc05ld2VyO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBtYXJrZG93blRhYmxlVG9DbGkobG9nZ2VyOiBJTG9nZ2VyLCByb3c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAocm93ICE9PSB1bmRlZmluZWQgJiYgcm93ICE9PSBudWxsICYmIHJvdy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdSb3cgPSByb3cuc3Vic3RyaW5nKDAsIHJvdy5sZW5ndGggLSAxKS50cmltKCkucmVwbGFjZSgvXFx8L2csIFwiXCIpO1xuICAgICAgICAgICAgaWYgKG5ld1Jvd1syXSA9PT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgICAgJHtuZXdSb3cuc3Vic3RyaW5nKDEpfWApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgIC0tJHtuZXdSb3cuc3Vic3RyaW5nKDEpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBoYW5kbGVDb21tYW5kKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQ6IG51bWJlciA9IDA7XG5cbiAgICAgICAgY29uc3QgY29tbWFuZCA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldENvbW1hbmQoKTtcblxuICAgICAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICAgICAgICAgIGNhc2UgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLlZFUlNJT046IHtcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLmNoZWNrUmVtYWluaW5nKGxvZ2dlciwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgLy8gTm90aGluZyBlbHNlIHRvIGRpc3BsYXlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBDb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHMuSEVMUDoge1xuICAgICAgICAgICAgICAgIHJldCA9IHRoaXMuY2hlY2tSZW1haW5pbmcobG9nZ2VyLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUhlbHAobG9nZ2VyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmhhbmRsZUN1c3RvbUNvbW1hbmQobG9nZ2VyLCBmaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJObyBjb21tYW5kIHNwZWNpZmllZCB0cnkgaGVscFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgVW5rbm93biBjb21tYW5kIC0gJHtjb21tYW5kfWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9kaXNhYmxlVmVyc2lvbkNoZWNrKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNoZWNrVmVyc2lvbihsb2dnZXIsIG5ldyBXZWJTZWN1cmVDbGllbnQoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZGlzcGxheUJhbm5lcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBpbmNsdWRlVGl0bGU6IGJvb2xlYW4sIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoaW5jbHVkZVRpdGxlKSB7XG4gICAgICAgICAgICBsb2dnZXIuYmFubmVyKGAke3RoaXMuX2FwcE5hbWV9IENMSWApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFja2FnZUpzb25EaXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGZpbGVTeXN0ZW0ucGF0aEdldERpcmVjdG9yeShgJHtjb21tYW5kTGluZVBhcnNlci5nZXRTY3JpcHQoKX0uanNgKSwgXCIuLi9cIik7XG4gICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKHBhY2thZ2VKc29uRGlyLCBcInBhY2thZ2UuanNvblwiKTtcbiAgICAgICAgaWYgKHBhY2thZ2VKc29uRXhpc3RzKSB7XG4gICAgICAgICAgICB0eXBlIFBhY2thZ2UgPSB7IG5hbWU6IHN0cmluZzsgdmVyc2lvbjogc3RyaW5nIH07XG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFBhY2thZ2U+KHBhY2thZ2VKc29uRGlyLCBcInBhY2thZ2UuanNvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3BhY2thZ2VOYW1lID0gcGFja2FnZUpzb24ubmFtZTtcbiAgICAgICAgICAgIHRoaXMuX3BhY2thZ2VWZXJzaW9uID0gcGFja2FnZUpzb24udmVyc2lvbjtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoYENMSSB2JHtwYWNrYWdlSnNvbi52ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheUFkZGl0aW9uYWxWZXJzaW9uKGxvZ2dlcik7XG4gICAgICAgIGlmIChpbmNsdWRlVGl0bGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoXCJcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
