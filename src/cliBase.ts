/**
 * Main entry point.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { CommandLineArgConstants } from "./commandLineArgConstants";
import { CommandLineCommandConstants } from "./commandLineCommandConstants";
import { CommandLineParser } from "./commandLineParser";
import { Display } from "./display";
import { FileSystem } from "./fileSystem";
import { Logger } from "./logger";

export abstract class CLIBase {
    private _appName: string;
    private _defaultLog: string;

    constructor(appName: string, defaultLog: string) {
        this._appName = appName;
        this._defaultLog = defaultLog;
    }

    public async run(process: NodeJS.Process): Promise<number> {
        let logger: ILogger | undefined;
        let ret: number;

        try {
            const commandLineParser = new CommandLineParser();
            commandLineParser.parse(process.argv);

            logger = new Logger(commandLineParser.getNumberArgument(CommandLineArgConstants.LOG_LEVEL),
                                commandLineParser.getStringArgument(CommandLineArgConstants.LOG_FILE),
                                this._defaultLog);
            logger.info("Session Started");

            const display: IDisplay = new Display(process, commandLineParser.hasArgument(CommandLineArgConstants.NO_COLOR));

            const fileSystem = new FileSystem();

            ret = await this.handleCommand(logger, display, fileSystem, commandLineParser);

            logger.info("Session Ended", { returnCode: ret });
        } catch (err) {
            ret = 1;
            // tslint:disable-next-line:no-console
            console.log("An unhandled error occurred: ", err);
            if (logger !== undefined) {
                logger.error("Unhandled Exception", err);
                logger.info("Session Ended", { returnCode: ret });
            }
        }

        return ret;
    }

    public abstract async handleCustomCommand(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number>;
    public abstract displayHelp(display: IDisplay): number;

    protected markdownTableToCli(display: IDisplay, row: string): void {
        if (row.length > 2) {
            row = row.substring(0, row.length - 1).trim().replace(/\|/g, "");
            if (row[2] === " ") {
                display.info(`   ${row.substring(1)}`);
            } else {
                display.info(` --${row.substring(1)}`);
            }
        }
    }

    private async handleCommand(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number> {
        let ret: number = 0;

        await this.displayBanner(logger, display, fileSystem, commandLineParser.getCommand() !== CommandLineCommandConstants.VERSION, commandLineParser);

        const command = commandLineParser.getCommand();
        const args = commandLineParser.getArguments([CommandLineArgConstants.NO_COLOR,
        CommandLineArgConstants.LOG_FILE,
        CommandLineArgConstants.LOG_LEVEL]);

        logger.info("Command Line", { command, args });

        switch (command) {
            case CommandLineCommandConstants.VERSION: {
                // Nothing else to display
                break;
            }

            case CommandLineCommandConstants.HELP: {
                this.displayHelp(display);
                break;
            }

            default: {
                ret = await this.handleCustomCommand(logger, display, fileSystem, commandLineParser);

                if (ret < 0) {
                    if (command === undefined) {
                        display.error("No command specified");
                    } else {
                        display.error(`Unknown command - ${command}`);
                    }
                    display.info("Command line format: <command> [--arg1] [--arg2] ... [--argn]");
                }
            }
        }

        return ret;
    }

    private async displayBanner(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, includeTitle: boolean, commandLineParser: CommandLineParser): Promise<void> {
        const packageJson = await fileSystem.fileReadJson<{ version: string}>(fileSystem.pathCombine(fileSystem.pathGetDirectory(commandLineParser.getScript()), "../"), "package.json");
        if (includeTitle) {
            display.banner(`${this._appName} CLI`);
        }
        display.banner(packageJson && packageJson.version ? `v${packageJson.version}` : " Unknown Version");
        logger.info(this._appName, { version: packageJson.version });
        if (includeTitle) {
            display.banner("");
        }
    }
}
