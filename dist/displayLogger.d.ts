/// <reference types="node" />
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
export declare class DisplayLogger implements ILogger {
    private _colorsOn;
    private _colors;
    constructor(process: NodeJS.Process, noColor: boolean);
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
