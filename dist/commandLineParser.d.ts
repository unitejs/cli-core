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
    hasArgument(argumentName: string): boolean;
}
