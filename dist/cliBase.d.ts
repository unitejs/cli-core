/// <reference types="node" />
/**
 * Main entry point.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { CommandLineParser } from "./commandLineParser";
export declare abstract class CLIBase {
    private _appName;
    constructor(appName: string);
    initialise(logger: ILogger, fileSystem: IFileSystem): Promise<number>;
    run(process: NodeJS.Process): Promise<number>;
    abstract handleCustomCommand(logger: ILogger, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number>;
    abstract displayHelp(logger: ILogger): number;
    displayAdditionalVersion(logger: ILogger): void;
    checkRemaining(logger: ILogger, commandLineParser: CommandLineParser): number;
    protected markdownTableToCli(logger: ILogger, row: string): void;
    private handleCommand(logger, fileSystem, commandLineParser);
    private displayBanner(logger, fileSystem, includeTitle, commandLineParser);
}
