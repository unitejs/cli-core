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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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R0FBRyxJQUFJLENBQUMsUUFBUSxNQUFNLENBQUMsQ0FBQzthQUN6QztZQUVELE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pILE1BQU0saUJBQWlCLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUN0RixJQUFJLGlCQUFpQixFQUFFO2dCQUVuQixNQUFNLFdBQVcsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQVUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUMzRixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQztnQkFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQ2hEO2lCQUFNO2dCQUNILElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7YUFDcEM7WUFDRCxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsSUFBSSxZQUFZLEVBQUU7Z0JBQ2QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNyQjtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzVCLHdGQUF3RjtnQkFDeEYsdUNBQXVDO2dCQUN2Qyx5Q0FBeUM7Z0JBQ3pDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxpQ0FBZSxFQUFFLENBQUMsQ0FBQzthQUM1QztRQUNMLENBQUM7S0FBQTtDQUNKO0FBdFBELDBCQXNQQyIsImZpbGUiOiJjbGlCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVudHJ5IHBvaW50LlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IERlZmF1bHRMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9sb2dnZXJzL2RlZmF1bHRMb2dnZXJcIjtcbmltcG9ydCB7IEFnZ3JlZ2F0ZUxvZ2dlciB9IGZyb20gXCIuL2FnZ3JlZ2F0ZUxvZ2dlclwiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVBcmdDb25zdGFudHMgfSBmcm9tIFwiLi9jb21tYW5kTGluZUFyZ0NvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDb21tYW5kTGluZVBhcnNlciB9IGZyb20gXCIuL2NvbW1hbmRMaW5lUGFyc2VyXCI7XG5pbXBvcnQgeyBEaXNwbGF5TG9nZ2VyIH0gZnJvbSBcIi4vZGlzcGxheUxvZ2dlclwiO1xuaW1wb3J0IHsgRmlsZUxvZ2dlciB9IGZyb20gXCIuL2ZpbGVMb2dnZXJcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tIFwiLi9maWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBXZWJTZWN1cmVDbGllbnQgfSBmcm9tIFwiLi93ZWJTZWN1cmVDbGllbnRcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENMSUJhc2Uge1xuICAgIHByb3RlY3RlZCBfZGlzYWJsZVZlcnNpb25DaGVjazogYm9vbGVhbjtcbiAgICBwcm90ZWN0ZWQgX2FwcE5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgX3BhY2thZ2VOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIF9wYWNrYWdlVmVyc2lvbjogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfbmV3VmVyc2lvbjogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoYXBwTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2FwcE5hbWUgPSBhcHBOYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcnVuKHByb2Nlc3M6IE5vZGVKUy5Qcm9jZXNzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IGxvZ2dlcjogSUxvZ2dlciB8IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGZpbGVMb2dnZXI6IEZpbGVMb2dnZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCByZXQ6IG51bWJlcjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29tbWFuZExpbmVQYXJzZXIgPSBuZXcgQ29tbWFuZExpbmVQYXJzZXIoKTtcbiAgICAgICAgICAgIGNvbnN0IGJhZENvbW1hbmRzID0gY29tbWFuZExpbmVQYXJzZXIucGFyc2UocHJvY2VzcyA/IHByb2Nlc3MuYXJndiA6IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ2dlcnMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVTeXN0ZW0gPSBuZXcgRmlsZVN5c3RlbSgpO1xuXG4gICAgICAgICAgICBjb25zdCBub0NvbG9yID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Qm9vbGVhbkFyZ3VtZW50KENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLk5PX0NPTE9SKTtcbiAgICAgICAgICAgIGxvZ2dlcnMucHVzaChuZXcgRGlzcGxheUxvZ2dlcihwcm9jZXNzLCBub0NvbG9yKSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVWZXJzaW9uQ2hlY2sgPSBjb21tYW5kTGluZVBhcnNlci5nZXRCb29sZWFuQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuRElTQUJMRV9WRVJTSU9OX0NIRUNLKTtcblxuICAgICAgICAgICAgY29uc3QgbG9nRmlsZSA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldFN0cmluZ0FyZ3VtZW50KENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkxPR19GSUxFKTtcbiAgICAgICAgICAgIGlmIChsb2dGaWxlICE9PSB1bmRlZmluZWQgJiYgbG9nRmlsZSAhPT0gbnVsbCAmJiBsb2dGaWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmaWxlTG9nZ2VyID0gbmV3IEZpbGVMb2dnZXIobG9nRmlsZSwgZmlsZVN5c3RlbSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZUxvZ2dlci5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICAgICAgbG9nZ2Vycy5wdXNoKGZpbGVMb2dnZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2dnZXIgPSBuZXcgQWdncmVnYXRlTG9nZ2VyKGxvZ2dlcnMpO1xuXG4gICAgICAgICAgICBpZiAoY29tbWFuZExpbmVQYXJzZXIuZ2V0SW50ZXJwcmV0ZXIoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGNvbW1hbmQgbGluZSBjb250YWluZWQgbm8gaW50ZXJwcmV0ZXJcIik7XG4gICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZExpbmVQYXJzZXIuZ2V0U2NyaXB0KCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlRoZSBjb21tYW5kIGxpbmUgY29udGFpbmVkIG5vIHNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWRDb21tYW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGZvbGxvd2luZyBhcmd1bWVudHMgYXJlIGJhZGx5IGZvcm1lZFwiLCBiYWRDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5pbml0aWFsaXNlKGxvZ2dlciwgZmlsZVN5c3RlbSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzVmVyc2lvbkNvbW1hbmQgPSBjb21tYW5kTGluZVBhcnNlci5nZXRDb21tYW5kKCkgPT09IENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5WRVJTSU9OO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRpc3BsYXlCYW5uZXIobG9nZ2VyLCBmaWxlU3lzdGVtLCAhaXNWZXJzaW9uQ29tbWFuZCwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNWZXJzaW9uQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTk9fQ09MT1IsIHsgdmFsdWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9nRmlsZSAhPT0gdW5kZWZpbmVkICYmIGxvZ0ZpbGUgIT09IG51bGwgJiYgbG9nRmlsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTE9HX0ZJTEUsIHsgbG9nRmlsZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuaGFuZGxlQ29tbWFuZChsb2dnZXIsIGZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIGlmIChsb2dnZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlVuaGFuZGxlZCBFeGNlcHRpb25cIiwgZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgRGVmYXVsdExvZ2dlci5sb2coXCJBbiBlcnJvciBvY2N1cnJlZDogXCIsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZUxvZ2dlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhd2FpdCBmaWxlTG9nZ2VyLmNsb3NlZG93bigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWJzdHJhY3QgYXN5bmMgaGFuZGxlQ3VzdG9tQ29tbWFuZChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPG51bWJlcj47XG4gICAgcHVibGljIGFic3RyYWN0IGRpc3BsYXlIZWxwKGxvZ2dlcjogSUxvZ2dlcik6IG51bWJlcjtcblxuICAgIHB1YmxpYyBkaXNwbGF5QWRkaXRpb25hbFZlcnNpb24obG9nZ2VyOiBJTG9nZ2VyKTogdm9pZCB7XG4gICAgfVxuXG4gICAgcHVibGljIGNoZWNrUmVtYWluaW5nKGxvZ2dlcjogSUxvZ2dlciwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgcmVtYWluaW5nID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0UmVtYWluaW5nKCk7XG4gICAgICAgIGlmIChyZW1haW5pbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVW5yZWNvZ25pemVkIGFyZ3VtZW50cyBvbiB0aGUgY29tbWFuZCBsaW5lXCIsIHVuZGVmaW5lZCwgeyByZW1haW5pbmcgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGNoZWNrVmVyc2lvbihjbGllbnQ6IFdlYlNlY3VyZUNsaWVudCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBsZXQgaXNOZXdlciA9IGZhbHNlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgbmV3VmVyc2lvbiA9IFwiXCI7XG4gICAgICAgICAgICBpZiAodGhpcy5fcGFja2FnZU5hbWUgJiYgdGhpcy5fcGFja2FnZVZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICB0eXBlIFJlZ2lzdHJ5UGFja2FnZSA9IHsgdmVyc2lvbjogc3RyaW5nIH07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2U6IFJlZ2lzdHJ5UGFja2FnZSA9XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsaWVudC5nZXRKc29uPFJlZ2lzdHJ5UGFja2FnZT4oYGh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnLyR7dGhpcy5fcGFja2FnZU5hbWV9L2xhdGVzdC9gLCAxMDAwKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS52ZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gcmVzcG9uc2UudmVyc2lvbi5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYXJ0cyA9IHRoaXMuX3BhY2thZ2VWZXJzaW9uLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMyAmJiBjdXJyZW50UGFydHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYWpvciA9IHBhcnNlSW50KHBhcnRzWzBdLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYWpvckN1cnJlbnQgPSBwYXJzZUludChjdXJyZW50UGFydHNbMF0sIDEwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ham9yID4gbWFqb3JDdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXdlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1ham9yID09PSBtYWpvckN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtaW5vciA9IHBhcnNlSW50KHBhcnRzWzFdLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWlub3JDdXJyZW50ID0gcGFyc2VJbnQoY3VycmVudFBhcnRzWzFdLCAxMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWlub3IgPiBtaW5vckN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXdlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtaW5vciA9PT0gbWlub3JDdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoID0gcGFyc2VJbnQocGFydHNbMl0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hDdXJyZW50ID0gcGFyc2VJbnQoY3VycmVudFBhcnRzWzJdLCAxMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXdlciA9IHBhdGNoID4gcGF0Y2hDdXJyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmV3ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWZXJzaW9uID0gcmVzcG9uc2UudmVyc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX25ld1ZlcnNpb24gPSBuZXdWZXJzaW9uO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIFdlIHdpbGwgaWdub3JlIGVycm9ycyBhcyB0aGUgdmVyc2lvbiBjaGVjayBkb2Vzbid0IHdhcnJhbnQgZmFpbGluZyBhbnl0aGluZ1xuICAgICAgICAgICAgLy8gYmV0IHNldCB0aGUgbmV3IHZlcnNpb24gdG8gZW1wdHkgc28gdGhlIGNsaSBleGl0c1xuICAgICAgICAgICAgdGhpcy5fbmV3VmVyc2lvbiA9IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNOZXdlcjtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFya2Rvd25UYWJsZVRvQ2xpKGxvZ2dlcjogSUxvZ2dlciwgcm93OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHJvdyAhPT0gdW5kZWZpbmVkICYmIHJvdyAhPT0gbnVsbCAmJiByb3cubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgY29uc3QgbmV3Um93ID0gcm93LnN1YnN0cmluZygwLCByb3cubGVuZ3RoIC0gMSkudHJpbSgpLnJlcGxhY2UoL1xcfC9nLCBcIlwiKTtcbiAgICAgICAgICAgIGlmIChuZXdSb3dbMl0gPT09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAgICR7bmV3Um93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAtLSR7bmV3Um93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29tbWFuZChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0OiBudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBjb21tYW5kTGluZVBhcnNlci5nZXRDb21tYW5kKCk7XG5cbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XG4gICAgICAgICAgICBjYXNlIENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5WRVJTSU9OOiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gdGhpcy5jaGVja1JlbWFpbmluZyhsb2dnZXIsIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgIC8vIE5vdGhpbmcgZWxzZSB0byBkaXNwbGF5XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLkhFTFA6IHtcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLmNoZWNrUmVtYWluaW5nKGxvZ2dlciwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWxwKGxvZ2dlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5oYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlciwgZmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiTm8gY29tbWFuZCBzcGVjaWZpZWQgdHJ5IGhlbHBcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFVua25vd24gY29tbWFuZCAtICR7Y29tbWFuZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fZGlzYWJsZVZlcnNpb25DaGVjaykge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJzaW9uQ2hlY2tJbnRlcnZhbElkID1cbiAgICAgICAgICAgICAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX25ld1ZlcnNpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodmVyc2lvbkNoZWNrSW50ZXJ2YWxJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX25ld1ZlcnNpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm5pbmcoYEEgbmV3IHZlcnNpb24gdiR7dGhpcy5fbmV3VmVyc2lvbn0gb2YgJHt0aGlzLl9wYWNrYWdlTmFtZX0gaXMgYXZhaWxhYmxlLmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybmluZyhgWW91IGFyZSBjdXJyZW50IHVzaW5nIHZlcnNpb24gdiR7dGhpcy5fcGFja2FnZVZlcnNpb259LmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDUwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGRpc3BsYXlCYW5uZXIobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgaW5jbHVkZVRpdGxlOiBib29sZWFuLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGluY2x1ZGVUaXRsZSkge1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihgJHt0aGlzLl9hcHBOYW1lfSBDTElgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGlyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShmaWxlU3lzdGVtLnBhdGhHZXREaXJlY3RvcnkoYCR7Y29tbWFuZExpbmVQYXJzZXIuZ2V0U2NyaXB0KCl9LmpzYCksIFwiLi4vXCIpO1xuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhwYWNrYWdlSnNvbkRpciwgXCJwYWNrYWdlLmpzb25cIik7XG4gICAgICAgIGlmIChwYWNrYWdlSnNvbkV4aXN0cykge1xuICAgICAgICAgICAgdHlwZSBQYWNrYWdlID0geyBuYW1lOiBzdHJpbmc7IHZlcnNpb246IHN0cmluZyB9O1xuICAgICAgICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxQYWNrYWdlPihwYWNrYWdlSnNvbkRpciwgXCJwYWNrYWdlLmpzb25cIik7XG4gICAgICAgICAgICB0aGlzLl9wYWNrYWdlTmFtZSA9IHBhY2thZ2VKc29uLm5hbWU7XG4gICAgICAgICAgICB0aGlzLl9wYWNrYWdlVmVyc2lvbiA9IHBhY2thZ2VKc29uLnZlcnNpb247XG4gICAgICAgICAgICBsb2dnZXIuYmFubmVyKGBDTEkgdiR7cGFja2FnZUpzb24udmVyc2lvbn1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVWZXJzaW9uQ2hlY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheUFkZGl0aW9uYWxWZXJzaW9uKGxvZ2dlcik7XG4gICAgICAgIGlmIChpbmNsdWRlVGl0bGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9kaXNhYmxlVmVyc2lvbkNoZWNrKSB7XG4gICAgICAgICAgICAvLyBXZSBkb24ndCB3YWl0IGZvciB0aGUgcHJvbWlzZSB0byByZXNvbHZlIGFzIHdlIGRvbid0IHdhbnQgaXQgdG8gaG9sZCB1cCBhbnl0aGluZyBlbHNlXG4gICAgICAgICAgICAvLyBtZXNzYWdlIHdpbGwgYmUgZGlzcGxheWVkIGF0IHRoZSBlbmRcbiAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWZsb2F0aW5nLXByb21pc2VzICovXG4gICAgICAgICAgICB0aGlzLmNoZWNrVmVyc2lvbihuZXcgV2ViU2VjdXJlQ2xpZW50KCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
