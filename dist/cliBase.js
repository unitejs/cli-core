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
            let logPrefix = "";
            let ret = 1;
            try {
                const commandLineParser = new commandLineParser_1.CommandLineParser();
                const badCommands = commandLineParser.parse(process ? process.argv : undefined);
                const loggers = [];
                const fileSystem = new fileSystem_1.FileSystem();
                const noColor = commandLineParser.hasArgument(commandLineArgConstants_1.CommandLineArgConstants.NO_COLOR);
                logPrefix = commandLineParser.getStringArgument(commandLineArgConstants_1.CommandLineArgConstants.LOG_PREFIX);
                loggers.push(new displayLogger_1.DisplayLogger(process, noColor, logPrefix));
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
                    // tslint:disable-next-line:no-console
                    console.log(`${logPrefix}An error occurred: `, err);
                }
            }
            if (fileLogger !== undefined) {
                yield fileLogger.closedown();
            }
            return ret;
        });
    }
    markdownTableToCli(logger, row) {
        if (row !== undefined && row !== null && row.length > 2) {
            row = row.substring(0, row.length - 1).trim().replace(/\|/g, "");
            if (row[2] === " ") {
                logger.info(`   ${row.substring(1)}`);
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
                    // Nothing else to display
                    break;
                }
                case commandLineCommandConstants_1.CommandLineCommandConstants.HELP: {
                    this.displayHelp(logger);
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
            const packageJsonDir = fileSystem.pathCombine(fileSystem.pathGetDirectory(commandLineParser.getScript()), "../");
            const packageJsonExists = yield fileSystem.fileExists(packageJsonDir, "package.json");
            if (packageJsonExists) {
                const packageJson = yield fileSystem.fileReadJson(fileSystem.pathCombine(fileSystem.pathGetDirectory(commandLineParser.getScript()), "../"), "package.json");
                logger.banner(`v${packageJson.version}`);
            }
            if (includeTitle) {
                logger.banner("");
            }
        });
    }
}
exports.CLIBase = CLIBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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aUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDbEwsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBcklELDBCQXFJQyIsImZpbGUiOiJjbGlCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVudHJ5IHBvaW50LlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEFnZ3JlZ2F0ZUxvZ2dlciB9IGZyb20gXCIuL2FnZ3JlZ2F0ZUxvZ2dlclwiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVBcmdDb25zdGFudHMgfSBmcm9tIFwiLi9jb21tYW5kTGluZUFyZ0NvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDb21tYW5kTGluZVBhcnNlciB9IGZyb20gXCIuL2NvbW1hbmRMaW5lUGFyc2VyXCI7XG5pbXBvcnQgeyBEaXNwbGF5TG9nZ2VyIH0gZnJvbSBcIi4vZGlzcGxheUxvZ2dlclwiO1xuaW1wb3J0IHsgRmlsZUxvZ2dlciB9IGZyb20gXCIuL2ZpbGVMb2dnZXJcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tIFwiLi9maWxlU3lzdGVtXCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDTElCYXNlIHtcbiAgICBwcml2YXRlIF9hcHBOYW1lOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fYXBwTmFtZSA9IGFwcE5hbWU7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bihwcm9jZXNzOiBOb2RlSlMuUHJvY2Vzcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBsb2dnZXI6IElMb2dnZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBmaWxlTG9nZ2VyOiBGaWxlTG9nZ2VyIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgbG9nUHJlZml4ID0gXCJcIjtcbiAgICAgICAgbGV0IHJldDogbnVtYmVyID0gMTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29tbWFuZExpbmVQYXJzZXIgPSBuZXcgQ29tbWFuZExpbmVQYXJzZXIoKTtcbiAgICAgICAgICAgIGNvbnN0IGJhZENvbW1hbmRzID0gY29tbWFuZExpbmVQYXJzZXIucGFyc2UocHJvY2VzcyA/IHByb2Nlc3MuYXJndiA6IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ2dlcnMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVTeXN0ZW0gPSBuZXcgRmlsZVN5c3RlbSgpO1xuXG4gICAgICAgICAgICBjb25zdCBub0NvbG9yID0gY29tbWFuZExpbmVQYXJzZXIuaGFzQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTk9fQ09MT1IpO1xuICAgICAgICAgICAgbG9nUHJlZml4ID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0U3RyaW5nQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTE9HX1BSRUZJWCk7XG4gICAgICAgICAgICBsb2dnZXJzLnB1c2gobmV3IERpc3BsYXlMb2dnZXIocHJvY2Vzcywgbm9Db2xvciwgbG9nUHJlZml4KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBjb21tYW5kTGluZVBhcnNlci5nZXRTdHJpbmdBcmd1bWVudChDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5MT0dfRklMRSk7XG4gICAgICAgICAgICBpZiAobG9nRmlsZSAhPT0gdW5kZWZpbmVkICYmIGxvZ0ZpbGUgIT09IG51bGwgJiYgbG9nRmlsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZmlsZUxvZ2dlciA9IG5ldyBGaWxlTG9nZ2VyKGxvZ0ZpbGUsIGZpbGVTeXN0ZW0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVMb2dnZXIuaW5pdGlhbGlzZSgpO1xuICAgICAgICAgICAgICAgIGxvZ2dlcnMucHVzaChmaWxlTG9nZ2VyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyID0gbmV3IEFnZ3JlZ2F0ZUxvZ2dlcihsb2dnZXJzKTtcblxuICAgICAgICAgICAgaWYgKGNvbW1hbmRMaW5lUGFyc2VyLmdldEludGVycHJldGVyKCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlRoZSBjb21tYW5kIGxpbmUgY29udGFpbmVkIG5vIGludGVycHJldGVyXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kTGluZVBhcnNlci5nZXRTY3JpcHQoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGNvbW1hbmQgbGluZSBjb250YWluZWQgbm8gc2NyaXB0XCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWRDb21tYW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGZvbGxvd2luZyBhcmd1bWVudHMgYXJlIGJhZGx5IGZvcm1lZFwiLCBiYWRDb21tYW5kcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVmVyc2lvbkNvbW1hbmQgPSBjb21tYW5kTGluZVBhcnNlci5nZXRDb21tYW5kKCkgPT09IENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5WRVJTSU9OO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGlzcGxheUJhbm5lcihsb2dnZXIsIGZpbGVTeXN0ZW0sICFpc1ZlcnNpb25Db21tYW5kLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzVmVyc2lvbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLk5PX0NPTE9SLCB7IHZhbHVlIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dGaWxlICE9PSB1bmRlZmluZWQgJiYgbG9nRmlsZSAhPT0gbnVsbCAmJiBsb2dGaWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkxPR19GSUxFLCB7IGxvZ0ZpbGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmhhbmRsZUNvbW1hbmQobG9nZ2VyLCBmaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGxvZ2dlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVW5oYW5kbGVkIEV4Y2VwdGlvblwiLCBlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2xvZ1ByZWZpeH1BbiBlcnJvciBvY2N1cnJlZDogYCwgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlTG9nZ2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVMb2dnZXIuY2xvc2Vkb3duKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhYnN0cmFjdCBhc3luYyBoYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IFByb21pc2U8bnVtYmVyPjtcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGlzcGxheUhlbHAobG9nZ2VyOiBJTG9nZ2VyKTogbnVtYmVyO1xuXG4gICAgcHJvdGVjdGVkIG1hcmtkb3duVGFibGVUb0NsaShsb2dnZXI6IElMb2dnZXIsIHJvdzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChyb3cgIT09IHVuZGVmaW5lZCAmJiByb3cgIT09IG51bGwgJiYgcm93Lmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIHJvdyA9IHJvdy5zdWJzdHJpbmcoMCwgcm93Lmxlbmd0aCAtIDEpLnRyaW0oKS5yZXBsYWNlKC9cXHwvZywgXCJcIik7XG4gICAgICAgICAgICBpZiAocm93WzJdID09PSBcIiBcIikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgICAke3Jvdy5zdWJzdHJpbmcoMSl9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgLS0ke3Jvdy5zdWJzdHJpbmcoMSl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZUNvbW1hbmQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldDogbnVtYmVyID0gMDtcblxuICAgICAgICBjb25zdCBjb21tYW5kID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Q29tbWFuZCgpO1xuXG4gICAgICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgICAgICAgY2FzZSBDb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHMuVkVSU0lPTjoge1xuICAgICAgICAgICAgICAgIC8vIE5vdGhpbmcgZWxzZSB0byBkaXNwbGF5XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLkhFTFA6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWxwKGxvZ2dlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmhhbmRsZUN1c3RvbUNvbW1hbmQobG9nZ2VyLCBmaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJObyBjb21tYW5kIHNwZWNpZmllZCB0cnkgaGVscFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgVW5rbm93biBjb21tYW5kIC0gJHtjb21tYW5kfWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGRpc3BsYXlCYW5uZXIobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgaW5jbHVkZVRpdGxlOiBib29sZWFuLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGluY2x1ZGVUaXRsZSkge1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihgJHt0aGlzLl9hcHBOYW1lfSBDTElgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGlyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShmaWxlU3lzdGVtLnBhdGhHZXREaXJlY3RvcnkoY29tbWFuZExpbmVQYXJzZXIuZ2V0U2NyaXB0KCkpLCBcIi4uL1wiKTtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb25FeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICBpZiAocGFja2FnZUpzb25FeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyB2ZXJzaW9uOiBzdHJpbmcgfT4oZmlsZVN5c3RlbS5wYXRoQ29tYmluZShmaWxlU3lzdGVtLnBhdGhHZXREaXJlY3RvcnkoY29tbWFuZExpbmVQYXJzZXIuZ2V0U2NyaXB0KCkpLCBcIi4uL1wiKSwgXCJwYWNrYWdlLmpzb25cIik7XG4gICAgICAgICAgICBsb2dnZXIuYmFubmVyKGB2JHtwYWNrYWdlSnNvbi52ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmNsdWRlVGl0bGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoXCJcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
