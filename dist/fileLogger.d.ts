import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
export declare class FileLogger implements ILogger {
    private _logFile;
    constructor(logFile: string | undefined | null);
    banner(message: string, error?: any, args?: {
        [id: string]: any;
    }): void;
    info(message: string, args?: {
        [id: string]: any;
    }): void;
    warning(message: string, args?: {
        [id: string]: any;
    }): void;
    error(message: string, error?: any, args?: {
        [id: string]: any;
    }): void;
    private write(type, message, args?);
}
