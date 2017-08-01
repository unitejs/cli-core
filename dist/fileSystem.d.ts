import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
export declare class FileSystem implements IFileSystem {
    pathCombine(pathName: string, additional: string): string;
    pathDirectoryRelative(pathName1: string, pathName2: string): string;
    pathFileRelative(pathName1: string, pathName2: string): string;
    pathToWeb(pathName: string): string;
    pathFormat(pathName: string): string;
    pathGetDirectory(pathName: string): string;
    pathGetFilename(pathName: string): string;
    directoryExists(directoryName: string): Promise<boolean>;
    directoryCreate(directoryName: string): Promise<void>;
    directoryDelete(directoryName: string): Promise<void>;
    fileExists(directoryName: string, fileName: string): Promise<boolean>;
    fileWriteJson(directoryName: string, fileName: string, object: any): Promise<void>;
    fileWriteLines(directoryName: string, fileName: string, lines: string[]): Promise<void>;
    fileWriteBinary(directoryName: string, fileName: string, data: Uint8Array): Promise<void>;
    fileReadJson<T>(directoryName: string, fileName: string): Promise<T>;
    fileReadLines(directoryName: string, fileName: string): Promise<string[]>;
    fileReadBinary(directoryName: string, fileName: string): Promise<Uint8Array>;
    fileDelete(directoryName: string, fileName: string): Promise<void>;
    private cleanupSeparators(pathName);
}
