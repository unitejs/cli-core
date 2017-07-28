/**
 * Tests for FileSystem.
 */
import * as Chai from "chai";
import { FileSystem } from "../../../dist/fileSystem";

describe("FileSystem", () => {
    it("can be created", () => {
        const obj = new FileSystem();
        Chai.should().exist(obj);
    });
});
