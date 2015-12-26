import * as assert from "assert";
import {RouteParser} from "./../../utils/route-parser";

describe("RouteParser", () => {
    describe("constructor()", () => {
        it("should throw an error when someone provides no value for a query param", () => {
            assert.throws(() => {
                /* tslint:disable */
                new RouteParser("/notes?myVal");
                /* tslint:enable */
            }, Error, "A query parameter must have an equals sign: myVal");
        });
    });

    describe("getParameterNames()", () => {
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

    describe("getUrl()", () => {
        it("should work with just url parts", () => {
            const parser = new RouteParser("/notes/1");
            assert.equal(parser.getUrl(), "/notes/1");
        });

        it("should ignore trailing slash", () => {
            const parser = new RouteParser("/notes/1/");
            assert.equal(parser.getUrl(), "/notes/1");
        });

        it("should add a slash at the beginning when not starting with http://", () => {
            const parser = new RouteParser("notes/1");
            assert.equal(parser.getUrl(), "/notes/1");
        });

        it("should not add slash at the beginning when starting with http://", () => {
            const parser = new RouteParser("http://test.com/notes/1");
            assert.equal(parser.getUrl(), "http://test.com/notes/1");
        });

        it("should work with one query parameter", () => {
            const parser = new RouteParser("/notes/1?myparam=test");
            assert.equal(parser.getUrl(), "/notes/1?myparam=test");
        });

        it("should work with multiple query parameters", () => {
            const parser = new RouteParser("/notes/1?myparam=test&myotherparam=t");
            assert.equal(parser.getUrl(), "/notes/1?myparam=test&myotherparam=t");
        });

        it("should strip a duplicate query parameter", () => {
            const parser = new RouteParser("/notes/1?myparam=test&myparam=something");
            assert.equal(parser.getUrl(), "/notes/1?myparam=test");
        });
    });

    describe("getUrl(params)", () => {
        it("should replace the url string values", () => {
            const parser = new RouteParser("/notes/:noteID");
            assert.equal(parser.getUrl({ noteID: "5" }), "/notes/5");
        });

        it("should replace the url string values", () => {
            const parser = new RouteParser("/notes/:noteID");
            assert.equal(parser.getUrl({ noteID: "5" }), "/notes/5");
        });

        it("should replace the query parameter values", () => {
            const parser = new RouteParser("/notes/1?myparam=:value&otherone=:other");
            assert.equal(parser.getUrl({ value: "test", other: "something" }), "/notes/1?myparam=test&otherone=something");
        });

        it("should replace the query parameter keys", () => {
            const parser = new RouteParser("/notes/1?:key=value&:other=other");
            assert.equal(parser.getUrl({ key: "test", other: "something" }), "/notes/1?test=value&something=other");
        });

        it("should throw an error when not specifying a key", () => {
            const parser = new RouteParser("/notes/1?:key=value");
            assert.throws(() => {
                parser.getUrl();
            }, Error, "The following parameter was not specified: key");
        });
    });
});
