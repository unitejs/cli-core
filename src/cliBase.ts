/**
 * Main entry point.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { DefaultLogger } from "unitejs-framework/dist/loggers/defaultLogger";
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
        let fileLogger: FileLogger | undefined;
        let ret: number = 1;

        try {
            const commandLineParser = new CommandLineParser();
            const badCommands = commandLineParser.parse(process ? process.argv : undefined);

            const loggers = [];
            const fileSystem = new FileSystem();

            const noColor = commandLineParser.getBooleanArgument(CommandLineArgConstants.NO_COLOR);
            loggers.push(new DisplayLogger(process, noColor));

            const logFile = commandLineParser.getStringArgument(CommandLineArgConstants.LOG_FILE);
            if (logFile !== undefined && logFile !== null && logFile.length > 0) {
                fileLogger = new FileLogger(logFile, fileSystem);
                await fileLogger.initialise();
                loggers.push(fileLogger);
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
                DefaultLogger.log("An error occurred: ", err);
            }
        }

        if (fileLogger !== undefined) {
            await fileLogger.closedown();
        }

        return ret;
    }

    public abstract async handleCustomCommand(logger: ILogger, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number>;
    public abstract displayHelp(logger: ILogger): number;

    public checkRemaining(logger: ILogger, commandLineParser: CommandLineParser): number {
        const remaining = commandLineParser.getRemaining();
        if (remaining.length > 0) {
            logger.error("Unrecognized arguments on the command line", undefined, { remaining });
            return 1;
        } else {
            return 0;
        }
    }

    protected markdownTableToCli(logger: ILogger, row: string): void {
        if (row !== undefined && row !== null && row.length > 2) {
            const newRow = row.substring(0, row.length - 1).trim().replace(/\|/g, "");
            if (newRow[2] === " ") {
                logger.info(`   ${newRow.substring(1)}`);
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
                ret = this.checkRemaining(logger, commandLineParser);

                // Nothing else to display
                break;
            }

            case CommandLineCommandConstants.HELP: {
                ret = this.checkRemaining(logger, commandLineParser);

                if (ret === 0) {
                    this.displayHelp(logger);
                }
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

        const packageJsonDir = fileSystem.pathCombine(fileSystem.pathGetDirectory(`${commandLineParser.getScript()}.js`), "../");
        const packageJsonExists = await fileSystem.fileExists(packageJsonDir, "package.json");
        if (packageJsonExists) {
            const packageJson = await fileSystem.fileReadJson<{ version: string }>(packageJsonDir, "package.json");
            logger.banner(`v${packageJson.version}`);
        }
        if (includeTitle) {
            logger.banner("");
        }
    }
}
