"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Display class
 */
const os = require("os");
const errorHandler_1 = require("unitejs-framework/dist/helpers/errorHandler");
// tslint:disable:no-console
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
        this.display("red", "red", `ERROR: ${message ? message : ""}`, args);
        if (err) {
            console.log(this.colorStart("red") + errorHandler_1.ErrorHandler.format(err) + this.colorStop("red"));
        }
    }
    display(messageColor, argsColor, message, args) {
        if (args && Object.keys(args).length > 0) {
            if (message !== null && message !== undefined && message.length > 0) {
                console.log(`${this.colorStart(messageColor)}${message}: ${this.colorStop(messageColor)}${this.colorStart(argsColor)}${this.arrayToReadable(args)}${this.colorStop(argsColor)}`);
            }
            else {
                console.log(`${this.colorStart(argsColor)}${this.arrayToReadable(args)}${this.colorStop(argsColor)}`);
            }
        }
        else {
            if (message !== null && message !== undefined && message.length > 0) {
                console.log(`${this.colorStart(messageColor)}${message}${this.colorStop(argsColor)}`);
            }
            else {
                console.log("");
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
        if (args) {
            const objKeys = Object.keys(args);
            if (objKeys.length === 1) {
                retParts.push(args[objKeys[0]]);
            }
            else {
                objKeys.forEach(objKey => {
                    retParts.push(os.EOL);
                    retParts.push(`    ${objKey}: `);
                    if (args[objKey]) {
                        retParts.push(args[objKey].toString());
                    }
                    else {
                        retParts.push("undefined");
                    }
                });
            }
        }
        return retParts.join("");
    }
    calculateColors(process, noColor) {
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
exports.DisplayLogger = DisplayLogger;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwbGF5TG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCx5QkFBeUI7QUFDekIsOEVBQTJFO0FBRzNFLDRCQUE0QjtBQUM1QjtJQUlJLFlBQVksT0FBdUIsRUFBRSxPQUFnQjtRQUNqRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7WUFFNUIsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzVCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMzQixNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDOUIsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ2pDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMvQixNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDOUIsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBRXJDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUM5QixHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDNUIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzlCLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMvQixJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDN0IsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ2hDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUM3QixLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDOUIsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzdCLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUU3QixPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDaEMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzlCLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUNoQyxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDakMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQy9CLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUNsQyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDL0IsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1NBQ25DLENBQUM7SUFDTixDQUFDO0lBRU0sTUFBTSxDQUFDLE9BQWUsRUFBRSxJQUE0QjtRQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTSxJQUFJLENBQUMsT0FBZSxFQUFFLElBQTRCO1FBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVNLE9BQU8sQ0FBQyxPQUFlLEVBQUUsSUFBNEI7UUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0sS0FBSyxDQUFDLE9BQWUsRUFBRSxHQUFTLEVBQUUsSUFBNEI7UUFDakUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsT0FBTyxHQUFHLE9BQU8sR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLDJCQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzRixDQUFDO0lBQ0wsQ0FBQztJQUVPLE9BQU8sQ0FBQyxZQUFvQixFQUFFLFNBQWlCLEVBQUUsT0FBZSxFQUFFLElBQTRCO1FBQ2xHLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLE9BQU8sS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxRyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFGLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVPLFVBQVUsQ0FBQyxLQUFhO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDeEUsQ0FBQztJQUVPLFNBQVMsQ0FBQyxLQUFhO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDdkUsQ0FBQztJQUVPLGVBQWUsQ0FBQyxJQUE0QjtRQUNoRCxNQUFNLFFBQVEsR0FBYSxFQUFFLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU07b0JBQ2xCLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN0QixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sTUFBTSxJQUFJLENBQUMsQ0FBQztvQkFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDZixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUMzQyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQy9CLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTyxlQUFlLENBQUMsT0FBdUIsRUFBRSxPQUFnQjtRQUM3RCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsZ0RBQWdELENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKO0FBbElELHNDQWtJQyIsImZpbGUiOiJkaXNwbGF5TG9nZ2VyLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
