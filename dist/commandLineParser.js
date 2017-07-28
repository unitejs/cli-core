"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandLineParser {
    parse(argv) {
        if (argv) {
            if (argv.length > 0) {
                this._interpreter = argv[0];
            }
            if (argv.length > 1) {
                this._script = argv[1];
            }
            let argStart = 2;
            if (argv.length > 2) {
                if (!argv[2].startsWith("--")) {
                    this._command = argv[2];
                    argStart++;
                }
            }
            if (argv.length > argStart) {
                this._arguments = {};
                for (let i = argStart; i < argv.length; i++) {
                    let arg = argv[i];
                    if (arg.startsWith("--")) {
                        arg = arg.substring(2);
                        const eqIndex = arg.indexOf("=");
                        if (eqIndex === -1) {
                            this._arguments[arg] = null;
                        }
                        else {
                            this._arguments[arg.substring(0, eqIndex)] = arg.substring(eqIndex + 1);
                        }
                    }
                }
            }
        }
    }
    getScript() {
        return this._script;
    }
    getCommand() {
        return this._command;
    }
    getArguments(exclude) {
        if (this._arguments && exclude && exclude.length > 0) {
            const newArgs = {};
            Object.keys(this._arguments)
                .filter((argKey) => exclude.indexOf(argKey) === -1)
                .forEach((argKey) => {
                newArgs[argKey] = this._arguments[argKey];
            });
            return newArgs;
        }
        else {
            return this._arguments;
        }
    }
    getArgument(argumentName) {
        return this._arguments ? this._arguments[argumentName] : undefined;
    }
    getNumberArgument(argumentName) {
        const arg = this.getArgument(argumentName);
        if (arg === undefined) {
            return undefined;
        }
        else if (arg === null) {
            return null;
        }
        else {
            const val = parseInt(arg, 10);
            return isNaN(val) ? undefined : val;
        }
    }
    getStringArgument(argumentName) {
        const arg = this.getArgument(argumentName);
        if (arg === undefined) {
            return undefined;
        }
        else if (arg === null) {
            return null;
        }
        else {
            if (arg.length >= 2 && arg.startsWith("\"") && arg.endsWith("\"")) {
                return arg.substring(1, arg.length - 2).trim();
            }
            else {
                return arg.trim();
            }
        }
    }
    hasArgument(argumentName) {
        return this._arguments && argumentName in this._arguments;
    }
    diagnostics(display) {
        display.diagnostics(`Interpreter: ${this._interpreter ? this._interpreter : "Unknown"}`);
        display.diagnostics(`Script: ${this._script ? this._script : "Unknown"}`);
        display.diagnostics(`Command: ${this._command ? this._command : "Unknown"}`);
        display.diagnostics(`Arguments: ${this._arguments ? JSON.stringify(this._arguments) : "None"}`);
    }
}
exports.CommandLineParser = CommandLineParser;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kTGluZVBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBO0lBTVcsS0FBSyxDQUFDLElBQWM7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQztZQUNELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztZQUNqQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QixRQUFRLEVBQUUsQ0FBQztnQkFDZixDQUFDO1lBQ0wsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0JBRXJCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUMxQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsTUFBTSxPQUFPLEdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDekMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDakIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7d0JBQ2hDLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUM1RSxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVNLFNBQVM7UUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRU0sVUFBVTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxZQUFZLENBQUMsT0FBa0I7UUFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sT0FBTyxHQUFvQyxFQUFFLENBQUM7WUFFcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2lCQUN2QixNQUFNLENBQUMsQ0FBQyxNQUFNLEtBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDbEQsT0FBTyxDQUFDLENBQUMsTUFBTTtnQkFDWixPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QyxDQUFDLENBQUMsQ0FBQztZQUVQLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDM0IsQ0FBQztJQUNMLENBQUM7SUFFTSxXQUFXLENBQUMsWUFBb0I7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDdkUsQ0FBQztJQUVNLGlCQUFpQixDQUFDLFlBQW9CO1FBQ3pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFM0MsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUU5QixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFDeEMsQ0FBQztJQUNMLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxZQUFvQjtRQUN6QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTNDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25ELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3RCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVNLFdBQVcsQ0FBQyxZQUFvQjtRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxZQUFZLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUM5RCxDQUFDO0lBRU0sV0FBVyxDQUFDLE9BQWlCO1FBQ2hDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUMxRSxPQUFPLENBQUMsV0FBVyxDQUFDLFlBQVksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDN0UsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNwRyxDQUFDO0NBQ0o7QUE1R0QsOENBNEdDIiwiZmlsZSI6ImNvbW1hbmRMaW5lUGFyc2VyLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
