/**
 * Logger class
 */
import * as fs from "fs";
import * as os from "os";
import { ErrorHandler } from "unitejs-framework/dist/helpers/errorHandler";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";

export class FileLogger implements ILogger {
    private _logFile: string;

    constructor(logFile: string | undefined | null) {
        this._logFile = logFile;
        try {
            if (fs.existsSync(this._logFile)) {
                fs.unlinkSync(this._logFile);
            }
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.error(`Error Deleting Log File: ${err}`);
        }
    }

    public banner(message: string, error?: any, args?: { [id: string]: any }): void {
        this.write("===  ", message, args);
    }

    public info(message: string, args?: { [id: string]: any }): void {
        this.write("LOG: ", message, args);
    }

    public warning(message: string, args?: { [id: string]: any }): void {
        this.write("WARNING: ", message, args);
    }

    public error(message: string, error?: any, args?: { [id: string]: any }): void {
        this.write("ERROR: ", message, args);
        if (error) {
            this.write("EXCEPTION: ", ErrorHandler.format(error));
        }
    }

    private write(type: string, message: string, args?: { [id: string]: any }): void {
        try {
            let output = "";
            if (message !== null && message !== undefined && message.length > 0) {
                output += `${type}${message}${os.EOL}`;
            } else {
                output += os.EOL;
            }
            if (args) {
                Object.keys(args).forEach((argKey) => {
                    const cache: any[] = [];

                    const objectJson = JSON.stringify(args[argKey], (key, value) => {
                        if (typeof value === "object" && value !== null && value !== undefined) {
                            if (cache.indexOf(value) !== -1) {
                                // circular reference found, discard key
                                return;
                            } else {
                                cache.push(value);
                            }
                        }
                        return value;
                    });

                    output += `\t\t${argKey}: ${objectJson}${os.EOL}`;
                });
            }

            fs.appendFileSync(this._logFile, output);
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.error(`Error Logging: ${err}`);
        }
    }
}
