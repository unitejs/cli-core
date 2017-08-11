/// <reference types="node" />
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
export declare class DisplayLogger implements ILogger {
    private _colorsOn;
    private _colors;
    private _logPrefix;
    constructor(process: NodeJS.Process, noColor: boolean, logPrefix?: string);
    banner(message: string, args?: {
        [id: string]: any;
    }): void;
    info(message: string, args?: {
        [id: string]: any;
    }): void;
    warning(message: string, args?: {
        [id: string]: any;
    }): void;
    error(message: string, err?: any, args?: {
        [id: string]: any;
    }): void;
    private display(messageColor, argsColor, message, args?);
    private colorStart(color);
    private colorStop(color);
    private arrayToReadable(args?);
    private calculateColors(process, noColor);
}
