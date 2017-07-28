import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
export declare class Logger implements ILogger {
    private _logLevel;
    private _logFile;
    constructor(logLevel: number | undefined | null, logFile: string | undefined | null, defaultLogName: string);
    log(message: string, args?: {
        [id: string]: any;
    }): void;
    info(message: string, args?: {
        [id: string]: any;
    }): void;
    error(message: string, args?: {
        [id: string]: any;
    }): void;
    exception(message: string, exception: any, args?: {
        [id: string]: any;
    }): void;
    private write(type, message, args?);
}
