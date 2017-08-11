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
        let logPrefix = "";
        let ret: number = 1;

        try {
            const commandLineParser = new CommandLineParser();
            const badCommands = commandLineParser.parse(process ? process.argv : undefined);

            const loggers = [];
            const fileSystem = new FileSystem();

            const noColor = commandLineParser.hasArgument(CommandLineArgConstants.NO_COLOR);
            logPrefix = commandLineParser.getStringArgument(CommandLineArgConstants.LOG_PREFIX);
            loggers.push(new DisplayLogger(process, noColor, logPrefix));

            const logFile = commandLineParser.getStringArgument(CommandLineArgConstants.LOG_FILE);
            if (logFile !== undefined && logFile !== null && logFile.length > 0) {
                const dirName = fileSystem.pathGetDirectory(logFile);
                const dirExists = await fileSystem.directoryExists(dirName);
                if (!dirExists) {
                    await fileSystem.directoryCreate(dirName);
                }
                loggers.push(new FileLogger(logFile));
            }

            logger = new AggregateLogger(loggers);

            if (commandLineParser.getInterpreter() === undefined) {
                logger.error("The command line contained no interpreter");
            } else if (commandLineParser.getScript() === undefined) {
                logger.error("The command line contained no script");
            } else if (badCommands.length > 0) {
                logger.error("The following arguments are badly formed", badCommands);
            } else {
                const isVersionCommand = commandLineParser.getCommand() === CommandLineCommandConstants.VERSION;
                await this.displayBanner(logger, fileSystem, !isVersionCommand, commandLineParser);

                if (!isVersionCommand) {
                    if (noColor) {
                        const value = true;
                        logger.info(CommandLineArgConstants.NO_COLOR, { value });
                    }
                    if (logFile !== undefined && logFile !== null && logFile.length > 0) {
                        logger.info(CommandLineArgConstants.LOG_FILE, { logFile });
                    }
                }

                ret = await this.handleCommand(logger, fileSystem, commandLineParser);
            }
        } catch (err) {
            if (logger !== undefined) {
                logger.error("Unhandled Exception", err);
            } else {
                // tslint:disable-next-line:no-console
                console.log(`${logPrefix}An unhandled error occurred: `, err);
            }
        }

        return ret;
    }

    public abstract async handleCustomCommand(logger: ILogger, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number>;
    public abstract displayHelp(logger: ILogger): number;

    protected markdownTableToCli(logger: ILogger, row: string): void {
        if (row !== undefined && row !== null && row.length > 2) {
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

        const command = commandLineParser.getCommand();

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
                    ret = 1;
                }
            }
        }

        return ret;
    }

    private async displayBanner(logger: ILogger, fileSystem: IFileSystem, includeTitle: boolean, commandLineParser: CommandLineParser): Promise<void> {
        if (includeTitle) {
            logger.banner(`${this._appName} CLI`);
        }

        const packageJsonDir = fileSystem.pathCombine(fileSystem.pathGetDirectory(commandLineParser.getScript()), "../");
        const packageJsonExists = await fileSystem.fileExists(packageJsonDir, "package.json");
        if (packageJsonExists) {
            const packageJson = await fileSystem.fileReadJson<{ version: string }>(fileSystem.pathCombine(fileSystem.pathGetDirectory(commandLineParser.getScript()), "../"), "package.json");
            logger.banner(`v${packageJson.version}`);
        }
        if (includeTitle) {
            logger.banner("");
        }
    }
}
