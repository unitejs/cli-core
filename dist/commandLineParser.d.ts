/**
 * Command line parser for CLI
 */
export declare class CommandLineParser {
    private _interpreter;
    private _script;
    private _command;
    private _arguments;
    parse(argv: string[]): string[];
    getInterpreter(): string;
    getScript(): string;
    getCommand(): string;
    getStringArgument(argumentName: string): string | undefined | null;
    getNumberArgument(argumentName: string): number | undefined | null;
    getBooleanArgument(argumentName: string): boolean | undefined | null;
    getRemaining(): string[];
    hasArgument(argumentName: string): boolean;
}
