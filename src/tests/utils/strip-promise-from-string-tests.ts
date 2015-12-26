import * as assert from "assert";
import {stripPromiseFromString} from "./../../utils/strip-promise-from-string";

describe("stripPromiseFromString", () => {
    it("should get rid of the promise if it's the first index in the string", () => {
        assert.equal(stripPromiseFromString("Promise<string>"), "string");
    });

    it("should get not get rid of the promise if it's not the first index in the string", () => {
        assert.equal(stripPromiseFromString("Array<Promise<string>>"), "Array<Promise<string>>");
    });

    it("should get not get rid of the promise if the last index is not the close brace", () => {
        assert.equal(stripPromiseFromString("Promise<string>[]"), "Promise<string>[]");
    });
});
