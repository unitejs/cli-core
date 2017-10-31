/**
 * Web secure client class
 */
import * as https from "https";

export class WebSecureClient {
    public async getText(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                if (url === undefined || url === null) {
                    reject("Invalid url");
                } else {
                    let data = "";
                    const response = https.get(url);
                    response.on("data", (d) => {
                        data += d;
                    });
                    response.on("end", () => {
                        resolve(data);
                    });
                    response.on("error", (err) => {
                        reject(err);
                    });
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    public async getJson<T>(url: string): Promise<T> {
        return this.getText(url).then(text => JSON.parse(text));
    }
}
