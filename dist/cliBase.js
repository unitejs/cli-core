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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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
