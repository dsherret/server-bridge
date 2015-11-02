var assert = require("assert");
var strip_promise_from_string_1 = require("./../../utils/strip-promise-from-string");
describe("stripPromiseFromString", function () {
    it("should get rid of the promise if it's the first index in the string", function () {
        assert.equal(strip_promise_from_string_1.stripPromiseFromString("Promise<string>"), "string");
    });
    it("should get not get rid of the promise if it's not the first index in the string", function () {
        assert.equal(strip_promise_from_string_1.stripPromiseFromString("Array<Promise<string>>"), "Array<Promise<string>>");
    });
    it("should get not get rid of the promise if the last index is not the close brace", function () {
        assert.equal(strip_promise_from_string_1.stripPromiseFromString("Promise<string>[]"), "Promise<string>[]");
    });
});
