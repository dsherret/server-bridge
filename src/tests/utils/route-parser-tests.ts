import * as assert from "assert";
import {RouteParser} from "./../../utils/route-parser";

describe("RouteParser", () => {
    describe("getParameterNames", () => {
        it("should have no parameters when no parameters are specified", () => {
            const parser = new RouteParser("/notes/1");
            assert.equal(parser.getParameterNames().length, 0);
        });

        it("should have the parameter when in the url", () => {
            const parser = new RouteParser("/notes/:myparam");
            assert.equal(parser.getParameterNames()[0], "myparam");
        });

        it("should have the parameter when in the url twice", () => {
            const parser = new RouteParser("/:myparam/:myparam2");
            assert.equal(parser.getParameterNames()[0], "myparam");
            assert.equal(parser.getParameterNames()[1], "myparam2");
        });

        it("should have the parameter when in the query string", () => {
            const parser = new RouteParser("/notes/1?user=:user");
            assert.equal(parser.getParameterNames()[0], "user");
        });

        it("should have the parameter when in the query string twice", () => {
            const parser = new RouteParser("/notes/1?user=:user&date=:date");
            assert.equal(parser.getParameterNames()[0], "user");
            assert.equal(parser.getParameterNames()[1], "date");
        });

        it("should not return a parameter name more than once", () => {
            const parser = new RouteParser("/notes/1?user=:user&date=:user");
            assert.equal(parser.getParameterNames().length, 1);
        });
    });
});
