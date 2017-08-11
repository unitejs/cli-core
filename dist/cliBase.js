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
                    const dirName = fileSystem.pathGetDirectory(logFile);
                    const dirExists = yield fileSystem.directoryExists(dirName);
                    if (!dirExists) {
                        yield fileSystem.directoryCreate(dirName);
                    }
                    loggers.push(new fileLogger_1.FileLogger(logFile));
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
                    console.log(`${logPrefix}An unhandled error occurred: `, err);
                }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFXLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ2xMLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUM3QyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDZixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQW5JRCwwQkFtSUMiLCJmaWxlIjoiY2xpQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbnRyeSBwb2ludC5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBBZ2dyZWdhdGVMb2dnZXIgfSBmcm9tIFwiLi9hZ2dyZWdhdGVMb2dnZXJcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29tbWFuZExpbmVBcmdDb25zdGFudHNcIjtcbmltcG9ydCB7IENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cyB9IGZyb20gXCIuL2NvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVQYXJzZXIgfSBmcm9tIFwiLi9jb21tYW5kTGluZVBhcnNlclwiO1xuaW1wb3J0IHsgRGlzcGxheUxvZ2dlciB9IGZyb20gXCIuL2Rpc3BsYXlMb2dnZXJcIjtcbmltcG9ydCB7IEZpbGVMb2dnZXIgfSBmcm9tIFwiLi9maWxlTG9nZ2VyXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSBcIi4vZmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ0xJQmFzZSB7XG4gICAgcHJpdmF0ZSBfYXBwTmFtZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoYXBwTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2FwcE5hbWUgPSBhcHBOYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBydW4ocHJvY2VzczogTm9kZUpTLlByb2Nlc3MpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgbG9nZ2VyOiBJTG9nZ2VyIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgbG9nUHJlZml4ID0gXCJcIjtcbiAgICAgICAgbGV0IHJldDogbnVtYmVyID0gMTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29tbWFuZExpbmVQYXJzZXIgPSBuZXcgQ29tbWFuZExpbmVQYXJzZXIoKTtcbiAgICAgICAgICAgIGNvbnN0IGJhZENvbW1hbmRzID0gY29tbWFuZExpbmVQYXJzZXIucGFyc2UocHJvY2VzcyA/IHByb2Nlc3MuYXJndiA6IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ2dlcnMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVTeXN0ZW0gPSBuZXcgRmlsZVN5c3RlbSgpO1xuXG4gICAgICAgICAgICBjb25zdCBub0NvbG9yID0gY29tbWFuZExpbmVQYXJzZXIuaGFzQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTk9fQ09MT1IpO1xuICAgICAgICAgICAgbG9nUHJlZml4ID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0U3RyaW5nQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTE9HX1BSRUZJWCk7XG4gICAgICAgICAgICBsb2dnZXJzLnB1c2gobmV3IERpc3BsYXlMb2dnZXIocHJvY2Vzcywgbm9Db2xvciwgbG9nUHJlZml4KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBjb21tYW5kTGluZVBhcnNlci5nZXRTdHJpbmdBcmd1bWVudChDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5MT0dfRklMRSk7XG4gICAgICAgICAgICBpZiAobG9nRmlsZSAhPT0gdW5kZWZpbmVkICYmIGxvZ0ZpbGUgIT09IG51bGwgJiYgbG9nRmlsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyTmFtZSA9IGZpbGVTeXN0ZW0ucGF0aEdldERpcmVjdG9yeShsb2dGaWxlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUV4aXN0cyhkaXJOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRpckV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUNyZWF0ZShkaXJOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbG9nZ2Vycy5wdXNoKG5ldyBGaWxlTG9nZ2VyKGxvZ0ZpbGUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nZ2VyID0gbmV3IEFnZ3JlZ2F0ZUxvZ2dlcihsb2dnZXJzKTtcblxuICAgICAgICAgICAgaWYgKGNvbW1hbmRMaW5lUGFyc2VyLmdldEludGVycHJldGVyKCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlRoZSBjb21tYW5kIGxpbmUgY29udGFpbmVkIG5vIGludGVycHJldGVyXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kTGluZVBhcnNlci5nZXRTY3JpcHQoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGNvbW1hbmQgbGluZSBjb250YWluZWQgbm8gc2NyaXB0XCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWRDb21tYW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVGhlIGZvbGxvd2luZyBhcmd1bWVudHMgYXJlIGJhZGx5IGZvcm1lZFwiLCBiYWRDb21tYW5kcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVmVyc2lvbkNvbW1hbmQgPSBjb21tYW5kTGluZVBhcnNlci5nZXRDb21tYW5kKCkgPT09IENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5WRVJTSU9OO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGlzcGxheUJhbm5lcihsb2dnZXIsIGZpbGVTeXN0ZW0sICFpc1ZlcnNpb25Db21tYW5kLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzVmVyc2lvbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLk5PX0NPTE9SLCB7IHZhbHVlIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dGaWxlICE9PSB1bmRlZmluZWQgJiYgbG9nRmlsZSAhPT0gbnVsbCAmJiBsb2dGaWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkxPR19GSUxFLCB7IGxvZ0ZpbGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmhhbmRsZUNvbW1hbmQobG9nZ2VyLCBmaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGxvZ2dlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiVW5oYW5kbGVkIEV4Y2VwdGlvblwiLCBlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2xvZ1ByZWZpeH1BbiB1bmhhbmRsZWQgZXJyb3Igb2NjdXJyZWQ6IGAsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhYnN0cmFjdCBhc3luYyBoYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IFByb21pc2U8bnVtYmVyPjtcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGlzcGxheUhlbHAobG9nZ2VyOiBJTG9nZ2VyKTogbnVtYmVyO1xuXG4gICAgcHJvdGVjdGVkIG1hcmtkb3duVGFibGVUb0NsaShsb2dnZXI6IElMb2dnZXIsIHJvdzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChyb3cgIT09IHVuZGVmaW5lZCAmJiByb3cgIT09IG51bGwgJiYgcm93Lmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIHJvdyA9IHJvdy5zdWJzdHJpbmcoMCwgcm93Lmxlbmd0aCAtIDEpLnRyaW0oKS5yZXBsYWNlKC9cXHwvZywgXCJcIik7XG4gICAgICAgICAgICBpZiAocm93WzJdID09PSBcIiBcIikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgICAke3Jvdy5zdWJzdHJpbmcoMSl9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgLS0ke3Jvdy5zdWJzdHJpbmcoMSl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZUNvbW1hbmQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldDogbnVtYmVyID0gMDtcblxuICAgICAgICBjb25zdCBjb21tYW5kID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Q29tbWFuZCgpO1xuXG4gICAgICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgICAgICAgY2FzZSBDb21tYW5kTGluZUNvbW1hbmRDb25zdGFudHMuVkVSU0lPTjoge1xuICAgICAgICAgICAgICAgIC8vIE5vdGhpbmcgZWxzZSB0byBkaXNwbGF5XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLkhFTFA6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWxwKGxvZ2dlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmhhbmRsZUN1c3RvbUNvbW1hbmQobG9nZ2VyLCBmaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcik7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJObyBjb21tYW5kIHNwZWNpZmllZCB0cnkgaGVscFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgVW5rbm93biBjb21tYW5kIC0gJHtjb21tYW5kfWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGRpc3BsYXlCYW5uZXIobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgaW5jbHVkZVRpdGxlOiBib29sZWFuLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGluY2x1ZGVUaXRsZSkge1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihgJHt0aGlzLl9hcHBOYW1lfSBDTElgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGlyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShmaWxlU3lzdGVtLnBhdGhHZXREaXJlY3RvcnkoY29tbWFuZExpbmVQYXJzZXIuZ2V0U2NyaXB0KCkpLCBcIi4uL1wiKTtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb25FeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMocGFja2FnZUpzb25EaXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICBpZiAocGFja2FnZUpzb25FeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyB2ZXJzaW9uOiBzdHJpbmcgfT4oZmlsZVN5c3RlbS5wYXRoQ29tYmluZShmaWxlU3lzdGVtLnBhdGhHZXREaXJlY3RvcnkoY29tbWFuZExpbmVQYXJzZXIuZ2V0U2NyaXB0KCkpLCBcIi4uL1wiKSwgXCJwYWNrYWdlLmpzb25cIik7XG4gICAgICAgICAgICBsb2dnZXIuYmFubmVyKGB2JHtwYWNrYWdlSnNvbi52ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmNsdWRlVGl0bGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5iYW5uZXIoXCJcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
