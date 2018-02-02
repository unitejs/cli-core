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
const defaultLogger_1 = require("unitejs-framework/dist/loggers/defaultLogger");
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
                    defaultLogger_1.DefaultLogger.log(`ERROR: Logging To File '${this._logFile}': ${errorHandler_1.ErrorHandler.format(err)}`);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9maWxlTG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHlCQUF5QjtBQUN6Qiw4RUFBMkU7QUFDM0UsMEVBQXVFO0FBR3ZFLGdGQUE2RTtBQUU3RTtJQU9JLFlBQVksT0FBZSxFQUFFLFVBQXVCO1FBQ2hELElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFWSxVQUFVOztZQUNuQixJQUFJLENBQUM7Z0JBQ0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDYixNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDNUQsQ0FBQztnQkFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUVyRixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNiLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RFLENBQUM7Z0JBRUQsSUFBSSxDQUFDLGdCQUFn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QUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzVGLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3BCLDZCQUFhLENBQUMsR0FBRyxDQUFDLDJCQUEyQixJQUFJLENBQUMsUUFBUSxNQUFNLDJCQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDaEcsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxZQUFZO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO1FBQ3RDLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUEvRkQsZ0NBK0ZDIiwiZmlsZSI6ImZpbGVMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZpbGUgTG9nZ2VyIGNsYXNzXG4gKi9cbmltcG9ydCAqIGFzIG9zIGZyb20gXCJvc1wiO1xuaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9lcnJvckhhbmRsZXJcIjtcbmltcG9ydCB7IEpzb25IZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2pzb25IZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRGVmYXVsdExvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2xvZ2dlcnMvZGVmYXVsdExvZ2dlclwiO1xuXG5leHBvcnQgY2xhc3MgRmlsZUxvZ2dlciBpbXBsZW1lbnRzIElMb2dnZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xvZ0ZvbGRlcjogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xvZ0ZpbGU6IHN0cmluZztcbiAgICBwcml2YXRlIF9idWZmZXI6IHN0cmluZztcbiAgICBwcml2YXRlIF9mbHVzaEludGVydmFsSWQ6IE5vZGVKUy5UaW1lcjtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ0ZpbGU6IHN0cmluZywgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0pIHtcbiAgICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IGZpbGVTeXN0ZW07XG4gICAgICAgIHRoaXMuX2xvZ0ZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aEdldERpcmVjdG9yeShsb2dGaWxlKTtcbiAgICAgICAgdGhpcy5fbG9nRmlsZSA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aEdldEZpbGVuYW1lKGxvZ0ZpbGUpO1xuICAgICAgICB0aGlzLl9idWZmZXIgPSBcIlwiO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlFeGlzdHModGhpcy5fbG9nRm9sZGVyKTtcbiAgICAgICAgICAgIGlmICghZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlDcmVhdGUodGhpcy5fbG9nRm9sZGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlsZUV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyh0aGlzLl9sb2dGb2xkZXIsIHRoaXMuX2xvZ0ZpbGUpO1xuXG4gICAgICAgICAgICBpZiAoZmlsZUV4aXN0cykge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZURlbGV0ZSh0aGlzLl9sb2dGb2xkZXIsIHRoaXMuX2xvZ0ZpbGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9mbHVzaEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB0aGlzLmZsdXNoRGF0YSgpLCAyMDApO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5pdGlhbGlzaW5nIExvZyBGaWxlOiAke3RoaXMuX2xvZ0ZpbGV9OiAke2Vyci50b1N0cmluZygpfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNsb3NlZG93bigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5zdG9wSW50ZXJ2YWwoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5mbHVzaERhdGEoKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBiYW5uZXIobWVzc2FnZTogc3RyaW5nLCBhcmdzPzogeyBbaWQ6IHN0cmluZ106IGFueSB9KTogdm9pZCB7XG4gICAgICAgIHRoaXMud3JpdGUoXCI9PT0gIFwiLCBtZXNzYWdlLCBhcmdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5mbyhtZXNzYWdlOiBzdHJpbmcsIGFyZ3M/OiB7IFtpZDogc3RyaW5nXTogYW55IH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cml0ZShcIklORk86IFwiLCBtZXNzYWdlLCBhcmdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgd2FybmluZyhtZXNzYWdlOiBzdHJpbmcsIGFyZ3M/OiB7IFtpZDogc3RyaW5nXTogYW55IH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cml0ZShcIldBUk5JTkc6IFwiLCBtZXNzYWdlLCBhcmdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nLCBlcnJvcj86IGFueSwgYXJncz86IHsgW2lkOiBzdHJpbmddOiBhbnkgfSk6IHZvaWQge1xuICAgICAgICB0aGlzLndyaXRlKFwiRVJST1I6IFwiLCBtZXNzYWdlLCBhcmdzKTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLndyaXRlKFwiRVhDRVBUSU9OOiBcIiwgRXJyb3JIYW5kbGVyLmZvcm1hdChlcnJvcikpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB3cml0ZSh0eXBlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgYXJncz86IHsgW2lkOiBzdHJpbmddOiBhbnkgfSk6IHZvaWQge1xuICAgICAgICBsZXQgb3V0cHV0ID0gXCJcIjtcbiAgICAgICAgaWYgKG1lc3NhZ2UgIT09IG51bGwgJiYgbWVzc2FnZSAhPT0gdW5kZWZpbmVkICYmIG1lc3NhZ2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgb3V0cHV0ICs9IGAke3R5cGV9JHttZXNzYWdlfSR7b3MuRU9MfWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gb3MuRU9MO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhcmdzKS5mb3JFYWNoKChhcmdLZXkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RKc29uID0gSnNvbkhlbHBlci5zdHJpbmdpZnkoYXJnc1thcmdLZXldKTtcblxuICAgICAgICAgICAgICAgIG91dHB1dCArPSBgXFx0XFx0JHthcmdLZXl9OiAke29iamVjdEpzb259JHtvcy5FT0x9YDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYnVmZmVyICs9IG91dHB1dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGZsdXNoRGF0YSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHRoaXMuX2J1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsQnVmZmVyID0gdGhpcy5fYnVmZmVyO1xuICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlV3JpdGVUZXh0KHRoaXMuX2xvZ0ZvbGRlciwgdGhpcy5fbG9nRmlsZSwgbG9jYWxCdWZmZXIsIHRydWUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wSW50ZXJ2YWwoKTtcbiAgICAgICAgICAgICAgICBEZWZhdWx0TG9nZ2VyLmxvZyhgRVJST1I6IExvZ2dpbmcgVG8gRmlsZSAnJHt0aGlzLl9sb2dGaWxlfSc6ICR7RXJyb3JIYW5kbGVyLmZvcm1hdChlcnIpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdG9wSW50ZXJ2YWwoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9mbHVzaEludGVydmFsSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9mbHVzaEludGVydmFsSWQpO1xuICAgICAgICAgICAgdGhpcy5fZmx1c2hJbnRlcnZhbElkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
