var assert = require("assert");
var array_utils_1 = require("./../../utils/array-utils");
describe("ArrayUtils", function () {
    describe("getUniqueInStringArray", function () {
        it("should only return unique items", function () {
            assert.equal(array_utils_1.ArrayUtils.getUniqueInStringArray(["test", "test", "test2"]).length, 2);
        });
    });
});

//# sourceMappingURL=array-utils-tests.js.map
