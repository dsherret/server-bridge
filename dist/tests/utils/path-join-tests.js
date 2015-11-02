var assert = require("assert");
var path_join_1 = require("./../../utils/path-join");
describe("pathJoin", function () {
    it("should add slashes", function () {
        assert.equal(path_join_1.pathJoin("test", "asdf"), "/test/asdf");
    });
    it("should handle extra slashes", function () {
        assert.equal(path_join_1.pathJoin("/test/", "/asdf"), "/test/asdf");
    });
    it("should remove the extra slash on the end", function () {
        assert.equal(path_join_1.pathJoin("/test/", "/asdf/"), "/test/asdf");
    });
    it("should handle a blank parameter and a second parameter with no starting slash", function () {
        assert.equal(path_join_1.pathJoin("", "asdf/"), "/asdf");
    });
    it("should handle a blank parameter and a second parameter starting slash", function () {
        assert.equal(path_join_1.pathJoin("", "/asdf/"), "/asdf");
    });
});
