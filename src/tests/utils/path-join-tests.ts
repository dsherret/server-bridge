import * as assert from "assert";
import {pathJoin} from "./../../utils/path-join";

describe("pathJoin", () => {
    it("should add slashes", () => {
        assert.equal(pathJoin("test", "asdf"), "/test/asdf");
    });

    it("should handle extra slashes", () => {
        assert.equal(pathJoin("/test/", "/asdf"), "/test/asdf");
    });

    it("should remove the extra slash on the end", () => {
        assert.equal(pathJoin("/test/", "/asdf/"), "/test/asdf");
    });

    it("should handle a blank parameter and a second parameter with no starting slash", () => {
        assert.equal(pathJoin("", "asdf/"), "/asdf");
    });

    it("should handle a blank parameter and a second parameter starting slash", () => {
        assert.equal(pathJoin("", "/asdf/"), "/asdf");
    });
});
