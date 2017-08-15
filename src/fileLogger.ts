/**
 * File Logger class
 */
import * as os from "os";
import { ErrorHandler } from "unitejs-framework/dist/helpers/errorHandler";
import { JsonHelper } from "unitejs-framework/dist/helpers/jsonHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { DefaultLogger } from "unitejs-framework/dist/loggers/defaultLogger";

export class FileLogger implements ILogger {
    private _fileSystem: IFileSystem;
    private _logFolder: string;
    private _logFile: string;
    private _buffer: string;
    private _flushIntervalId: NodeJS.Timer;

    constructor(logFile: string, fileSystem: IFileSystem) {
        this._fileSystem = fileSystem;
        this._logFolder = this._fileSystem.pathGetDirectory(logFile);
        this._logFile = this._fileSystem.pathGetFilename(logFile);
        this._buffer = "";
    }

    public async initialise(): Promise<void> {
        try {
            const dirExists = await this._fileSystem.directoryExists(this._logFolder);
            if (!dirExists) {
                await this._fileSystem.directoryCreate(this._logFolder);
            }

            const fileExists = await this._fileSystem.fileExists(this._logFolder, this._logFile);

            if (fileExists) {
                await this._fileSystem.fileDelete(this._logFolder, this._logFile);
            }

            this._flushIntervalId = setInterval(async () => this.flushData(), 200);
        } catch (err) {
            throw new Error(`Initialising Log File: ${this._logFile}: ${err.toString()}`);
        }
    }

    public async closedown(): Promise<void> {
        this.stopInterval();
        await this.flushData();
        return Promise.resolve();
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

        this._buffer += output;
    }

    private async flushData(): Promise<void> {
        if (this._buffer.length > 0) {
            try {
                const localBuffer = this._buffer;
                this._buffer = "";
                await this._fileSystem.fileWriteText(this._logFolder, this._logFile, localBuffer, true);
            } catch (err) {
                this.stopInterval();
                DefaultLogger.log(`ERROR: Logging To File '${this._logFile}': ${ErrorHandler.format(err)}`);
            }
        }
    }

    private stopInterval(): void {
        if (this._flushIntervalId !== undefined) {
            clearInterval(this._flushIntervalId);
            this._flushIntervalId = undefined;
        }
    }
}
