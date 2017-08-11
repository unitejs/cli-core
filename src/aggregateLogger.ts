/**
 * Aggregate Logger class
 */
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";

export class AggregateLogger implements ILogger {
    private _loggers: ILogger[];

    constructor(loggers: ILogger[]) {
        this._loggers = loggers;
    }

    public banner(message: string): void {
        if (this._loggers) {
            this._loggers.forEach(logger => logger.banner(message));
        }
    }

    public info(message: string, args?: { [id: string]: any }): void {
        if (this._loggers) {
            this._loggers.forEach(logger => logger.info(message, args));
        }
    }

    public warning(message: string, args?: { [id: string]: any }): void {
        if (this._loggers) {
            this._loggers.forEach(logger => logger.warning(message, args));
        }
    }

    public error(message: string, err?: any, args?: { [id: string]: any }): void {
        if (this._loggers) {
            this._loggers.forEach(logger => logger.error(message, err, args));
        }
    }
}
