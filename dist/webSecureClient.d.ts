export declare class WebSecureClient {
    getText(url: string): Promise<string>;
    getJson<T>(url: string): Promise<T>;
}
