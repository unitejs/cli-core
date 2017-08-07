/**
 * Display class
 */
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
export declare class AggregateLogger implements ILogger {
    private _loggers;
    constructor(loggers: ILogger[]);
    banner(message: string): void;
    info(message: string, args?: {
        [id: string]: any;
    }): void;
    warning(message: string, args?: {
        [id: string]: any;
    }): void;
    error(message: string, err?: any, args?: {
        [id: string]: any;
    }): void;
}
