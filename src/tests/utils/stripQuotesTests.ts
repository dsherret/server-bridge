import * as assert from "assert";
import {stripQuotes} from "./../../utils";

describe("stripQuotes()", () => {
    it("should remove single quotes from the ends", () => {
        assert.equal(stripQuotes(`'te'st'`), `te'st`);
    });

    it("should remove double quotes from the ends", () => {
        assert.equal(stripQuotes(`"te"st"`), `te"st`);
    });

    it("should not remove anything when there's no quotes on the ends", () => {
        assert.equal(stripQuotes("te'st"), "te'st");
    });

    it("should return an empty string when passed an empty string", () => {
        assert.equal(stripQuotes(""), "");
    });

    it("should return null when passed null", () => {
        assert.equal(stripQuotes(null), null);
    });
});
