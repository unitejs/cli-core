/**
 * Display class
 */
import * as os from "os";
import { ErrorHandler } from "unitejs-framework/dist/helpers/errorHandler";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { DefaultLogger } from "unitejs-framework/dist/loggers/defaultLogger";

export class DisplayLogger implements ILogger {
    private readonly _colorsOn: boolean;
    private readonly _colors: { [id: string]: { start: number; stop: number } };

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
        let finalMessage;
        if (message !== null && message !== undefined && message.length > 0) {
            finalMessage = `ERROR: ${message}`;
        } else {
            finalMessage = "ERROR";
        }
        this.display("red", "red", finalMessage, args);
        if (err) {
            DefaultLogger.log(`${this.colorStart("red")}${ErrorHandler.format(err)}${this.colorStop("red")}`);
        }
    }

    private display(messageColor: string, argsColor: string, message: string, args?: { [id: string]: any }): void {
        if (args && Object.keys(args).length > 0) {
            if (message !== null && message !== undefined && message.length > 0) {
                DefaultLogger.log(`${this.colorStart(messageColor)}${message}: ${this.colorStop(messageColor)}${this.colorStart(argsColor)}${this.arrayToReadable(args)}${this.colorStop(argsColor)}`);
            } else {
                DefaultLogger.log(`${this.colorStart(argsColor)}${this.arrayToReadable(args).trim()}${this.colorStop(argsColor)}`);
            }
        } else {
            if (message !== null && message !== undefined && message.length > 0) {
                DefaultLogger.log(`${this.colorStart(messageColor)}${message}${this.colorStop(argsColor)}`);
            } else {
                DefaultLogger.log("");
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
        const objKeys = Object.keys(args);
        if (objKeys.length === 1) {
            if (args[objKeys[0]] !== undefined && args[objKeys[0]] !== null) {
                retParts.push(args[objKeys[0]].toString());
            } else {
                retParts.push("undefined");
            }
        } else {
            objKeys.forEach(objKey => {
                retParts.push(os.EOL);
                retParts.push(`\t${objKey}: `);
                if (args[objKey] !== undefined && args[objKey]  !== null) {
                    retParts.push(args[objKey].toString());
                } else {
                    retParts.push("undefined");
                }
            });
        }
        return retParts.join("");
    }

    private calculateColors(process: NodeJS.Process, noColor: boolean): boolean {
        // Logic copied from https://github.com/chalk/supports-color/blob/master/index.js
        if (noColor) {
            return false;
        }

        if (process) {
            if (process.stdout && !process.stdout.isTTY) {
                return false;
            }

            if (process.platform === "win32") {
                return true;
            }

            if (process.env) {
                if ("CI" in process.env) {
                    return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(sign => sign in process.env);
                }

                if ("TEAMCITY_VERSION" in process.env) {
                    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(process.env.TEAMCITY_VERSION);
                }

                if ("TERM_PROGRAM" in process.env) {
                    if (["iTerm.app", "Hyper", "Apple_Terminal"].indexOf(process.env.TERM_PROGRAM) >= 0) {
                        return true;
                    }
                }

                if (/^(screen|xterm)-256(?:color)?/.test(process.env.TERM)) {
                    return true;
                }

                if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
                    return true;
                }

                if ("COLORTERM" in process.env) {
                    return true;
                }

                if (process.env.TERM === "dumb") {
                    return false;
                }
            }
        }

        return false;
    }
}
