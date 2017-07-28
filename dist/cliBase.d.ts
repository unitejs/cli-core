/// <reference types="node" />
/**
 * Main entry point.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { CommandLineParser } from "./commandLineParser";
export declare abstract class CLIBase {
    private _appName;
    private _defaultLog;
    constructor(appName: string, defaultLog: string);
    run(process: NodeJS.Process): Promise<number>;
    abstract handleCustomCommand(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number>;
    abstract displayHelp(display: IDisplay): number;
    protected markdownTableToCli(display: IDisplay, row: string): void;
    private handleCommand(logger, display, fileSystem, commandLineParser);
    private displayBanner(logger, display, fileSystem, includeTitle, commandLineParser);
}
