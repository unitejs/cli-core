/**
 * Command line parser for CLI
 */
export class CommandLineParser {
    private _interpreter: string;
    private _script: string;
    private _command: string;
    private _arguments: { [id: string]: string | null };

    public parse(argv: string[]): string[] {
        const badParams: string[] = [];
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
                for (let i = argStart; i < argv.length; i++) {
                    let arg = argv[i];
                    if (arg.startsWith("--")) {
                        this._arguments = this._arguments || {};
                        arg = arg.substring(2);
                        const eqIndex: number = arg.indexOf("=");
                        if (eqIndex === -1) {
                            this._arguments[arg] = null;
                        } else {
                            this._arguments[arg.substring(0, eqIndex)] = arg.substring(eqIndex + 1);
                        }
                    } else {
                        badParams.push(arg);
                    }
                }
            }
        }
        return badParams;
    }

    public getInterpreter(): string {
        return this._interpreter;
    }

    public getScript(): string {
        return this._script;
    }

    public getCommand(): string {
        return this._command;
    }

    public getStringArgument(argumentName: string): string | undefined | null {
        if (this.hasArgument(argumentName)) {
            const arg = this._arguments[argumentName];
            delete this._arguments[argumentName];

            if (arg === null) {
                return arg;
            } else {
                if (arg.length >= 2 && arg.startsWith("\"") && arg.endsWith("\"")) {
                    return arg.substring(1, arg.length - 1).trim();
                } else if (arg.length >= 2 && arg.startsWith("'") && arg.endsWith("'")) {
                    return arg.substring(1, arg.length - 1).trim();
                } else {
                    return arg.trim();
                }
            }
        } else {
            return undefined;
        }
    }

    public getNumberArgument(argumentName: string): number | undefined | null {
        if (this.hasArgument(argumentName)) {
            const arg = this._arguments[argumentName];

            // Regex from here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
            if (/^(\-|\+)?([0-9]+(\.[0-9]+)?)$/.test(arg)) {
                delete this._arguments[argumentName];
                return parseFloat(arg);
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    public getBooleanArgument(argumentName: string): boolean | undefined | null {
        if (this.hasArgument(argumentName)) {
            const arg = this._arguments[argumentName];

            if (arg !== null && arg !== undefined && arg.length > 0) {
                if (arg === "true") {
                    delete this._arguments[argumentName];
                    return true;
                } else if (arg === "false") {
                    delete this._arguments[argumentName];
                    return false;
                } else {
                    return undefined;
                }
            } else {
                delete this._arguments[argumentName];
                return true;
            }
        } else {
            return undefined;
        }
    }

    public getRemaining(): string[] {
        const remaining: string[] = [];

        if (this._arguments) {
            const keys = Object.keys(this._arguments);
            keys.forEach(key => {
                remaining.push(`--${key}=${this._arguments[key]}`);
            });
        }

        return remaining;
    }

    public hasArgument(argumentName: string): boolean {
        return this._arguments !== undefined && (argumentName in this._arguments);
    }
}
