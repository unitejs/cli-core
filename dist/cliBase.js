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
                    const response = yield client.getJson(`https://registry.npmjs.org/${this._packageName}/latest/`);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUcsV0FBVyxDQUFDLElBQUksQ0FBQztnQkFDckMsSUFBSSxDQUFDLGVBQWUsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUNELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBN05ELDBCQTZOQyIsImZpbGUiOiJjbGlCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVudHJ5IHBvaW50LlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IERlZmF1bHRMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9sb2dnZXJzL2RlZmF1bHRMb2dnZXJcIjtcbmltcG9ydCB7IEFnZ3JlZ2F0ZUxvZ2dlciB9IGZyb20gXCIuL2FnZ3JlZ2F0ZUxvZ2dlclwiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVBcmdDb25zdGFudHMgfSBmcm9tIFwiLi9jb21tYW5kTGluZUFyZ0NvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDb21tYW5kTGluZVBhcnNlciB9IGZyb20gXCIuL2NvbW1hbmRMaW5lUGFyc2VyXCI7XG5pbXBvcnQgeyBEaXNwbGF5TG9nZ2VyIH0gZnJvbSBcIi4vZGlzcGxheUxvZ2dlclwiO1xuaW1wb3J0IHsgRmlsZUxvZ2dlciB9IGZyb20gXCIuL2ZpbGVMb2dnZXJcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tIFwiLi9maWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBXZWJTZWN1cmVDbGllbnQgfSBmcm9tIFwiLi93ZWJTZWN1cmVDbGllbnRcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENMSUJhc2Uge1xuICAgIHByb3RlY3RlZCBfZGlzYWJsZVZlcnNpb25DaGVjazogYm9vbGVhbjtcbiAgICBwcm90ZWN0ZWQgX2FwcE5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgX3BhY2thZ2VOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIF9wYWNrYWdlVmVyc2lvbjogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoYXBwTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2FwcE5hbWUgPSBhcHBOYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcnVuKHByb2Nlc3M6IE5vZGVKUy5Qcm9jZXNzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IGxvZ2dlcjogSUxvZ2dlciB8IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGZpbGVMb2dnZXI6IEZpbGVMb2dnZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCByZXQ6IG51bWJlcjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29tbWFuZExpbmVQYXJzZXIgPSBuZXcgQ29tbWFuZExpbmVQYXJzZXIoKTtcbiAgICAgICAgICAgIGNvbnN0IGJhZENvbW1hbmRzID0gY29tbWFuZExpbmVQYXJzZXIucGFyc2UocHJvY2VzcyA/IHByb2Nlc3MuYXJndiA6IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ2dlcnMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVTeXN0ZW0gPSBuZXcgRmlsZVN5c3RlbSgpO1xuXG4gICAgICAgICAgICBjb25zdCBub0NvbG9yID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Qm9vbGVhbkFyZ3VtZW50KENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLk5PX0NPTE9SKTtcbiAgICAgICAgICAgIGxvZ2dlcnMucHVzaChuZXcgRGlzcGxheUxvZ2dlcihwcm9jZXNzLCBub0NvbG9yKSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVWZXJzaW9uQ2hlY2sgPSBjb21tYW5kTGluZVBhcnNlci5nZXRCb29sZWFuQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuRElTQUJMRV9WRVJTSU9OX0NIRUNLKTtcblxuICAgICAgICAgICAgY29uc3QgbG9nRmlsZSA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldFN0cmluZ0FyZ3VtZW50KENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkxPR19GSUxFKTtcbiAgICAgICAgICAgIGlmIChsb2dGaWxlICE9PSB1bmRlZmluZWQgJiYgbG9nRmlsZSAhPT0gbnVsbCAmJiBsb2dGaWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmaWxlTG9nZ2VyID0gbmV3IEZpbGVMb2dnZXIobG9nRmlsZSwgZmlsZVN5c3RlbSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZUxvZ2dlci5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICAgICAgbG9nZ2Vycy5wdXNoKGZpbGVMb2dnZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2dnZXIgPSBuZXcgQWdncmVnYXRlTG9nZ2VyKGxvZ2dlcnMpO1xuXG4gICAgICAgICAgICBpZiAoY29tbWFuZExpbmVQYXJzZXIuZ2V0SW50ZXJwcmV0ZXIoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGNvbW1hbmQgbGluZSBjb250YWluZWQgbm8gaW50ZXJwcmV0ZXJcIik7XG4gICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZExpbmVQYXJzZXIuZ2V0U2NyaXB0KCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlRoZSBjb21tYW5kIGxpbmUgY29udGFpbmVkIG5vIHNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWRDb21tYW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGZvbGxvd2luZyBhcmd1bWVudHMgYXJlIGJhZGx5IGZvcm1lZFwiLCBiYWRDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5pbml0aWFsaXNlKGxvZ2dlciwgZmlsZVN5c3RlbSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzVmVyc2lvbkNvbW1hbmQgPSBjb21tYW5kTGluZVBhcnNlci5nZXRDb21tYW5kKCkgPT09IENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5WRVJTSU9OO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRpc3BsYXlCYW5uZXIobG9nZ2VyLCBmaWxlU3lzdGVtLCAhaXNWZXJzaW9uQ29tbWFuZCwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNWZXJzaW9uQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTk9fQ09MT1IsIHsgdmFsdWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9nRmlsZSAhPT0gdW5kZWZpbmVkICYmIGxvZ0ZpbGUgIT09IG51bGwgJiYgbG9nRmlsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTE9HX0ZJTEUsIHsgbG9nRmlsZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuaGFuZGxlQ29tbWFuZChsb2dnZXIsIGZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIGlmIChsb2dnZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlVuaGFuZGxlZCBFeGNlcHRpb25cIiwgZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgRGVmYXVsdExvZ2dlci5sb2coXCJBbiBlcnJvciBvY2N1cnJlZDogXCIsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZUxvZ2dlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhd2FpdCBmaWxlTG9nZ2VyLmNsb3NlZG93bigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWJzdHJhY3QgYXN5bmMgaGFuZGxlQ3VzdG9tQ29tbWFuZChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPG51bWJlcj47XG4gICAgcHVibGljIGFic3RyYWN0IGRpc3BsYXlIZWxwKGxvZ2dlcjogSUxvZ2dlcik6IG51bWJlcjtcblxuICAgIHB1YmxpYyBkaXNwbGF5QWRkaXRpb25hbFZlcnNpb24obG9nZ2VyOiBJTG9nZ2VyKTogdm9pZCB7XG4gICAgfVxuXG4gICAgcHVibGljIGNoZWNrUmVtYWluaW5nKGxvZ2dlcjogSUxvZ2dlciwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgcmVtYWluaW5nID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0UmVtYWluaW5nKCk7XG4gICAgICAgIGlmIChyZW1haW5pbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVW5yZWNvZ25pemVkIGFyZ3VtZW50cyBvbiB0aGUgY29tbWFuZCBsaW5lXCIsIHVuZGVmaW5lZCwgeyByZW1haW5pbmcgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGNoZWNrVmVyc2lvbihsb2dnZXI6IElMb2dnZXIsIGNsaWVudDogV2ViU2VjdXJlQ2xpZW50KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIGxldCBpc05ld2VyID0gZmFsc2U7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wYWNrYWdlTmFtZSAmJiB0aGlzLl9wYWNrYWdlVmVyc2lvbikge1xuICAgICAgICAgICAgICAgIHR5cGUgUmVnaXN0cnlQYWNrYWdlID0geyB2ZXJzaW9uOiBzdHJpbmcgfTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZTogUmVnaXN0cnlQYWNrYWdlID1cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmdldEpzb248UmVnaXN0cnlQYWNrYWdlPihgaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvJHt0aGlzLl9wYWNrYWdlTmFtZX0vbGF0ZXN0L2ApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLnZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFydHMgPSByZXNwb25zZS52ZXJzaW9uLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFBhcnRzID0gdGhpcy5fcGFja2FnZVZlcnNpb24uc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAzICYmIGN1cnJlbnRQYXJ0cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ham9yID0gcGFyc2VJbnQocGFydHNbMF0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ham9yQ3VycmVudCA9IHBhcnNlSW50KGN1cnJlbnRQYXJ0c1swXSwgMTApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFqb3IgPiBtYWpvckN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc05ld2VyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWFqb3IgPT09IG1ham9yQ3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pbm9yID0gcGFyc2VJbnQocGFydHNbMV0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtaW5vckN1cnJlbnQgPSBwYXJzZUludChjdXJyZW50UGFydHNbMV0sIDEwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtaW5vciA+IG1pbm9yQ3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc05ld2VyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1pbm9yID09PSBtaW5vckN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0Y2ggPSBwYXJzZUludChwYXJ0c1syXSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRjaEN1cnJlbnQgPSBwYXJzZUludChjdXJyZW50UGFydHNbMl0sIDEwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc05ld2VyID0gcGF0Y2ggPiBwYXRjaEN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOZXdlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuaW5nKGBBIG5ldyB2ZXJzaW9uIHYke3Jlc3BvbnNlLnZlcnNpb259IG9mICR7dGhpcy5fcGFja2FnZU5hbWV9IGlzIGF2YWlsYWJsZS5gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybmluZyhgWW91IGFyZSBjdXJyZW50IHVzaW5nIHZlcnNpb24gdiR7dGhpcy5fcGFja2FnZVZlcnNpb259LmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIFdlIHdpbGwgaWdub3JlIGVycm9ycyBhcyB0aGUgdmVyc2lvbiBjaGVjayBkb2Vzbid0IHdhcnJhbnQgZmFpbGluZyBhbnl0aGluZ1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzTmV3ZXI7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG1hcmtkb3duVGFibGVUb0NsaShsb2dnZXI6IElMb2dnZXIsIHJvdzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChyb3cgIT09IHVuZGVmaW5lZCAmJiByb3cgIT09IG51bGwgJiYgcm93Lmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JvdyA9IHJvdy5zdWJzdHJpbmcoMCwgcm93Lmxlbmd0aCAtIDEpLnRyaW0oKS5yZXBsYWNlKC9cXHwvZywgXCJcIik7XG4gICAgICAgICAgICBpZiAobmV3Um93WzJdID09PSBcIiBcIikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgICAke25ld1Jvdy5zdWJzdHJpbmcoMSl9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgLS0ke25ld1Jvdy5zdWJzdHJpbmcoMSl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZUNvbW1hbmQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldDogbnVtYmVyID0gMDtcblxuICAgICAgICBjb25zdCBjb21tYW5kID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Q29tbWFuZCgpO1xuXG4gICAgICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgICAgICAgY2FzZSBDb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHMuVkVSU0lPTjoge1xuICAgICAgICAgICAgICAgIHJldCA9IHRoaXMuY2hlY2tSZW1haW5pbmcobG9nZ2VyLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICAvLyBOb3RoaW5nIGVsc2UgdG8gZGlzcGxheVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5IRUxQOiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gdGhpcy5jaGVja1JlbWFpbmluZyhsb2dnZXIsIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5SGVscChsb2dnZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuaGFuZGxlQ3VzdG9tQ29tbWFuZChsb2dnZXIsIGZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tYW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIk5vIGNvbW1hbmQgc3BlY2lmaWVkIHRyeSBoZWxwXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBVbmtub3duIGNvbW1hbmQgLSAke2NvbW1hbmR9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2Rpc2FibGVWZXJzaW9uQ2hlY2spIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY2hlY2tWZXJzaW9uKGxvZ2dlciwgbmV3IFdlYlNlY3VyZUNsaWVudCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBkaXNwbGF5QmFubmVyKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGluY2x1ZGVUaXRsZTogYm9vbGVhbiwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChpbmNsdWRlVGl0bGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoYCR7dGhpcy5fYXBwTmFtZX0gQ0xJYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRpciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZmlsZVN5c3RlbS5wYXRoR2V0RGlyZWN0b3J5KGAke2NvbW1hbmRMaW5lUGFyc2VyLmdldFNjcmlwdCgpfS5qc2ApLCBcIi4uL1wiKTtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb25FeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICBpZiAocGFja2FnZUpzb25FeGlzdHMpIHtcbiAgICAgICAgICAgIHR5cGUgUGFja2FnZSA9IHsgbmFtZTogc3RyaW5nOyB2ZXJzaW9uOiBzdHJpbmcgfTtcbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248UGFja2FnZT4ocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICAgICAgdGhpcy5fcGFja2FnZU5hbWUgPSBwYWNrYWdlSnNvbi5uYW1lO1xuICAgICAgICAgICAgdGhpcy5fcGFja2FnZVZlcnNpb24gPSBwYWNrYWdlSnNvbi52ZXJzaW9uO1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihgQ0xJIHYke3BhY2thZ2VKc29uLnZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5QWRkaXRpb25hbFZlcnNpb24obG9nZ2VyKTtcbiAgICAgICAgaWYgKGluY2x1ZGVUaXRsZSkge1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihcIlwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
