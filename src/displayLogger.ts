/**
 * Display class
 */
import * as os from "os";
import { ErrorHandler } from "unitejs-framework/dist/helpers/errorHandler";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";

// tslint:disable:no-console
export class DisplayLogger implements ILogger {
    private _colorsOn: boolean;
    private _colors: { [id: string]: { start: number; stop: number } };

    constructor(process: NodeJS.Process, noColor: boolean) {
        this._colorsOn = this.calculateColors(process, noColor);
        this._colors = {
            reset: { start: 0, stop: 0 },

            bold: { start: 1, stop: 22 },
            dim: { start: 2, stop: 22 },
            italic: { start: 3, stop: 23 },
            underline: { start: 4, stop: 24 },
            inverse: { start: 7, stop: 27 },
            hidden: { start: 8, stop: 28 },
            strikethrough: { start: 9, stop: 29 },

            black: { start: 30, stop: 39 },
            red: { start: 31, stop: 39 },
            green: { start: 32, stop: 39 },
            yellow: { start: 33, stop: 39 },
            blue: { start: 34, stop: 39 },
            magenta: { start: 35, stop: 39 },
            cyan: { start: 36, stop: 39 },
            white: { start: 37, stop: 39 },
            gray: { start: 90, stop: 39 },
            grey: { start: 90, stop: 39 },

            bgBlack: { start: 40, stop: 49 },
            bgRed: { start: 41, stop: 49 },
            bgGreen: { start: 42, stop: 49 },
            bgYellow: { start: 43, stop: 49 },
            bgBlue: { start: 44, stop: 49 },
            bgMagenta: { start: 45, stop: 49 },
            bgCyan: { start: 46, stop: 49 },
            bgWhite: { start: 47, stop: 49 }
        };
    }

    public banner(message: string, args?: { [id: string]: any }): void {
        this.display("green", "white", message, args);
    }

    public info(message: string, args?: { [id: string]: any }): void {
        this.display("white", "cyan", message, args);
    }

    public warning(message: string, args?: { [id: string]: any }): void {
        this.display("yellow", "cyan", message, args);
    }

    public error(message: string, err?: any, args?: { [id: string]: any }): void {
        this.display("red", "red", `ERROR: ${message ? message : ""}`, args);
        if (err) {
            console.log(this.colorStart("red") + ErrorHandler.format(err) + this.colorStop("red"));
        }
    }

    private display(messageColor: string, argsColor: string, message: string, args?: { [id: string]: any }): void {
        if (args && Object.keys(args).length > 0) {
            if (message !== null && message !== undefined && message.length > 0) {
                console.log(`${this.colorStart(messageColor)}${message}: ${this.colorStop(messageColor)}${this.colorStart(argsColor)}${this.arrayToReadable(args)}${this.colorStop(argsColor)}`);
            } else {
                console.log(`${this.colorStart(argsColor)}${this.arrayToReadable(args)}${this.colorStop(argsColor)}`);
            }
        } else {
            if (message !== null && message !== undefined && message.length > 0) {
                console.log(`${this.colorStart(messageColor)}${message}${this.colorStop(argsColor)}`);
            } else {
                console.log("");
            }
        }
    }

    private colorStart(color: string): string {
        return this._colorsOn ? `\u001b[${this._colors[color].start}m` : "";
    }

    private colorStop(color: string): string {
        return this._colorsOn ? `\u001b[${this._colors[color].stop}m` : "";
    }

    private arrayToReadable(args?: { [id: string]: any }): string {
        const retParts: string[] = [];
        if (args) {
            const objKeys = Object.keys(args);
            if (objKeys.length === 1) {
                retParts.push(args[objKeys[0]]);
            } else {
                objKeys.forEach(objKey => {
                    retParts.push(os.EOL);
                    retParts.push(`    ${objKey}: `);
                    if (args[objKey]) {
                        retParts.push(args[objKey].toString());
                    } else {
                        retParts.push("undefined");
                    }
                });
            }
        }
        return retParts.join("");
    }

    private calculateColors(process: NodeJS.Process, noColor: boolean): boolean {
        if (noColor) {
            return false;
        }

        if (process.stdout && !process.stdout.isTTY) {
            return false;
        }

        if (process.platform === "win32") {
            return true;
        }

        if ("COLORTERM" in process.env) {
            return true;
        }

        if (process.env.TERM === "dumb") {
            return false;
        }

        if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
            return true;
        }

        return false;
    }
}
