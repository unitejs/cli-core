/**
 * Main entry point.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { AggregateLogger } from "./aggregateLogger";
import { CommandLineArgConstants } from "./commandLineArgConstants";
import { CommandLineCommandConstants } from "./commandLineCommandConstants";
import { CommandLineParser } from "./commandLineParser";
import { DisplayLogger } from "./displayLogger";
import { FileLogger } from "./fileLogger";
import { FileSystem } from "./fileSystem";

export abstract class CLIBase {
    private _appName: string;

    constructor(appName: string) {
        this._appName = appName;
    }

    public async run(process: NodeJS.Process): Promise<number> {
        let logger: ILogger | undefined;
        let ret: number;

        try {
            const commandLineParser = new CommandLineParser();
            commandLineParser.parse(process.argv);

            const loggers = [];

            loggers.push(new DisplayLogger(process, commandLineParser.hasArgument(CommandLineArgConstants.NO_COLOR)));

            const logFile = commandLineParser.getStringArgument(CommandLineArgConstants.LOG_FILE);
            if (logFile !== undefined && logFile !== null && logFile.length > 0) {
                loggers.push(new FileLogger(logFile));
            }

            logger = new AggregateLogger(loggers);
            ret = await this.handleCommand(logger, new FileSystem(), commandLineParser);
        } catch (err) {
            ret = 1;
            if (logger !== undefined) {
                logger.error("Unhandled Exception", err);
            } else {
                // tslint:disable-next-line:no-console
                console.log("An unhandled error occurred: ", err);
            }
        }

        return ret;
    }

    public abstract async handleCustomCommand(logger: ILogger, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number>;
    public abstract displayHelp(logger: ILogger): number;

    protected markdownTableToCli(logger: ILogger, row: string): void {
        if (row.length > 2) {
            row = row.substring(0, row.length - 1).trim().replace(/\|/g, "");
            if (row[2] === " ") {
                logger.info(`   ${row.substring(1)}`);
            } else {
                logger.info(` --${row.substring(1)}`);
            }
        }
    }

    private async handleCommand(logger: ILogger, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number> {
        let ret: number = 0;

        await this.displayBanner(logger, fileSystem, commandLineParser.getCommand() !== CommandLineCommandConstants.VERSION, commandLineParser);

        const command = commandLineParser.getCommand();
        const noColor = commandLineParser.hasArgument(CommandLineArgConstants.NO_COLOR);
        if (noColor) {
            const value = true;
            logger.info(CommandLineArgConstants.NO_COLOR, { value });
        }
        if (commandLineParser.hasArgument(CommandLineArgConstants.LOG_FILE)) {
            const value = commandLineParser.getArgument(CommandLineArgConstants.LOG_FILE);
            logger.info(CommandLineArgConstants.LOG_FILE, { value } );
        }

        switch (command) {
            case CommandLineCommandConstants.VERSION: {
                // Nothing else to display
                break;
            }

            case CommandLineCommandConstants.HELP: {
                this.displayHelp(logger);
                break;
            }

            default: {
                ret = await this.handleCustomCommand(logger, fileSystem, commandLineParser);

                if (ret < 0) {
                    if (command === undefined) {
                        logger.error("No command specified try help");
                    } else {
                        logger.error(`Unknown command - ${command}`);
                    }
                }
            }
        }

        return ret;
    }

    private async displayBanner(logger: ILogger, fileSystem: IFileSystem, includeTitle: boolean, commandLineParser: CommandLineParser): Promise<void> {
        const packageJson = await fileSystem.fileReadJson<{ version: string}>(fileSystem.pathCombine(fileSystem.pathGetDirectory(commandLineParser.getScript()), "../"), "package.json");
        if (includeTitle) {
            logger.banner(`${this._appName} CLI`);
        }
        logger.banner(packageJson && packageJson.version ? `v${packageJson.version}` : " Unknown Version");
        if (includeTitle) {
            logger.banner("");
        }
    }
}
