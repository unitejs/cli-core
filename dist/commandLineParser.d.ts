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
    getStringArgument<T extends string>(argumentName: string): T | undefined | null;
    getNumberArgument(argumentName: string): number | undefined | null;
    getBooleanArgument(argumentName: string): boolean | undefined | null;
    getStringArrayArgument(argumentName: string): string[] | undefined | null;
    getRemaining(): string[];
    hasArgument(argumentName: string): boolean;
    private trimQuotes;
}
