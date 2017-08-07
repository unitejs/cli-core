/**
 * Command line parser for CLI
 */
export declare class CommandLineParser {
    private _interpreter;
    private _script;
    private _command;
    private _arguments;
    parse(argv: string[]): void;
    getScript(): string;
    getCommand(): string;
    getArguments(exclude?: string[]): {
        [id: string]: string | null;
    };
    getArgument(argumentName: string): string | null | undefined;
    getNumberArgument(argumentName: string): number | undefined | null;
    getStringArgument(argumentName: string): string | undefined | null;
    hasArgument(argumentName: string): boolean;
}
