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
    getText(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    if (url === undefined || url === null) {
                        reject("Invalid url");
                    }
                    else {
                        https.get(url, response => {
                            let data = "";
                            response.on("data", (d) => {
                                data += d;
                            });
                            response.on("end", () => {
                                resolve(data);
                            });
                            response.on("error", (err) => {
                                reject(err);
                            });
                        });
                    }
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    getJson(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getText(url).then(text => JSON.parse(text));
        });
    }
}
exports.WebSecureClient = WebSecureClient;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93ZWJTZWN1cmVDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsK0JBQStCO0FBRS9CO0lBQ2lCLE9BQU8sQ0FBQyxHQUFXOztZQUM1QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQzNDLElBQUksQ0FBQztvQkFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssU0FBUyxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzFCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUU7NEJBQ3RCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQzs0QkFDZCxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dDQUN0QixJQUFJLElBQUksQ0FBQyxDQUFDOzRCQUNkLENBQUMsQ0FBQyxDQUFDOzRCQUNILFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtnQ0FDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNsQixDQUFDLENBQUMsQ0FBQzs0QkFDSCxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO2dDQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ2hCLENBQUMsQ0FBQyxDQUFDO3dCQUNQLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFJLEdBQVc7O1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDO0tBQUE7Q0FDSjtBQTdCRCwwQ0E2QkMiLCJmaWxlIjoid2ViU2VjdXJlQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBXZWIgc2VjdXJlIGNsaWVudCBjbGFzc1xuICovXG5pbXBvcnQgKiBhcyBodHRwcyBmcm9tIFwiaHR0cHNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYlNlY3VyZUNsaWVudCB7XG4gICAgcHVibGljIGFzeW5jIGdldFRleHQodXJsOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwiSW52YWxpZCB1cmxcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cHMuZ2V0KHVybCwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uub24oXCJkYXRhXCIsIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSArPSBkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5vbihcImVuZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uub24oXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBnZXRKc29uPFQ+KHVybDogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRleHQodXJsKS50aGVuKHRleHQgPT4gSlNPTi5wYXJzZSh0ZXh0KSk7XG4gICAgfVxufVxuIl19
