export declare class WebSecureClient {
    getText(url: string, timeout?: number): Promise<string>;
    getJson<T>(url: string, timeout?: number): Promise<T>;
}
