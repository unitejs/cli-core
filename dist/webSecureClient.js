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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93ZWJTZWN1cmVDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsK0JBQStCO0FBRS9CLE1BQWEsZUFBZTtJQUNYLE9BQU8sQ0FBQyxHQUFXLEVBQUUsT0FBZ0I7O1lBQzlDLE9BQU8sSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQzNDLElBQUk7b0JBQ0EsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7d0JBQ25DLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztxQkFDekI7eUJBQU07d0JBQ0gsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUU7NEJBQ2xDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQzs0QkFDZCxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dDQUN0QixJQUFJLElBQUksQ0FBQyxDQUFDOzRCQUNkLENBQUMsQ0FBQyxDQUFDOzRCQUNILFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtnQ0FDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNsQixDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDLENBQUMsQ0FBQzt3QkFDSCxJQUFJLE9BQU8sRUFBRTs0QkFDVCxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dDQUN4Qix1REFBdUQ7Z0NBQ3ZELE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7Z0NBQzNCLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtvQ0FDdEIsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO2dDQUNoQixDQUFDLENBQUMsQ0FBQzs0QkFDUCxDQUFDLENBQUMsQ0FBQzt5QkFDTjt3QkFDRCxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFOzRCQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2hCLENBQUMsQ0FBQyxDQUFDO3FCQUNOO2lCQUNKO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDZjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFJLEdBQVcsRUFBRSxPQUFnQjs7WUFDakQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDckUsQ0FBQztLQUFBO0NBQ0o7QUF0Q0QsMENBc0NDIiwiZmlsZSI6IndlYlNlY3VyZUNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogV2ViIHNlY3VyZSBjbGllbnQgY2xhc3NcbiAqL1xuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSBcImh0dHBzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJTZWN1cmVDbGllbnQge1xuICAgIHB1YmxpYyBhc3luYyBnZXRUZXh0KHVybDogc3RyaW5nLCB0aW1lb3V0PzogbnVtYmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAodXJsID09PSB1bmRlZmluZWQgfHwgdXJsID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChcIkludmFsaWQgdXJsXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcSA9IGh0dHBzLmdldCh1cmwsIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm9uKFwiZGF0YVwiLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgKz0gZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uub24oXCJlbmRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXEub24oXCJzb2NrZXRcIiwgKHNvY2tldCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zdHJpbmctYmFzZWQtc2V0LXRpbWVvdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb2NrZXQuc2V0VGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb2NrZXQub24oXCJ0aW1lb3V0XCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXEub24oXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBnZXRKc29uPFQ+KHVybDogc3RyaW5nLCB0aW1lb3V0PzogbnVtYmVyKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRleHQodXJsLCB0aW1lb3V0KS50aGVuKHRleHQgPT4gSlNPTi5wYXJzZSh0ZXh0KSk7XG4gICAgfVxufVxuIl19
