import * as assert from "assert";
import {ArrayUtils} from "./../../utils";

describe("ArrayUtils", () => {
    describe("#getUniqueInStringArray()", () => {
        it("should only return unique items", () => {
            assert.equal(ArrayUtils.getUniqueInStringArray(["test", "test", "test2"]).length, 2);
        });
    });
});
