"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Logger class
 */
const fs = require("fs");
const os = require("os");
const errorHandler_1 = require("unitejs-framework/dist/helpers/errorHandler");
class FileLogger {
    constructor(logFile) {
        this._logFile = logFile;
        try {
            if (fs.existsSync(this._logFile)) {
                fs.unlinkSync(this._logFile);
            }
        }
        catch (err) {
            // tslint:disable-next-line:no-console
            console.error(`Error Deleting Log File: ${err}`);
        }
    }
    banner(message, error, args) {
        this.write("===  ", message, args);
    }
    info(message, args) {
        this.write("LOG: ", message, args);
    }
    warning(message, args) {
        this.write("WARNING: ", message, args);
    }
    error(message, error, args) {
        this.write("ERROR: ", message, args);
        if (error) {
            this.write("EXCEPTION: ", errorHandler_1.ErrorHandler.format(error));
        }
    }
    write(type, message, args) {
        try {
            let output = "";
            if (message !== null && message !== undefined && message.length > 0) {
                output += `${type}${message}${os.EOL}`;
            }
            else {
                output += os.EOL;
            }
            if (args) {
                Object.keys(args).forEach((argKey) => {
                    const cache = [];
                    const objectJson = JSON.stringify(args[argKey], (key, value) => {
                        if (typeof value === "object" && value !== null && value !== undefined) {
                            if (cache.indexOf(value) !== -1) {
                                // circular reference found, discard key
                                return;
                            }
                            else {
                                cache.push(value);
                            }
                        }
                        return value;
                    });
                    output += `\t\t${argKey}: ${objectJson}${os.EOL}`;
                });
            }
            fs.appendFileSync(this._logFile, output);
        }
        catch (err) {
            // tslint:disable-next-line:no-console
            console.error(`Error Logging: ${err}`);
        }
    }
}
exports.FileLogger = FileLogger;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ0osS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDdEIsQ0FBQzt3QkFDTCxDQUFDO3dCQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7b0JBQ2pCLENBQUMsQ0FBQyxDQUFDO29CQUVILE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN0RCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDWCxzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMzQyxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBcEVELGdDQW9FQyIsImZpbGUiOiJmaWxlTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
