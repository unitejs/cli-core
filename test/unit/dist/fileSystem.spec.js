"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for FileSystem.
 */
const Chai = require("chai");
const fileSystem_1 = require("../../../dist/fileSystem");
describe("FileSystem", () => {
    it("can be created", () => {
        const obj = new fileSystem_1.FileSystem();
        Chai.should().exist(obj);
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZmlsZVN5c3RlbS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IseURBQXNEO0FBRXRELFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFDbkIsRUFBRSxDQUFDLGdCQUFnQixFQUFFO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJmaWxlU3lzdGVtLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBGaWxlU3lzdGVtLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSBcIi4uLy4uLy4uL2Rpc3QvZmlsZVN5c3RlbVwiO1xuXG5kZXNjcmliZShcIkZpbGVTeXN0ZW1cIiwgKCkgPT4ge1xuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbSgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG59KTtcbiJdfQ==
