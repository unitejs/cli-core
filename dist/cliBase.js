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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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TSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUFsS0QsMEJBa0tDIiwiZmlsZSI6ImNsaUJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1haW4gZW50cnkgcG9pbnQuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRGVmYXVsdExvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2xvZ2dlcnMvZGVmYXVsdExvZ2dlclwiO1xuaW1wb3J0IHsgQWdncmVnYXRlTG9nZ2VyIH0gZnJvbSBcIi4vYWdncmVnYXRlTG9nZ2VyXCI7XG5pbXBvcnQgeyBDb21tYW5kTGluZUFyZ0NvbnN0YW50cyB9IGZyb20gXCIuL2NvbW1hbmRMaW5lQXJnQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHMgfSBmcm9tIFwiLi9jb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHNcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lUGFyc2VyIH0gZnJvbSBcIi4vY29tbWFuZExpbmVQYXJzZXJcIjtcbmltcG9ydCB7IERpc3BsYXlMb2dnZXIgfSBmcm9tIFwiLi9kaXNwbGF5TG9nZ2VyXCI7XG5pbXBvcnQgeyBGaWxlTG9nZ2VyIH0gZnJvbSBcIi4vZmlsZUxvZ2dlclwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbSB9IGZyb20gXCIuL2ZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENMSUJhc2Uge1xuICAgIHByaXZhdGUgX2FwcE5hbWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGFwcE5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9hcHBOYW1lID0gYXBwTmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bihwcm9jZXNzOiBOb2RlSlMuUHJvY2Vzcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBsb2dnZXI6IElMb2dnZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBmaWxlTG9nZ2VyOiBGaWxlTG9nZ2VyIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcmV0OiBudW1iZXI7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRMaW5lUGFyc2VyID0gbmV3IENvbW1hbmRMaW5lUGFyc2VyKCk7XG4gICAgICAgICAgICBjb25zdCBiYWRDb21tYW5kcyA9IGNvbW1hbmRMaW5lUGFyc2VyLnBhcnNlKHByb2Nlc3MgPyBwcm9jZXNzLmFyZ3YgOiB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBjb25zdCBsb2dnZXJzID0gW107XG4gICAgICAgICAgICBjb25zdCBmaWxlU3lzdGVtID0gbmV3IEZpbGVTeXN0ZW0oKTtcblxuICAgICAgICAgICAgY29uc3Qgbm9Db2xvciA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldEJvb2xlYW5Bcmd1bWVudChDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5OT19DT0xPUik7XG4gICAgICAgICAgICBsb2dnZXJzLnB1c2gobmV3IERpc3BsYXlMb2dnZXIocHJvY2Vzcywgbm9Db2xvcikpO1xuXG4gICAgICAgICAgICBjb25zdCBsb2dGaWxlID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0U3RyaW5nQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTE9HX0ZJTEUpO1xuICAgICAgICAgICAgaWYgKGxvZ0ZpbGUgIT09IHVuZGVmaW5lZCAmJiBsb2dGaWxlICE9PSBudWxsICYmIGxvZ0ZpbGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZpbGVMb2dnZXIgPSBuZXcgRmlsZUxvZ2dlcihsb2dGaWxlLCBmaWxlU3lzdGVtKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlTG9nZ2VyLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgICAgICBsb2dnZXJzLnB1c2goZmlsZUxvZ2dlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvZ2dlciA9IG5ldyBBZ2dyZWdhdGVMb2dnZXIobG9nZ2Vycyk7XG5cbiAgICAgICAgICAgIGlmIChjb21tYW5kTGluZVBhcnNlci5nZXRJbnRlcnByZXRlcigpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJUaGUgY29tbWFuZCBsaW5lIGNvbnRhaW5lZCBubyBpbnRlcnByZXRlclwiKTtcbiAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kTGluZVBhcnNlci5nZXRTY3JpcHQoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGNvbW1hbmQgbGluZSBjb250YWluZWQgbm8gc2NyaXB0XCIpO1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhZENvbW1hbmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJUaGUgZm9sbG93aW5nIGFyZ3VtZW50cyBhcmUgYmFkbHkgZm9ybWVkXCIsIGJhZENvbW1hbmRzKTtcbiAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmluaXRpYWxpc2UobG9nZ2VyLCBmaWxlU3lzdGVtKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNWZXJzaW9uQ29tbWFuZCA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldENvbW1hbmQoKSA9PT0gQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLlZFUlNJT047XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGlzcGxheUJhbm5lcihsb2dnZXIsIGZpbGVTeXN0ZW0sICFpc1ZlcnNpb25Db21tYW5kLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZlcnNpb25Db21tYW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9Db2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5OT19DT0xPUiwgeyB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dGaWxlICE9PSB1bmRlZmluZWQgJiYgbG9nRmlsZSAhPT0gbnVsbCAmJiBsb2dGaWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5MT0dfRklMRSwgeyBsb2dGaWxlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5oYW5kbGVDb21tYW5kKGxvZ2dlciwgZmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgaWYgKGxvZ2dlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVW5oYW5kbGVkIEV4Y2VwdGlvblwiLCBlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBEZWZhdWx0TG9nZ2VyLmxvZyhcIkFuIGVycm9yIG9jY3VycmVkOiBcIiwgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlTG9nZ2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVMb2dnZXIuY2xvc2Vkb3duKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhYnN0cmFjdCBhc3luYyBoYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IFByb21pc2U8bnVtYmVyPjtcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGlzcGxheUhlbHAobG9nZ2VyOiBJTG9nZ2VyKTogbnVtYmVyO1xuXG4gICAgcHVibGljIGRpc3BsYXlBZGRpdGlvbmFsVmVyc2lvbihsb2dnZXI6IElMb2dnZXIpOiB2b2lkIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hlY2tSZW1haW5pbmcobG9nZ2VyOiBJTG9nZ2VyLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCByZW1haW5pbmcgPSBjb21tYW5kTGluZVBhcnNlci5nZXRSZW1haW5pbmcoKTtcbiAgICAgICAgaWYgKHJlbWFpbmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJVbnJlY29nbml6ZWQgYXJndW1lbnRzIG9uIHRoZSBjb21tYW5kIGxpbmVcIiwgdW5kZWZpbmVkLCB7IHJlbWFpbmluZyB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFya2Rvd25UYWJsZVRvQ2xpKGxvZ2dlcjogSUxvZ2dlciwgcm93OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHJvdyAhPT0gdW5kZWZpbmVkICYmIHJvdyAhPT0gbnVsbCAmJiByb3cubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgY29uc3QgbmV3Um93ID0gcm93LnN1YnN0cmluZygwLCByb3cubGVuZ3RoIC0gMSkudHJpbSgpLnJlcGxhY2UoL1xcfC9nLCBcIlwiKTtcbiAgICAgICAgICAgIGlmIChuZXdSb3dbMl0gPT09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAgICR7bmV3Um93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAtLSR7bmV3Um93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29tbWFuZChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0OiBudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBjb21tYW5kTGluZVBhcnNlci5nZXRDb21tYW5kKCk7XG5cbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XG4gICAgICAgICAgICBjYXNlIENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5WRVJTSU9OOiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gdGhpcy5jaGVja1JlbWFpbmluZyhsb2dnZXIsIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgIC8vIE5vdGhpbmcgZWxzZSB0byBkaXNwbGF5XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLkhFTFA6IHtcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLmNoZWNrUmVtYWluaW5nKGxvZ2dlciwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWxwKGxvZ2dlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5oYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlciwgZmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiTm8gY29tbWFuZCBzcGVjaWZpZWQgdHJ5IGhlbHBcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFVua25vd24gY29tbWFuZCAtICR7Y29tbWFuZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBkaXNwbGF5QmFubmVyKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGluY2x1ZGVUaXRsZTogYm9vbGVhbiwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChpbmNsdWRlVGl0bGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoYCR7dGhpcy5fYXBwTmFtZX0gQ0xJYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRpciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZmlsZVN5c3RlbS5wYXRoR2V0RGlyZWN0b3J5KGAke2NvbW1hbmRMaW5lUGFyc2VyLmdldFNjcmlwdCgpfS5qc2ApLCBcIi4uL1wiKTtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb25FeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICBpZiAocGFja2FnZUpzb25FeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyB2ZXJzaW9uOiBzdHJpbmcgfT4ocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihgQ0xJIHYke3BhY2thZ2VKc29uLnZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5QWRkaXRpb25hbFZlcnNpb24obG9nZ2VyKTtcbiAgICAgICAgaWYgKGluY2x1ZGVUaXRsZSkge1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihcIlwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
