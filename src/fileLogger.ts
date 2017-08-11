/**
 * File Logger class
 */
import * as fs from "fs";
import * as os from "os";
import { ErrorHandler } from "unitejs-framework/dist/helpers/errorHandler";
import { JsonHelper } from "unitejs-framework/dist/helpers/jsonHelper";
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
            console.log(`Error Deleting Log File: ${ErrorHandler.format(err)}`);
        }
    }

    public banner(message: string, args?: { [id: string]: any }): void {
        this.write("===  ", message, args);
    }

    public info(message: string, args?: { [id: string]: any }): void {
        this.write("INFO: ", message, args);
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
                    const objectJson = JsonHelper.stringify(args[argKey]);

                    output += `\t\t${argKey}: ${objectJson}${os.EOL}`;
                });
            }

            fs.appendFileSync(this._logFile, output);
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.log(`Error Logging: ${ErrorHandler.format(err)}`);
        }
    }
}
