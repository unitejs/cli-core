"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Display class
 */
const os = require("os");
const errorHandler_1 = require("unitejs-framework/dist/helpers/errorHandler");
const defaultLogger_1 = require("unitejs-framework/dist/loggers/defaultLogger");
class DisplayLogger {
    constructor(process, noColor) {
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
    banner(message, args) {
        this.display("green", "white", message, args);
    }
    info(message, args) {
        this.display("white", "cyan", message, args);
    }
    warning(message, args) {
        this.display("yellow", "cyan", message, args);
    }
    error(message, err, args) {
        let finalMessage;
        if (message !== null && message !== undefined && message.length > 0) {
            finalMessage = `ERROR: ${message}`;
        }
        else {
            finalMessage = "ERROR";
        }
        this.display("red", "red", finalMessage, args);
        if (err) {
            defaultLogger_1.DefaultLogger.log(`${this.colorStart("red")}${errorHandler_1.ErrorHandler.format(err)}${this.colorStop("red")}`);
        }
    }
    display(messageColor, argsColor, message, args) {
        if (args && Object.keys(args).length > 0) {
            if (message !== null && message !== undefined && message.length > 0) {
                defaultLogger_1.DefaultLogger.log(`${this.colorStart(messageColor)}${message}: ${this.colorStop(messageColor)}${this.colorStart(argsColor)}${this.arrayToReadable(args)}${this.colorStop(argsColor)}`);
            }
            else {
                defaultLogger_1.DefaultLogger.log(`${this.colorStart(argsColor)}${this.arrayToReadable(args).trim()}${this.colorStop(argsColor)}`);
            }
        }
        else {
            if (message !== null && message !== undefined && message.length > 0) {
                defaultLogger_1.DefaultLogger.log(`${this.colorStart(messageColor)}${message}${this.colorStop(argsColor)}`);
            }
            else {
                defaultLogger_1.DefaultLogger.log("");
            }
        }
    }
    colorStart(color) {
        return this._colorsOn ? `\u001b[${this._colors[color].start}m` : "";
    }
    colorStop(color) {
        return this._colorsOn ? `\u001b[${this._colors[color].stop}m` : "";
    }
    arrayToReadable(args) {
        const retParts = [];
        const objKeys = Object.keys(args);
        if (objKeys.length === 1) {
            if (args[objKeys[0]] !== undefined && args[objKeys[0]] !== null) {
                retParts.push(args[objKeys[0]].toString());
            }
            else {
                retParts.push("undefined");
            }
        }
        else {
            objKeys.forEach(objKey => {
                retParts.push(os.EOL);
                retParts.push(`\t${objKey}: `);
                if (args[objKey] !== undefined && args[objKey] !== null) {
                    retParts.push(args[objKey].toString());
                }
                else {
                    retParts.push("undefined");
                }
            });
        }
        return retParts.join("");
    }
    calculateColors(process, noColor) {
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
exports.DisplayLogger = DisplayLogger;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwbGF5TG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCx5QkFBeUI7QUFDekIsOEVBQTJFO0FBRTNFLGdGQUE2RTtBQUU3RTtJQUlJLFlBQVksT0FBdUIsRUFBRSxPQUFnQjtRQUNqRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7WUFFNUIsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzVCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMzQixNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDOUIsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ2pDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMvQixNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDOUIsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBRXJDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUM5QixHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDNUIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVB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Q2hCLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2pCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKO0FBaktELHNDQWlLQyIsImZpbGUiOiJkaXNwbGF5TG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IGNsYXNzXG4gKi9cbmltcG9ydCAqIGFzIG9zIGZyb20gXCJvc1wiO1xuaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9lcnJvckhhbmRsZXJcIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IERlZmF1bHRMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9sb2dnZXJzL2RlZmF1bHRMb2dnZXJcIjtcblxuZXhwb3J0IGNsYXNzIERpc3BsYXlMb2dnZXIgaW1wbGVtZW50cyBJTG9nZ2VyIHtcbiAgICBwcml2YXRlIF9jb2xvcnNPbjogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9jb2xvcnM6IHsgW2lkOiBzdHJpbmddOiB7IHN0YXJ0OiBudW1iZXI7IHN0b3A6IG51bWJlciB9IH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9jZXNzOiBOb2RlSlMuUHJvY2Vzcywgbm9Db2xvcjogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9jb2xvcnNPbiA9IHRoaXMuY2FsY3VsYXRlQ29sb3JzKHByb2Nlc3MsIG5vQ29sb3IpO1xuICAgICAgICB0aGlzLl9jb2xvcnMgPSB7XG4gICAgICAgICAgICByZXNldDogeyBzdGFydDogMCwgc3RvcDogMCB9LFxuXG4gICAgICAgICAgICBib2xkOiB7IHN0YXJ0OiAxLCBzdG9wOiAyMiB9LFxuICAgICAgICAgICAgZGltOiB7IHN0YXJ0OiAyLCBzdG9wOiAyMiB9LFxuICAgICAgICAgICAgaXRhbGljOiB7IHN0YXJ0OiAzLCBzdG9wOiAyMyB9LFxuICAgICAgICAgICAgdW5kZXJsaW5lOiB7IHN0YXJ0OiA0LCBzdG9wOiAyNCB9LFxuICAgICAgICAgICAgaW52ZXJzZTogeyBzdGFydDogNywgc3RvcDogMjcgfSxcbiAgICAgICAgICAgIGhpZGRlbjogeyBzdGFydDogOCwgc3RvcDogMjggfSxcbiAgICAgICAgICAgIHN0cmlrZXRocm91Z2g6IHsgc3RhcnQ6IDksIHN0b3A6IDI5IH0sXG5cbiAgICAgICAgICAgIGJsYWNrOiB7IHN0YXJ0OiAzMCwgc3RvcDogMzkgfSxcbiAgICAgICAgICAgIHJlZDogeyBzdGFydDogMzEsIHN0b3A6IDM5IH0sXG4gICAgICAgICAgICBncmVlbjogeyBzdGFydDogMzIsIHN0b3A6IDM5IH0sXG4gICAgICAgICAgICB5ZWxsb3c6IHsgc3RhcnQ6IDMzLCBzdG9wOiAzOSB9LFxuICAgICAgICAgICAgYmx1ZTogeyBzdGFydDogMzQsIHN0b3A6IDM5IH0sXG4gICAgICAgICAgICBtYWdlbnRhOiB7IHN0YXJ0OiAzNSwgc3RvcDogMzkgfSxcbiAgICAgICAgICAgIGN5YW46IHsgc3RhcnQ6IDM2LCBzdG9wOiAzOSB9LFxuICAgICAgICAgICAgd2hpdGU6IHsgc3RhcnQ6IDM3LCBzdG9wOiAzOSB9LFxuICAgICAgICAgICAgZ3JheTogeyBzdGFydDogOTAsIHN0b3A6IDM5IH0sXG4gICAgICAgICAgICBncmV5OiB7IHN0YXJ0OiA5MCwgc3RvcDogMzkgfSxcblxuICAgICAgICAgICAgYmdCbGFjazogeyBzdGFydDogNDAsIHN0b3A6IDQ5IH0sXG4gICAgICAgICAgICBiZ1JlZDogeyBzdGFydDogNDEsIHN0b3A6IDQ5IH0sXG4gICAgICAgICAgICBiZ0dyZWVuOiB7IHN0YXJ0OiA0Miwgc3RvcDogNDkgfSxcbiAgICAgICAgICAgIGJnWWVsbG93OiB7IHN0YXJ0OiA0Mywgc3RvcDogNDkgfSxcbiAgICAgICAgICAgIGJnQmx1ZTogeyBzdGFydDogNDQsIHN0b3A6IDQ5IH0sXG4gICAgICAgICAgICBiZ01hZ2VudGE6IHsgc3RhcnQ6IDQ1LCBzdG9wOiA0OSB9LFxuICAgICAgICAgICAgYmdDeWFuOiB7IHN0YXJ0OiA0Niwgc3RvcDogNDkgfSxcbiAgICAgICAgICAgIGJnV2hpdGU6IHsgc3RhcnQ6IDQ3LCBzdG9wOiA0OSB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGJhbm5lcihtZXNzYWdlOiBzdHJpbmcsIGFyZ3M/OiB7IFtpZDogc3RyaW5nXTogYW55IH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5KFwiZ3JlZW5cIiwgXCJ3aGl0ZVwiLCBtZXNzYWdlLCBhcmdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5mbyhtZXNzYWdlOiBzdHJpbmcsIGFyZ3M/OiB7IFtpZDogc3RyaW5nXTogYW55IH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5KFwid2hpdGVcIiwgXCJjeWFuXCIsIG1lc3NhZ2UsIGFyZ3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyB3YXJuaW5nKG1lc3NhZ2U6IHN0cmluZywgYXJncz86IHsgW2lkOiBzdHJpbmddOiBhbnkgfSk6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc3BsYXkoXCJ5ZWxsb3dcIiwgXCJjeWFuXCIsIG1lc3NhZ2UsIGFyZ3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIGVycj86IGFueSwgYXJncz86IHsgW2lkOiBzdHJpbmddOiBhbnkgfSk6IHZvaWQge1xuICAgICAgICBsZXQgZmluYWxNZXNzYWdlO1xuICAgICAgICBpZiAobWVzc2FnZSAhPT0gbnVsbCAmJiBtZXNzYWdlICE9PSB1bmRlZmluZWQgJiYgbWVzc2FnZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmaW5hbE1lc3NhZ2UgPSBgRVJST1I6ICR7bWVzc2FnZX1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmluYWxNZXNzYWdlID0gXCJFUlJPUlwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheShcInJlZFwiLCBcInJlZFwiLCBmaW5hbE1lc3NhZ2UsIGFyZ3MpO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBEZWZhdWx0TG9nZ2VyLmxvZyhgJHt0aGlzLmNvbG9yU3RhcnQoXCJyZWRcIil9JHtFcnJvckhhbmRsZXIuZm9ybWF0KGVycil9JHt0aGlzLmNvbG9yU3RvcChcInJlZFwiKX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGlzcGxheShtZXNzYWdlQ29sb3I6IHN0cmluZywgYXJnc0NvbG9yOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgYXJncz86IHsgW2lkOiBzdHJpbmddOiBhbnkgfSk6IHZvaWQge1xuICAgICAgICBpZiAoYXJncyAmJiBPYmplY3Qua2V5cyhhcmdzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZSAhPT0gbnVsbCAmJiBtZXNzYWdlICE9PSB1bmRlZmluZWQgJiYgbWVzc2FnZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgRGVmYXVsdExvZ2dlci5sb2coYCR7dGhpcy5jb2xvclN0YXJ0KG1lc3NhZ2VDb2xvcil9JHttZXNzYWdlfTogJHt0aGlzLmNvbG9yU3RvcChtZXNzYWdlQ29sb3IpfSR7dGhpcy5jb2xvclN0YXJ0KGFyZ3NDb2xvcil9JHt0aGlzLmFycmF5VG9SZWFkYWJsZShhcmdzKX0ke3RoaXMuY29sb3JTdG9wKGFyZ3NDb2xvcil9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIERlZmF1bHRMb2dnZXIubG9nKGAke3RoaXMuY29sb3JTdGFydChhcmdzQ29sb3IpfSR7dGhpcy5hcnJheVRvUmVhZGFibGUoYXJncykudHJpbSgpfSR7dGhpcy5jb2xvclN0b3AoYXJnc0NvbG9yKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlICE9PSBudWxsICYmIG1lc3NhZ2UgIT09IHVuZGVmaW5lZCAmJiBtZXNzYWdlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBEZWZhdWx0TG9nZ2VyLmxvZyhgJHt0aGlzLmNvbG9yU3RhcnQobWVzc2FnZUNvbG9yKX0ke21lc3NhZ2V9JHt0aGlzLmNvbG9yU3RvcChhcmdzQ29sb3IpfWApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBEZWZhdWx0TG9nZ2VyLmxvZyhcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29sb3JTdGFydChjb2xvcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yc09uID8gYFxcdTAwMWJbJHt0aGlzLl9jb2xvcnNbY29sb3JdLnN0YXJ0fW1gIDogXCJcIjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbG9yU3RvcChjb2xvcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yc09uID8gYFxcdTAwMWJbJHt0aGlzLl9jb2xvcnNbY29sb3JdLnN0b3B9bWAgOiBcIlwiO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXJyYXlUb1JlYWRhYmxlKGFyZ3M/OiB7IFtpZDogc3RyaW5nXTogYW55IH0pOiBzdHJpbmcge1xuICAgICAgICBjb25zdCByZXRQYXJ0czogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgY29uc3Qgb2JqS2V5cyA9IE9iamVjdC5rZXlzKGFyZ3MpO1xuICAgICAgICBpZiAob2JqS2V5cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGlmIChhcmdzW29iaktleXNbMF1dICE9PSB1bmRlZmluZWQgJiYgYXJnc1tvYmpLZXlzWzBdXSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldFBhcnRzLnB1c2goYXJnc1tvYmpLZXlzWzBdXS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0UGFydHMucHVzaChcInVuZGVmaW5lZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9iaktleXMuZm9yRWFjaChvYmpLZXkgPT4ge1xuICAgICAgICAgICAgICAgIHJldFBhcnRzLnB1c2gob3MuRU9MKTtcbiAgICAgICAgICAgICAgICByZXRQYXJ0cy5wdXNoKGBcXHQke29iaktleX06IGApO1xuICAgICAgICAgICAgICAgIGlmIChhcmdzW29iaktleV0gIT09IHVuZGVmaW5lZCAmJiBhcmdzW29iaktleV0gICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFBhcnRzLnB1c2goYXJnc1tvYmpLZXldLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldFBhcnRzLnB1c2goXCJ1bmRlZmluZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFBhcnRzLmpvaW4oXCJcIik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVDb2xvcnMocHJvY2VzczogTm9kZUpTLlByb2Nlc3MsIG5vQ29sb3I6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICAgICAgLy8gTG9naWMgY29waWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2NoYWxrL3N1cHBvcnRzLWNvbG9yL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4gICAgICAgIGlmIChub0NvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvY2Vzcykge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Muc3Rkb3V0ICYmICFwcm9jZXNzLnN0ZG91dC5pc1RUWSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJDSVwiIGluIHByb2Nlc3MuZW52KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXCJUUkFWSVNcIiwgXCJDSVJDTEVDSVwiLCBcIkFQUFZFWU9SXCIsIFwiR0lUTEFCX0NJXCJdLnNvbWUoc2lnbiA9PiBzaWduIGluIHByb2Nlc3MuZW52KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoXCJURUFNQ0lUWV9WRVJTSU9OXCIgaW4gcHJvY2Vzcy5lbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC9eKDlcXC4oMCpbMS05XVxcZCopXFwufFxcZHsyLH1cXC4pLy50ZXN0KHByb2Nlc3MuZW52LlRFQU1DSVRZX1ZFUlNJT04pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChcIlRFUk1fUFJPR1JBTVwiIGluIHByb2Nlc3MuZW52KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChbXCJpVGVybS5hcHBcIiwgXCJIeXBlclwiLCBcIkFwcGxlX1Rlcm1pbmFsXCJdLmluZGV4T2YocHJvY2Vzcy5lbnYuVEVSTV9QUk9HUkFNKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgvXihzY3JlZW58eHRlcm0pLTI1Nig/OmNvbG9yKT8vLnRlc3QocHJvY2Vzcy5lbnYuVEVSTSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKC9ec2NyZWVufF54dGVybXxednQxMDB8Y29sb3J8YW5zaXxjeWd3aW58bGludXgvaS50ZXN0KHByb2Nlc3MuZW52LlRFUk0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChcIkNPTE9SVEVSTVwiIGluIHByb2Nlc3MuZW52KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5URVJNID09PSBcImR1bWJcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbiJdfQ==
