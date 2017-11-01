/**
 * Web secure client class
 */
import * as https from "https";

export class WebSecureClient {
    public async getText(url: string, timeout?: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                if (url === undefined || url === null) {
                    reject("Invalid url");
                } else {
                    const req = https.get(url, response => {
                        let data = "";
                        response.on("data", (d) => {
                            data += d;
                        });
                        response.on("end", () => {
                            resolve(data);
                        });
                    });
                    if (timeout) {
                        req.on("socket", (socket) => {
                            // tslint:disable-next-line:no-string-based-set-timeout
                            socket.setTimeout(timeout);
                            socket.on("timeout", () => {
                                req.abort();
                            });
                        });
                    }
                    req.on("error", (err) => {
                        reject(err);
                    });
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    public async getJson<T>(url: string, timeout?: number): Promise<T> {
        return this.getText(url, timeout).then(text => JSON.parse(text));
    }
}
