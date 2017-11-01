"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Web secure client class
 */
const https = require("https");
class WebSecureClient {
    getText(url, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    if (url === undefined || url === null) {
                        reject("Invalid url");
                    }
                    else {
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
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    getJson(url, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getText(url, timeout).then(text => JSON.parse(text));
        });
    }
}
exports.WebSecureClient = WebSecureClient;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93ZWJTZWN1cmVDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsK0JBQStCO0FBRS9CO0lBQ2lCLE9BQU8sQ0FBQyxHQUFXLEVBQUUsT0FBZ0I7O1lBQzlDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDM0MsSUFBSSxDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDMUIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRTs0QkFDbEMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDOzRCQUNkLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0NBQ3RCLElBQUksSUFBSSxDQUFDLENBQUM7NEJBQ2QsQ0FBQyxDQUFDLENBQUM7NEJBQ0gsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO2dDQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ2xCLENBQUMsQ0FBQyxDQUFDO3dCQUNQLENBQUMsQ0FBQyxDQUFDO3dCQUNILEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQ1YsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQ0FDeEIsdURBQXVEO2dDQUN2RCxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dDQUMzQixNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7b0NBQ3RCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQ0FDaEIsQ0FBQyxDQUFDLENBQUM7NEJBQ1AsQ0FBQyxDQUFDLENBQUM7d0JBQ1AsQ0FBQzt3QkFDRCxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFOzRCQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2hCLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFJLEdBQVcsRUFBRSxPQUFnQjs7WUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyRSxDQUFDO0tBQUE7Q0FDSjtBQXRDRCwwQ0FzQ0MiLCJmaWxlIjoid2ViU2VjdXJlQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBXZWIgc2VjdXJlIGNsaWVudCBjbGFzc1xuICovXG5pbXBvcnQgKiBhcyBodHRwcyBmcm9tIFwiaHR0cHNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYlNlY3VyZUNsaWVudCB7XG4gICAgcHVibGljIGFzeW5jIGdldFRleHQodXJsOiBzdHJpbmcsIHRpbWVvdXQ/OiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwiSW52YWxpZCB1cmxcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVxID0gaHR0cHMuZ2V0KHVybCwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uub24oXCJkYXRhXCIsIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSArPSBkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5vbihcImVuZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5vbihcInNvY2tldFwiLCAoc29ja2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXN0cmluZy1iYXNlZC1zZXQtdGltZW91dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvY2tldC5zZXRUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvY2tldC5vbihcInRpbWVvdXRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXEuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlcS5vbihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGdldEpzb248VD4odXJsOiBzdHJpbmcsIHRpbWVvdXQ/OiBudW1iZXIpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGV4dCh1cmwsIHRpbWVvdXQpLnRoZW4odGV4dCA9PiBKU09OLnBhcnNlKHRleHQpKTtcbiAgICB9XG59XG4iXX0=
