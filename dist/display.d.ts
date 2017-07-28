/// <reference types="node" />
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
export declare class Display implements IDisplay {
    private _colorsOn;
    private _colors;
    constructor(process: NodeJS.Process, noColor: boolean);
    banner(message: string): void;
    log(message: string, args?: {
        [id: string]: any;
    }): void;
    info(message: string, args?: {
        [id: string]: any;
    }): void;
    error(message: string, err?: any, args?: {
        [id: string]: any;
    }): void;
    diagnostics(message: string, args?: {
        [id: string]: any;
    }): void;
    private colorStart(color);
    private colorStop(color);
    private arrayToReadable(args?);
    private calculateColors(process, noColor);
}
