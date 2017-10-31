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
            yield this.checkVersion(logger, new webSecureClient_1.WebSecureClient());
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGlCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSxnRkFBNkU7QUFDN0UsdURBQW9EO0FBQ3BELHVFQUFvRTtBQUNwRSwrRUFBNEU7QUFDNUUsMkRBQXdEO0FBQ3hELG1EQUFnRDtBQUNoRCw2Q0FBMEM7QUFDMUMsNkNBQTBDO0FBQzFDLHVEQUFvRDtBQUVwRDtJQUtJLFlBQVksT0FBZTtRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1Qjs7WUFDNUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLEdBQUcsQ0FBQyxPQUF1Qjs7WUFDcEMsSUFBSSxNQUEyQixDQUFDO1lBQ2hDLElBQUksVUFBa0MsQ0FBQztZQUN2QyxJQUFJLEdBQVcsQ0FBQztZQUVoQixJQUFJLENBQUM7Z0JBQ0QsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLHFDQUFpQixFQUFFLENBQUM7Z0JBQ2xELE1BQU0sV0FBVyxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUVoRixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sVUFBVSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO2dCQUVwQyxNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxpREFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkYsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLDZCQUFhLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBRWxELE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLGlEQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0RixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sS0FBSyxJQUFJLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsRSxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDakQsTUFBTSxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQzlCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzdCLENBQUM7Z0JBRUQsTUFBTSxHQUFHLElBQUksaUNBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFdEMsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO29CQUMxRCxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELE1BQU0sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztvQkFDckQsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDWixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQ3RFLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ1osQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFFaEQsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osTUFBTSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsS0FBSyx5REFBMkIsQ0FBQyxPQUFPLENBQUM7d0JBQ2hHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQzt3QkFFbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7NEJBQ3BCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0NBQ1YsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO2dDQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLGlEQUF1QixDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7NEJBQzdELENBQUM7NEJBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxpREFBdUIsQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDOzRCQUMvRCxDQUFDO3dCQUNMLENBQUM7d0JBRUQsR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUM7b0JBQzFFLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ1IsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osNkJBQWEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2xELENBQUM7WUFDTCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pDLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBS00sd0JBQXdCLENBQUMsTUFBZTtJQUMvQyxDQUFDO0lBRU0sY0FBYyxDQUFDLE1BQWUsRUFBRSxpQkFBb0M7UUFDdkUsTUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsNENBQTRDLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUNyRixNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7SUFDTCxDQUFDO0lBRWUsWUFBWSxDQUFDLE1BQWUsRUFBRSxNQUF1Qjs7WUFDakUsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBRXBCLElBQUksQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO29CQUU1QyxNQUFNLFFBQVEsR0FDVixNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQWtCLDhCQUE4QixJQUFJLENBQUMsWUFBWSxVQUFVLENBQUMsQ0FBQztvQkFFckcsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUMvQixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDMUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3JELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbEQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzs0QkFDckMsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzs0QkFFbkQsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZCLE9BQU8sR0FBRyxJQUFJLENBQUM7NEJBQ25CLENBQUM7NEJBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dDQUNoQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dDQUNyQyxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dDQUVuRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztvQ0FDdkIsT0FBTyxHQUFHLElBQUksQ0FBQztnQ0FDbkIsQ0FBQztnQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7b0NBQ2hDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0NBQ3JDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0NBRW5ELE9BQU8sR0FBRyxLQUFLLEdBQUcsWUFBWSxDQUFDO2dDQUNuQyxDQUFDOzRCQUNMLENBQUM7NEJBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQ0FDVixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dDQUNoQixNQUFNLENBQUMsT0FBTyxDQUFDLGtCQUFrQixRQUFRLENBQUMsT0FBTyxPQUFPLElBQUksQ0FBQyxZQUFZLGdCQUFnQixDQUFDLENBQUM7Z0NBQzNGLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0NBQWtDLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDOzRCQUM5RSxDQUFDO3dCQUNMLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsOEVBQThFO1lBQ2xGLENBQUM7WUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUM7S0FBQTtJQUVTLGtCQUFrQixDQUFDLE1BQWUsRUFBRSxHQUFXO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFYSxhQUFhLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsaUJBQW9DOztZQUN0RyxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUM7WUFFcEIsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxFQUFFLENBQUM7WUFFL0MsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFLLHlEQUEyQixDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN2QyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztvQkFFckQsMEJBQTBCO29CQUMxQixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFFRCxLQUFLLHlEQUEyQixDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztvQkFFckQsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDN0IsQ0FBQztvQkFDRCxLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFFRCxTQUFTLENBQUM7b0JBQ04sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztvQkFFNUUsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1YsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7NEJBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQzt3QkFDbEQsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixPQUFPLEVBQUUsQ0FBQyxDQUFDO3dCQUNqRCxDQUFDO3dCQUNELEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ1osQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxpQ0FBZSxFQUFFLENBQUMsQ0FBQztZQUV2RCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRWEsYUFBYSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLFlBQXFCLEVBQUUsaUJBQW9DOztZQUM3SCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxNQUFNLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBRUQsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekgsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3RGLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFFcEIsTUFBTSxXQUFXLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUFVLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDM0YsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNqRCxDQUFDO1lBQ0QsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUF4TkQsMEJBd05DIiwiZmlsZSI6ImNsaUJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1haW4gZW50cnkgcG9pbnQuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRGVmYXVsdExvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2xvZ2dlcnMvZGVmYXVsdExvZ2dlclwiO1xuaW1wb3J0IHsgQWdncmVnYXRlTG9nZ2VyIH0gZnJvbSBcIi4vYWdncmVnYXRlTG9nZ2VyXCI7XG5pbXBvcnQgeyBDb21tYW5kTGluZUFyZ0NvbnN0YW50cyB9IGZyb20gXCIuL2NvbW1hbmRMaW5lQXJnQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHMgfSBmcm9tIFwiLi9jb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHNcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lUGFyc2VyIH0gZnJvbSBcIi4vY29tbWFuZExpbmVQYXJzZXJcIjtcbmltcG9ydCB7IERpc3BsYXlMb2dnZXIgfSBmcm9tIFwiLi9kaXNwbGF5TG9nZ2VyXCI7XG5pbXBvcnQgeyBGaWxlTG9nZ2VyIH0gZnJvbSBcIi4vZmlsZUxvZ2dlclwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbSB9IGZyb20gXCIuL2ZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IFdlYlNlY3VyZUNsaWVudCB9IGZyb20gXCIuL3dlYlNlY3VyZUNsaWVudFwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ0xJQmFzZSB7XG4gICAgcHJvdGVjdGVkIF9hcHBOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIF9wYWNrYWdlTmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfcGFja2FnZVZlcnNpb246IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGFwcE5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9hcHBOYW1lID0gYXBwTmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bihwcm9jZXNzOiBOb2RlSlMuUHJvY2Vzcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBsb2dnZXI6IElMb2dnZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBmaWxlTG9nZ2VyOiBGaWxlTG9nZ2VyIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcmV0OiBudW1iZXI7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRMaW5lUGFyc2VyID0gbmV3IENvbW1hbmRMaW5lUGFyc2VyKCk7XG4gICAgICAgICAgICBjb25zdCBiYWRDb21tYW5kcyA9IGNvbW1hbmRMaW5lUGFyc2VyLnBhcnNlKHByb2Nlc3MgPyBwcm9jZXNzLmFyZ3YgOiB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBjb25zdCBsb2dnZXJzID0gW107XG4gICAgICAgICAgICBjb25zdCBmaWxlU3lzdGVtID0gbmV3IEZpbGVTeXN0ZW0oKTtcblxuICAgICAgICAgICAgY29uc3Qgbm9Db2xvciA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldEJvb2xlYW5Bcmd1bWVudChDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5OT19DT0xPUik7XG4gICAgICAgICAgICBsb2dnZXJzLnB1c2gobmV3IERpc3BsYXlMb2dnZXIocHJvY2Vzcywgbm9Db2xvcikpO1xuXG4gICAgICAgICAgICBjb25zdCBsb2dGaWxlID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0U3RyaW5nQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTE9HX0ZJTEUpO1xuICAgICAgICAgICAgaWYgKGxvZ0ZpbGUgIT09IHVuZGVmaW5lZCAmJiBsb2dGaWxlICE9PSBudWxsICYmIGxvZ0ZpbGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZpbGVMb2dnZXIgPSBuZXcgRmlsZUxvZ2dlcihsb2dGaWxlLCBmaWxlU3lzdGVtKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlTG9nZ2VyLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgICAgICBsb2dnZXJzLnB1c2goZmlsZUxvZ2dlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvZ2dlciA9IG5ldyBBZ2dyZWdhdGVMb2dnZXIobG9nZ2Vycyk7XG5cbiAgICAgICAgICAgIGlmIChjb21tYW5kTGluZVBhcnNlci5nZXRJbnRlcnByZXRlcigpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJUaGUgY29tbWFuZCBsaW5lIGNvbnRhaW5lZCBubyBpbnRlcnByZXRlclwiKTtcbiAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kTGluZVBhcnNlci5nZXRTY3JpcHQoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGNvbW1hbmQgbGluZSBjb250YWluZWQgbm8gc2NyaXB0XCIpO1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhZENvbW1hbmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJUaGUgZm9sbG93aW5nIGFyZ3VtZW50cyBhcmUgYmFkbHkgZm9ybWVkXCIsIGJhZENvbW1hbmRzKTtcbiAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmluaXRpYWxpc2UobG9nZ2VyLCBmaWxlU3lzdGVtKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNWZXJzaW9uQ29tbWFuZCA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldENvbW1hbmQoKSA9PT0gQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLlZFUlNJT047XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGlzcGxheUJhbm5lcihsb2dnZXIsIGZpbGVTeXN0ZW0sICFpc1ZlcnNpb25Db21tYW5kLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZlcnNpb25Db21tYW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9Db2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5OT19DT0xPUiwgeyB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dGaWxlICE9PSB1bmRlZmluZWQgJiYgbG9nRmlsZSAhPT0gbnVsbCAmJiBsb2dGaWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5MT0dfRklMRSwgeyBsb2dGaWxlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5oYW5kbGVDb21tYW5kKGxvZ2dlciwgZmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgaWYgKGxvZ2dlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVW5oYW5kbGVkIEV4Y2VwdGlvblwiLCBlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBEZWZhdWx0TG9nZ2VyLmxvZyhcIkFuIGVycm9yIG9jY3VycmVkOiBcIiwgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlTG9nZ2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVMb2dnZXIuY2xvc2Vkb3duKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhYnN0cmFjdCBhc3luYyBoYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IFByb21pc2U8bnVtYmVyPjtcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGlzcGxheUhlbHAobG9nZ2VyOiBJTG9nZ2VyKTogbnVtYmVyO1xuXG4gICAgcHVibGljIGRpc3BsYXlBZGRpdGlvbmFsVmVyc2lvbihsb2dnZXI6IElMb2dnZXIpOiB2b2lkIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hlY2tSZW1haW5pbmcobG9nZ2VyOiBJTG9nZ2VyLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCByZW1haW5pbmcgPSBjb21tYW5kTGluZVBhcnNlci5nZXRSZW1haW5pbmcoKTtcbiAgICAgICAgaWYgKHJlbWFpbmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJVbnJlY29nbml6ZWQgYXJndW1lbnRzIG9uIHRoZSBjb21tYW5kIGxpbmVcIiwgdW5kZWZpbmVkLCB7IHJlbWFpbmluZyB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgY2hlY2tWZXJzaW9uKGxvZ2dlcjogSUxvZ2dlciwgY2xpZW50OiBXZWJTZWN1cmVDbGllbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgbGV0IGlzTmV3ZXIgPSBmYWxzZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3BhY2thZ2VOYW1lICYmIHRoaXMuX3BhY2thZ2VWZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgdHlwZSBSZWdpc3RyeVBhY2thZ2UgPSB7IHZlcnNpb246IHN0cmluZyB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlOiBSZWdpc3RyeVBhY2thZ2UgPVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuZ2V0SnNvbjxSZWdpc3RyeVBhY2thZ2U+KGBodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy8ke3RoaXMuX3BhY2thZ2VOYW1lfS9sYXRlc3QvYCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UudmVyc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHJlc3BvbnNlLnZlcnNpb24uc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UGFydHMgPSB0aGlzLl9wYWNrYWdlVmVyc2lvbi5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDMgJiYgY3VycmVudFBhcnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFqb3IgPSBwYXJzZUludChwYXJ0c1swXSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFqb3JDdXJyZW50ID0gcGFyc2VJbnQoY3VycmVudFBhcnRzWzBdLCAxMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYWpvciA+IG1ham9yQ3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTmV3ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYWpvciA9PT0gbWFqb3JDdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWlub3IgPSBwYXJzZUludChwYXJ0c1sxXSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pbm9yQ3VycmVudCA9IHBhcnNlSW50KGN1cnJlbnRQYXJ0c1sxXSwgMTApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbm9yID4gbWlub3JDdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTmV3ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWlub3IgPT09IG1pbm9yQ3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRjaCA9IHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoQ3VycmVudCA9IHBhcnNlSW50KGN1cnJlbnRQYXJ0c1syXSwgMTApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTmV3ZXIgPSBwYXRjaCA+IHBhdGNoQ3VycmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05ld2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm5pbmcoYEEgbmV3IHZlcnNpb24gdiR7cmVzcG9uc2UudmVyc2lvbn0gb2YgJHt0aGlzLl9wYWNrYWdlTmFtZX0gaXMgYXZhaWxhYmxlLmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuaW5nKGBZb3UgYXJlIGN1cnJlbnQgdXNpbmcgdmVyc2lvbiB2JHt0aGlzLl9wYWNrYWdlVmVyc2lvbn0uYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gV2Ugd2lsbCBpZ25vcmUgZXJyb3JzIGFzIHRoZSB2ZXJzaW9uIGNoZWNrIGRvZXNuJ3Qgd2FycmFudCBmYWlsaW5nIGFueXRoaW5nXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNOZXdlcjtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFya2Rvd25UYWJsZVRvQ2xpKGxvZ2dlcjogSUxvZ2dlciwgcm93OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHJvdyAhPT0gdW5kZWZpbmVkICYmIHJvdyAhPT0gbnVsbCAmJiByb3cubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgY29uc3QgbmV3Um93ID0gcm93LnN1YnN0cmluZygwLCByb3cubGVuZ3RoIC0gMSkudHJpbSgpLnJlcGxhY2UoL1xcfC9nLCBcIlwiKTtcbiAgICAgICAgICAgIGlmIChuZXdSb3dbMl0gPT09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAgICR7bmV3Um93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAtLSR7bmV3Um93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29tbWFuZChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0OiBudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBjb21tYW5kTGluZVBhcnNlci5nZXRDb21tYW5kKCk7XG5cbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XG4gICAgICAgICAgICBjYXNlIENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5WRVJTSU9OOiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gdGhpcy5jaGVja1JlbWFpbmluZyhsb2dnZXIsIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgIC8vIE5vdGhpbmcgZWxzZSB0byBkaXNwbGF5XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLkhFTFA6IHtcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLmNoZWNrUmVtYWluaW5nKGxvZ2dlciwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWxwKGxvZ2dlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5oYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlciwgZmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiTm8gY29tbWFuZCBzcGVjaWZpZWQgdHJ5IGhlbHBcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFVua25vd24gY29tbWFuZCAtICR7Y29tbWFuZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHRoaXMuY2hlY2tWZXJzaW9uKGxvZ2dlciwgbmV3IFdlYlNlY3VyZUNsaWVudCgpKTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZGlzcGxheUJhbm5lcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBpbmNsdWRlVGl0bGU6IGJvb2xlYW4sIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoaW5jbHVkZVRpdGxlKSB7XG4gICAgICAgICAgICBsb2dnZXIuYmFubmVyKGAke3RoaXMuX2FwcE5hbWV9IENMSWApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFja2FnZUpzb25EaXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGZpbGVTeXN0ZW0ucGF0aEdldERpcmVjdG9yeShgJHtjb21tYW5kTGluZVBhcnNlci5nZXRTY3JpcHQoKX0uanNgKSwgXCIuLi9cIik7XG4gICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKHBhY2thZ2VKc29uRGlyLCBcInBhY2thZ2UuanNvblwiKTtcbiAgICAgICAgaWYgKHBhY2thZ2VKc29uRXhpc3RzKSB7XG4gICAgICAgICAgICB0eXBlIFBhY2thZ2UgPSB7IG5hbWU6IHN0cmluZzsgdmVyc2lvbjogc3RyaW5nIH07XG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFBhY2thZ2U+KHBhY2thZ2VKc29uRGlyLCBcInBhY2thZ2UuanNvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3BhY2thZ2VOYW1lID0gcGFja2FnZUpzb24ubmFtZTtcbiAgICAgICAgICAgIHRoaXMuX3BhY2thZ2VWZXJzaW9uID0gcGFja2FnZUpzb24udmVyc2lvbjtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoYENMSSB2JHtwYWNrYWdlSnNvbi52ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheUFkZGl0aW9uYWxWZXJzaW9uKGxvZ2dlcik7XG4gICAgICAgIGlmIChpbmNsdWRlVGl0bGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoXCJcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
