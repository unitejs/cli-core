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
    run(process) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger;
            let fileLogger;
            let ret = 1;
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
                }
                else if (commandLineParser.getScript() === undefined) {
                    logger.error("The command line contained no script");
                }
                else if (badCommands.length > 0) {
                    logger.error("The following arguments are badly formed", badCommands);
                }
                else {
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
            catch (err) {
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
                logger.info(` --${row.substring(1)}`);
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
                logger.banner(`v${packageJson.version}`);
            }
            if (includeTitle) {
                logger.banner("");
            }
        });
    }
}
exports.CLIBase = CLIBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUM7Z0JBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFFRCxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN6SCxNQUFNLGlCQUFpQixHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDdEYsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLFdBQVcsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQXNCLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDdkcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBbEpELDBCQWtKQyIsImZpbGUiOiJjbGlCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVudHJ5IHBvaW50LlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IERlZmF1bHRMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9sb2dnZXJzL2RlZmF1bHRMb2dnZXJcIjtcbmltcG9ydCB7IEFnZ3JlZ2F0ZUxvZ2dlciB9IGZyb20gXCIuL2FnZ3JlZ2F0ZUxvZ2dlclwiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVBcmdDb25zdGFudHMgfSBmcm9tIFwiLi9jb21tYW5kTGluZUFyZ0NvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDb21tYW5kTGluZVBhcnNlciB9IGZyb20gXCIuL2NvbW1hbmRMaW5lUGFyc2VyXCI7XG5pbXBvcnQgeyBEaXNwbGF5TG9nZ2VyIH0gZnJvbSBcIi4vZGlzcGxheUxvZ2dlclwiO1xuaW1wb3J0IHsgRmlsZUxvZ2dlciB9IGZyb20gXCIuL2ZpbGVMb2dnZXJcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tIFwiLi9maWxlU3lzdGVtXCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDTElCYXNlIHtcbiAgICBwcml2YXRlIF9hcHBOYW1lOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fYXBwTmFtZSA9IGFwcE5hbWU7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bihwcm9jZXNzOiBOb2RlSlMuUHJvY2Vzcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBsb2dnZXI6IElMb2dnZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBmaWxlTG9nZ2VyOiBGaWxlTG9nZ2VyIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcmV0OiBudW1iZXIgPSAxO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb21tYW5kTGluZVBhcnNlciA9IG5ldyBDb21tYW5kTGluZVBhcnNlcigpO1xuICAgICAgICAgICAgY29uc3QgYmFkQ29tbWFuZHMgPSBjb21tYW5kTGluZVBhcnNlci5wYXJzZShwcm9jZXNzID8gcHJvY2Vzcy5hcmd2IDogdW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgY29uc3QgbG9nZ2VycyA9IFtdO1xuICAgICAgICAgICAgY29uc3QgZmlsZVN5c3RlbSA9IG5ldyBGaWxlU3lzdGVtKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5vQ29sb3IgPSBjb21tYW5kTGluZVBhcnNlci5nZXRCb29sZWFuQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTk9fQ09MT1IpO1xuICAgICAgICAgICAgbG9nZ2Vycy5wdXNoKG5ldyBEaXNwbGF5TG9nZ2VyKHByb2Nlc3MsIG5vQ29sb3IpKTtcblxuICAgICAgICAgICAgY29uc3QgbG9nRmlsZSA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldFN0cmluZ0FyZ3VtZW50KENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkxPR19GSUxFKTtcbiAgICAgICAgICAgIGlmIChsb2dGaWxlICE9PSB1bmRlZmluZWQgJiYgbG9nRmlsZSAhPT0gbnVsbCAmJiBsb2dGaWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmaWxlTG9nZ2VyID0gbmV3IEZpbGVMb2dnZXIobG9nRmlsZSwgZmlsZVN5c3RlbSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZUxvZ2dlci5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICAgICAgbG9nZ2Vycy5wdXNoKGZpbGVMb2dnZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2dnZXIgPSBuZXcgQWdncmVnYXRlTG9nZ2VyKGxvZ2dlcnMpO1xuXG4gICAgICAgICAgICBpZiAoY29tbWFuZExpbmVQYXJzZXIuZ2V0SW50ZXJwcmV0ZXIoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGNvbW1hbmQgbGluZSBjb250YWluZWQgbm8gaW50ZXJwcmV0ZXJcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmRMaW5lUGFyc2VyLmdldFNjcmlwdCgpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJUaGUgY29tbWFuZCBsaW5lIGNvbnRhaW5lZCBubyBzY3JpcHRcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhZENvbW1hbmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJUaGUgZm9sbG93aW5nIGFyZ3VtZW50cyBhcmUgYmFkbHkgZm9ybWVkXCIsIGJhZENvbW1hbmRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNWZXJzaW9uQ29tbWFuZCA9IGNvbW1hbmRMaW5lUGFyc2VyLmdldENvbW1hbmQoKSA9PT0gQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLlZFUlNJT047XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXNwbGF5QmFubmVyKGxvZ2dlciwgZmlsZVN5c3RlbSwgIWlzVmVyc2lvbkNvbW1hbmQsIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgIGlmICghaXNWZXJzaW9uQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9Db2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTk9fQ09MT1IsIHsgdmFsdWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ0ZpbGUgIT09IHVuZGVmaW5lZCAmJiBsb2dGaWxlICE9PSBudWxsICYmIGxvZ0ZpbGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTE9HX0ZJTEUsIHsgbG9nRmlsZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuaGFuZGxlQ29tbWFuZChsb2dnZXIsIGZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAobG9nZ2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJVbmhhbmRsZWQgRXhjZXB0aW9uXCIsIGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIERlZmF1bHRMb2dnZXIubG9nKFwiQW4gZXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbGVMb2dnZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYXdhaXQgZmlsZUxvZ2dlci5jbG9zZWRvd24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFic3RyYWN0IGFzeW5jIGhhbmRsZUN1c3RvbUNvbW1hbmQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTxudW1iZXI+O1xuICAgIHB1YmxpYyBhYnN0cmFjdCBkaXNwbGF5SGVscChsb2dnZXI6IElMb2dnZXIpOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgY2hlY2tSZW1haW5pbmcobG9nZ2VyOiBJTG9nZ2VyLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCByZW1haW5pbmcgPSBjb21tYW5kTGluZVBhcnNlci5nZXRSZW1haW5pbmcoKTtcbiAgICAgICAgaWYgKHJlbWFpbmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJVbnJlY29nbml6ZWQgYXJndW1lbnRzIG9uIHRoZSBjb21tYW5kIGxpbmVcIiwgdW5kZWZpbmVkLCB7IHJlbWFpbmluZyB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFya2Rvd25UYWJsZVRvQ2xpKGxvZ2dlcjogSUxvZ2dlciwgcm93OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHJvdyAhPT0gdW5kZWZpbmVkICYmIHJvdyAhPT0gbnVsbCAmJiByb3cubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgY29uc3QgbmV3Um93ID0gcm93LnN1YnN0cmluZygwLCByb3cubGVuZ3RoIC0gMSkudHJpbSgpLnJlcGxhY2UoL1xcfC9nLCBcIlwiKTtcbiAgICAgICAgICAgIGlmIChuZXdSb3dbMl0gPT09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAgICR7bmV3Um93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAtLSR7cm93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29tbWFuZChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0OiBudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBjb21tYW5kTGluZVBhcnNlci5nZXRDb21tYW5kKCk7XG5cbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XG4gICAgICAgICAgICBjYXNlIENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5WRVJTSU9OOiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gdGhpcy5jaGVja1JlbWFpbmluZyhsb2dnZXIsIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICAgICAgICAgIC8vIE5vdGhpbmcgZWxzZSB0byBkaXNwbGF5XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLkhFTFA6IHtcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLmNoZWNrUmVtYWluaW5nKGxvZ2dlciwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWxwKGxvZ2dlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5oYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlciwgZmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiTm8gY29tbWFuZCBzcGVjaWZpZWQgdHJ5IGhlbHBcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFVua25vd24gY29tbWFuZCAtICR7Y29tbWFuZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBkaXNwbGF5QmFubmVyKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGluY2x1ZGVUaXRsZTogYm9vbGVhbiwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChpbmNsdWRlVGl0bGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoYCR7dGhpcy5fYXBwTmFtZX0gQ0xJYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRpciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZmlsZVN5c3RlbS5wYXRoR2V0RGlyZWN0b3J5KGAke2NvbW1hbmRMaW5lUGFyc2VyLmdldFNjcmlwdCgpfS5qc2ApLCBcIi4uL1wiKTtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb25FeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICBpZiAocGFja2FnZUpzb25FeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyB2ZXJzaW9uOiBzdHJpbmcgfT4ocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihgdiR7cGFja2FnZUpzb24udmVyc2lvbn1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5jbHVkZVRpdGxlKSB7XG4gICAgICAgICAgICBsb2dnZXIuYmFubmVyKFwiXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
