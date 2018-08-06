/// <reference types="node" />
/**
 * Main entry point.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { CommandLineParser } from "./commandLineParser";
import { WebSecureClient } from "./webSecureClient";
export declare abstract class CLIBase {
    protected _disableVersionCheck: boolean;
    protected _appName: string;
    protected _packageName: string;
    protected _packageVersion: string;
    protected _newVersion: string;
    constructor(appName: string);
    initialise(logger: ILogger, fileSystem: IFileSystem): Promise<number>;
    run(process: NodeJS.Process): Promise<number>;
    abstract handleCustomCommand(logger: ILogger, fileSystem: IFileSystem, commandLineParser: CommandLineParser): Promise<number>;
    abstract displayHelp(logger: ILogger): number;
    displayAdditionalVersion(logger: ILogger): void;
    checkRemaining(logger: ILogger, commandLineParser: CommandLineParser): number;
    protected checkVersion(client: WebSecureClient): Promise<boolean>;
    protected markdownTableToCli(logger: ILogger, row: string): void;
    private handleCommand;
    private displayBanner;
}
