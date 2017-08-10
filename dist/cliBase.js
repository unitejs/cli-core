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
            let ret;
            try {
                const commandLineParser = new commandLineParser_1.CommandLineParser();
                commandLineParser.parse(process.argv);
                const loggers = [];
                loggers.push(new displayLogger_1.DisplayLogger(process, commandLineParser.hasArgument(commandLineArgConstants_1.CommandLineArgConstants.NO_COLOR)));
                const logFile = commandLineParser.getStringArgument(commandLineArgConstants_1.CommandLineArgConstants.LOG_FILE);
                if (logFile !== undefined && logFile !== null && logFile.length > 0) {
                    loggers.push(new fileLogger_1.FileLogger(logFile));
                }
                logger = new aggregateLogger_1.AggregateLogger(loggers);
                ret = yield this.handleCommand(logger, new fileSystem_1.FileSystem(), commandLineParser);
            }
            catch (err) {
                ret = 1;
                if (logger !== undefined) {
                    logger.error("Unhandled Exception", err);
                }
                else {
                    // tslint:disable-next-line:no-console
                    console.log("An unhandled error occurred: ", err);
                }
            }
            return ret;
        });
    }
    markdownTableToCli(logger, row) {
        if (row.length > 2) {
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
            yield this.displayBanner(logger, fileSystem, commandLineParser.getCommand() !== commandLineCommandConstants_1.CommandLineCommandConstants.VERSION, commandLineParser);
            const command = commandLineParser.getCommand();
            const noColor = commandLineParser.hasArgument(commandLineArgConstants_1.CommandLineArgConstants.NO_COLOR);
            if (noColor) {
                const value = true;
                logger.info(commandLineArgConstants_1.CommandLineArgConstants.NO_COLOR, { value });
            }
            if (commandLineParser.hasArgument(commandLineArgConstants_1.CommandLineArgConstants.LOG_FILE)) {
                const value = commandLineParser.getArgument(commandLineArgConstants_1.CommandLineArgConstants.LOG_FILE);
                logger.info(commandLineArgConstants_1.CommandLineArgConstants.LOG_FILE, { value });
            }
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
                    }
                }
            }
            return ret;
        });
    }
    displayBanner(logger, fileSystem, includeTitle, commandLineParser) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageJson = yield fileSystem.fileReadJson(fileSystem.pathCombine(fileSystem.pathGetDirectory(commandLineParser.getScript()), "../"), "package.json");
            if (includeTitle) {
                logger.banner(`${this._appName} CLI`);
            }
            logger.banner(packageJson && packageJson.version ? `v${packageJson.version}` : " Unknown Version");
            if (includeTitle) {
                logger.banner("");
            }
        });
    }
}
exports.CLIBase = CLIBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGlCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSx1REFBb0Q7QUFDcEQsdUVBQW9FO0FBQ3BFLCtFQUE0RTtBQUM1RSwyREFBd0Q7QUFDeEQsbURBQWdEO0FBQ2hELDZDQUEwQztBQUMxQyw2Q0FBMEM7QUFFMUM7SUFHSSxZQUFZLE9BQWU7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVZLEdBQUcsQ0FBQyxPQUF1Qjs7WUFDcEMsSUFBSSxNQUEyQixDQUFDO1lBQ2hDLElBQUksR0FBVyxDQUFDO1lBRWhCLElBQUksQ0FBQztnQkFDRCxNQUFNLGlCQUFpQixHQUFHLElBQUkscUNBQWlCLEVBQUUsQ0FBQztnQkFDbEQsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFdEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUVuQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksNkJBQWEsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsV0FBVyxDQUFDLGlEQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFMUcsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsaURBQXVCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLENBQUM7Z0JBRUQsTUFBTSxHQUFHLElBQUksaUNBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdEMsR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSx1QkFBVSxFQUFFLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUNoRixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNSLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLHNDQUFzQztvQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdEQsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBS1Msa0JBQWtCLENBQUMsTUFBZSxFQUFFLEdBQVc7UUFDckQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVhLGFBQWEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxpQkFBb0M7O1lBQ3RHLElBQUksR0FBRyxHQUFXLENBQUMsQ0FBQztZQUVwQixNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsS0FBSyx5REFBMkIsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUV4SSxNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUMvQyxNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsaURBQXVCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEYsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsaURBQXVCLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLGlEQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsV0FBVyxDQUFDLGlEQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGlEQUF1QixDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFFLENBQUM7WUFDOUQsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsS0FBSyx5REFBMkIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDdkMsMEJBQTBCO29CQUMxQixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFFRCxLQUFLLHlEQUEyQixDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN6QixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFFRCxTQUFTLENBQUM7b0JBQ04sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztvQkFFNUUsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1YsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7NEJBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQzt3QkFDbEQsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixPQUFPLEVBQUUsQ0FBQyxDQUFDO3dCQUNqRCxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRWEsYUFBYSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLFlBQXFCLEVBQUUsaUJBQW9DOztZQUM3SCxNQUFNLFdBQVcsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQXFCLFVBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDakwsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDZixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsTUFBTSxDQUFDLENBQUM7WUFDMUMsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFLEdBQUcsa0JBQWtCLENBQUMsQ0FBQztZQUNuRyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBMUdELDBCQTBHQyIsImZpbGUiOiJjbGlCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVudHJ5IHBvaW50LlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEFnZ3JlZ2F0ZUxvZ2dlciB9IGZyb20gXCIuL2FnZ3JlZ2F0ZUxvZ2dlclwiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVBcmdDb25zdGFudHMgfSBmcm9tIFwiLi9jb21tYW5kTGluZUFyZ0NvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDb21tYW5kTGluZVBhcnNlciB9IGZyb20gXCIuL2NvbW1hbmRMaW5lUGFyc2VyXCI7XG5pbXBvcnQgeyBEaXNwbGF5TG9nZ2VyIH0gZnJvbSBcIi4vZGlzcGxheUxvZ2dlclwiO1xuaW1wb3J0IHsgRmlsZUxvZ2dlciB9IGZyb20gXCIuL2ZpbGVMb2dnZXJcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tIFwiLi9maWxlU3lzdGVtXCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDTElCYXNlIHtcbiAgICBwcml2YXRlIF9hcHBOYW1lOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fYXBwTmFtZSA9IGFwcE5hbWU7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bihwcm9jZXNzOiBOb2RlSlMuUHJvY2Vzcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCBsb2dnZXI6IElMb2dnZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCByZXQ6IG51bWJlcjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29tbWFuZExpbmVQYXJzZXIgPSBuZXcgQ29tbWFuZExpbmVQYXJzZXIoKTtcbiAgICAgICAgICAgIGNvbW1hbmRMaW5lUGFyc2VyLnBhcnNlKHByb2Nlc3MuYXJndik7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvZ2dlcnMgPSBbXTtcblxuICAgICAgICAgICAgbG9nZ2Vycy5wdXNoKG5ldyBEaXNwbGF5TG9nZ2VyKHByb2Nlc3MsIGNvbW1hbmRMaW5lUGFyc2VyLmhhc0FyZ3VtZW50KENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLk5PX0NPTE9SKSkpO1xuXG4gICAgICAgICAgICBjb25zdCBsb2dGaWxlID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0U3RyaW5nQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTE9HX0ZJTEUpO1xuICAgICAgICAgICAgaWYgKGxvZ0ZpbGUgIT09IHVuZGVmaW5lZCAmJiBsb2dGaWxlICE9PSBudWxsICYmIGxvZ0ZpbGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlcnMucHVzaChuZXcgRmlsZUxvZ2dlcihsb2dGaWxlKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvZ2dlciA9IG5ldyBBZ2dyZWdhdGVMb2dnZXIobG9nZ2Vycyk7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmhhbmRsZUNvbW1hbmQobG9nZ2VyLCBuZXcgRmlsZVN5c3RlbSgpLCBjb21tYW5kTGluZVBhcnNlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgIGlmIChsb2dnZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlVuaGFuZGxlZCBFeGNlcHRpb25cIiwgZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFuIHVuaGFuZGxlZCBlcnJvciBvY2N1cnJlZDogXCIsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhYnN0cmFjdCBhc3luYyBoYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyOiBDb21tYW5kTGluZVBhcnNlcik6IFByb21pc2U8bnVtYmVyPjtcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGlzcGxheUhlbHAobG9nZ2VyOiBJTG9nZ2VyKTogbnVtYmVyO1xuXG4gICAgcHJvdGVjdGVkIG1hcmtkb3duVGFibGVUb0NsaShsb2dnZXI6IElMb2dnZXIsIHJvdzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChyb3cubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgcm93ID0gcm93LnN1YnN0cmluZygwLCByb3cubGVuZ3RoIC0gMSkudHJpbSgpLnJlcGxhY2UoL1xcfC9nLCBcIlwiKTtcbiAgICAgICAgICAgIGlmIChyb3dbMl0gPT09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAgICR7cm93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAtLSR7cm93LnN1YnN0cmluZygxKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29tbWFuZChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBjb21tYW5kTGluZVBhcnNlcjogQ29tbWFuZExpbmVQYXJzZXIpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0OiBudW1iZXIgPSAwO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuZGlzcGxheUJhbm5lcihsb2dnZXIsIGZpbGVTeXN0ZW0sIGNvbW1hbmRMaW5lUGFyc2VyLmdldENvbW1hbmQoKSAhPT0gQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLlZFUlNJT04sIGNvbW1hbmRMaW5lUGFyc2VyKTtcblxuICAgICAgICBjb25zdCBjb21tYW5kID0gY29tbWFuZExpbmVQYXJzZXIuZ2V0Q29tbWFuZCgpO1xuICAgICAgICBjb25zdCBub0NvbG9yID0gY29tbWFuZExpbmVQYXJzZXIuaGFzQXJndW1lbnQoQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTk9fQ09MT1IpO1xuICAgICAgICBpZiAobm9Db2xvcikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oQ29tbWFuZExpbmVBcmdDb25zdGFudHMuTk9fQ09MT1IsIHsgdmFsdWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbW1hbmRMaW5lUGFyc2VyLmhhc0FyZ3VtZW50KENvbW1hbmRMaW5lQXJnQ29uc3RhbnRzLkxPR19GSUxFKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb21tYW5kTGluZVBhcnNlci5nZXRBcmd1bWVudChDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5MT0dfRklMRSk7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhDb21tYW5kTGluZUFyZ0NvbnN0YW50cy5MT0dfRklMRSwgeyB2YWx1ZSB9ICk7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICAgICAgICAgIGNhc2UgQ29tbWFuZExpbmVDb21tYW5kQ29uc3RhbnRzLlZFUlNJT046IHtcbiAgICAgICAgICAgICAgICAvLyBOb3RoaW5nIGVsc2UgdG8gZGlzcGxheVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIENvbW1hbmRMaW5lQ29tbWFuZENvbnN0YW50cy5IRUxQOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5SGVscChsb2dnZXIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5oYW5kbGVDdXN0b21Db21tYW5kKGxvZ2dlciwgZmlsZVN5c3RlbSwgY29tbWFuZExpbmVQYXJzZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiTm8gY29tbWFuZCBzcGVjaWZpZWQgdHJ5IGhlbHBcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFVua25vd24gY29tbWFuZCAtICR7Y29tbWFuZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBkaXNwbGF5QmFubmVyKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGluY2x1ZGVUaXRsZTogYm9vbGVhbiwgY29tbWFuZExpbmVQYXJzZXI6IENvbW1hbmRMaW5lUGFyc2VyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyB2ZXJzaW9uOiBzdHJpbmd9PihmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGZpbGVTeXN0ZW0ucGF0aEdldERpcmVjdG9yeShjb21tYW5kTGluZVBhcnNlci5nZXRTY3JpcHQoKSksIFwiLi4vXCIpLCBcInBhY2thZ2UuanNvblwiKTtcbiAgICAgICAgaWYgKGluY2x1ZGVUaXRsZSkge1xuICAgICAgICAgICAgbG9nZ2VyLmJhbm5lcihgJHt0aGlzLl9hcHBOYW1lfSBDTElgKTtcbiAgICAgICAgfVxuICAgICAgICBsb2dnZXIuYmFubmVyKHBhY2thZ2VKc29uICYmIHBhY2thZ2VKc29uLnZlcnNpb24gPyBgdiR7cGFja2FnZUpzb24udmVyc2lvbn1gIDogXCIgVW5rbm93biBWZXJzaW9uXCIpO1xuICAgICAgICBpZiAoaW5jbHVkZVRpdGxlKSB7XG4gICAgICAgICAgICBsb2dnZXIuYmFubmVyKFwiXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
