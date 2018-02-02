import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
export declare class FileLogger implements ILogger {
    private readonly _fileSystem;
    private readonly _logFolder;
    private readonly _logFile;
    private _buffer;
    private _flushIntervalId;
    constructor(logFile: string, fileSystem: IFileSystem);
    initialise(): Promise<void>;
    closedown(): Promise<void>;
    banner(message: string, args?: {
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
    private flushData();
    private stopInterval();
}
