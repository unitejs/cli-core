"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * File Logger class
 */
const os = require("os");
const errorHandler_1 = require("unitejs-framework/dist/helpers/errorHandler");
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
class FileLogger {
    constructor(logFile, fileSystem) {
        this._fileSystem = fileSystem;
        this._logFolder = this._fileSystem.pathGetDirectory(logFile);
        this._logFile = this._fileSystem.pathGetFilename(logFile);
        this._buffer = "";
    }
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dirExists = yield this._fileSystem.directoryExists(this._logFolder);
                if (!dirExists) {
                    yield this._fileSystem.directoryCreate(this._logFolder);
                }
                const fileExists = yield this._fileSystem.fileExists(this._logFolder, this._logFile);
                if (fileExists) {
                    yield this._fileSystem.fileDelete(this._logFolder, this._logFile);
                }
                this._flushIntervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () { return this.flushData(); }), 200);
            }
            catch (err) {
                throw new Error(`Initialising Log File: ${this._logFile}: ${err.toString()}`);
            }
        });
    }
    closedown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.stopInterval();
            yield this.flushData();
            return Promise.resolve();
        });
    }
    banner(message, args) {
        this.write("===  ", message, args);
    }
    info(message, args) {
        this.write("INFO: ", message, args);
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
        let output = "";
        if (message !== null && message !== undefined && message.length > 0) {
            output += `${type}${message}${os.EOL}`;
        }
        else {
            output += os.EOL;
        }
        if (args) {
            Object.keys(args).forEach((argKey) => {
                const objectJson = jsonHelper_1.JsonHelper.stringify(args[argKey]);
                output += `\t\t${argKey}: ${objectJson}${os.EOL}`;
            });
        }
        this._buffer += output;
    }
    flushData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._buffer.length > 0) {
                try {
                    const localBuffer = this._buffer;
                    this._buffer = "";
                    yield this._fileSystem.fileWriteText(this._logFolder, this._logFile, localBuffer, true);
                }
                catch (err) {
                    this.stopInterval();
                    // tslint:disable-next-line:no-console
                    console.log(`ERROR: Logging To File '${this._logFile}': ${errorHandler_1.ErrorHandler.format(err)}`);
                }
            }
        });
    }
    stopInterval() {
        if (this._flushIntervalId !== undefined) {
            clearInterval(this._flushIntervalId);
            this._flushIntervalId = undefined;
        }
    }
}
exports.FileLogger = FileLogger;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LFFBQVEsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzVGLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3BCLHNDQUFzQztvQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsSUFBSSxDQUFDLFFBQVEsTUFBTSwyQkFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzFGLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sWUFBWTtRQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN0QyxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQztRQUN0QyxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBaEdELGdDQWdHQyIsImZpbGUiOiJmaWxlTG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaWxlIExvZ2dlciBjbGFzc1xuICovXG5pbXBvcnQgKiBhcyBvcyBmcm9tIFwib3NcIjtcbmltcG9ydCB7IEVycm9ySGFuZGxlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvZXJyb3JIYW5kbGVyXCI7XG5pbXBvcnQgeyBKc29uSGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9qc29uSGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcblxuZXhwb3J0IGNsYXNzIEZpbGVMb2dnZXIgaW1wbGVtZW50cyBJTG9nZ2VyIHtcbiAgICBwcml2YXRlIF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcbiAgICBwcml2YXRlIF9sb2dGb2xkZXI6IHN0cmluZztcbiAgICBwcml2YXRlIF9sb2dGaWxlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfYnVmZmVyOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZmx1c2hJbnRlcnZhbElkOiBOb2RlSlMuVGltZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dGaWxlOiBzdHJpbmcsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtKSB7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgICAgICB0aGlzLl9sb2dGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhHZXREaXJlY3RvcnkobG9nRmlsZSk7XG4gICAgICAgIHRoaXMuX2xvZ0ZpbGUgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhHZXRGaWxlbmFtZShsb2dGaWxlKTtcbiAgICAgICAgdGhpcy5fYnVmZmVyID0gXCJcIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRpckV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5RXhpc3RzKHRoaXMuX2xvZ0ZvbGRlcik7XG4gICAgICAgICAgICBpZiAoIWRpckV4aXN0cykge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKHRoaXMuX2xvZ0ZvbGRlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGVFeGlzdHMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHModGhpcy5fbG9nRm9sZGVyLCB0aGlzLl9sb2dGaWxlKTtcblxuICAgICAgICAgICAgaWYgKGZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVEZWxldGUodGhpcy5fbG9nRm9sZGVyLCB0aGlzLl9sb2dGaWxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZmx1c2hJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4gdGhpcy5mbHVzaERhdGEoKSwgMjAwKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluaXRpYWxpc2luZyBMb2cgRmlsZTogJHt0aGlzLl9sb2dGaWxlfTogJHtlcnIudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjbG9zZWRvd24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuc3RvcEludGVydmFsKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuZmx1c2hEYXRhKCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYmFubmVyKG1lc3NhZ2U6IHN0cmluZywgYXJncz86IHsgW2lkOiBzdHJpbmddOiBhbnkgfSk6IHZvaWQge1xuICAgICAgICB0aGlzLndyaXRlKFwiPT09ICBcIiwgbWVzc2FnZSwgYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIGluZm8obWVzc2FnZTogc3RyaW5nLCBhcmdzPzogeyBbaWQ6IHN0cmluZ106IGFueSB9KTogdm9pZCB7XG4gICAgICAgIHRoaXMud3JpdGUoXCJJTkZPOiBcIiwgbWVzc2FnZSwgYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIHdhcm5pbmcobWVzc2FnZTogc3RyaW5nLCBhcmdzPzogeyBbaWQ6IHN0cmluZ106IGFueSB9KTogdm9pZCB7XG4gICAgICAgIHRoaXMud3JpdGUoXCJXQVJOSU5HOiBcIiwgbWVzc2FnZSwgYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgZXJyb3I/OiBhbnksIGFyZ3M/OiB7IFtpZDogc3RyaW5nXTogYW55IH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cml0ZShcIkVSUk9SOiBcIiwgbWVzc2FnZSwgYXJncyk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy53cml0ZShcIkVYQ0VQVElPTjogXCIsIEVycm9ySGFuZGxlci5mb3JtYXQoZXJyb3IpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgd3JpdGUodHlwZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGFyZ3M/OiB7IFtpZDogc3RyaW5nXTogYW55IH0pOiB2b2lkIHtcbiAgICAgICAgbGV0IG91dHB1dCA9IFwiXCI7XG4gICAgICAgIGlmIChtZXNzYWdlICE9PSBudWxsICYmIG1lc3NhZ2UgIT09IHVuZGVmaW5lZCAmJiBtZXNzYWdlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG91dHB1dCArPSBgJHt0eXBlfSR7bWVzc2FnZX0ke29zLkVPTH1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0cHV0ICs9IG9zLkVPTDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJncykuZm9yRWFjaCgoYXJnS2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0SnNvbiA9IEpzb25IZWxwZXIuc3RyaW5naWZ5KGFyZ3NbYXJnS2V5XSk7XG5cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYFxcdFxcdCR7YXJnS2V5fTogJHtvYmplY3RKc29ufSR7b3MuRU9MfWA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2J1ZmZlciArPSBvdXRwdXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBmbHVzaERhdGEoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICh0aGlzLl9idWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbEJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcbiAgICAgICAgICAgICAgICB0aGlzLl9idWZmZXIgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVdyaXRlVGV4dCh0aGlzLl9sb2dGb2xkZXIsIHRoaXMuX2xvZ0ZpbGUsIGxvY2FsQnVmZmVyLCB0cnVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcEludGVydmFsKCk7XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRVJST1I6IExvZ2dpbmcgVG8gRmlsZSAnJHt0aGlzLl9sb2dGaWxlfSc6ICR7RXJyb3JIYW5kbGVyLmZvcm1hdChlcnIpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdG9wSW50ZXJ2YWwoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9mbHVzaEludGVydmFsSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9mbHVzaEludGVydmFsSWQpO1xuICAgICAgICAgICAgdGhpcy5fZmx1c2hJbnRlcnZhbElkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
