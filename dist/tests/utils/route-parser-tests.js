var assert = require("assert");
var route_parser_1 = require("./../../utils/route-parser");
describe("RouteParser", function () {
    describe("constructor()", function () {
        it("should throw an error when someone provides no value for a query param", function () {
            assert.throws(function () {
                new route_parser_1.RouteParser("/notes?myVal");
            }, Error, "A query parameter must have an equals sign: myVal");
        });
    });
    describe("getParameterNames()", function () {
        it("should have no parameters when no parameters are specified", function () {
            var parser = new route_parser_1.RouteParser("/notes/1");
            assert.equal(parser.getParameterNames().length, 0);
        });
        it("should have the parameter when in the url", function () {
            var parser = new route_parser_1.RouteParser("/notes/:myparam");
            assert.equal(parser.getParameterNames()[0], "myparam");
        });
        it("should have the parameter when in the url twice", function () {
            var parser = new route_parser_1.RouteParser("/:myparam/:myparam2");
            assert.equal(parser.getParameterNames()[0], "myparam");
            assert.equal(parser.getParameterNames()[1], "myparam2");
        });
        it("should have the parameter when in the query string", function () {
            var parser = new route_parser_1.RouteParser("/notes/1?user=:user");
            assert.equal(parser.getParameterNames()[0], "user");
        });
        it("should have the parameter when in the query string twice", function () {
            var parser = new route_parser_1.RouteParser("/notes/1?user=:user&date=:date");
            assert.equal(parser.getParameterNames()[0], "user");
            assert.equal(parser.getParameterNames()[1], "date");
        });
        it("should not return a parameter name more than once", function () {
            var parser = new route_parser_1.RouteParser("/notes/1?user=:user&date=:user");
            assert.equal(parser.getParameterNames().length, 1);
        });
    });
    describe("getUrl()", function () {
        it("should work with just url parts", function () {
            var parser = new route_parser_1.RouteParser("/notes/1");
            assert.equal(parser.getUrl(), "/notes/1");
        });
        it("should ignore trailing slash", function () {
            var parser = new route_parser_1.RouteParser("/notes/1/");
            assert.equal(parser.getUrl(), "/notes/1");
        });
        it("should add a slash at the beginning when not starting with http://", function () {
            var parser = new route_parser_1.RouteParser("notes/1");
            assert.equal(parser.getUrl(), "/notes/1");
        });
        it("should not add slash at the beginning when starting with http://", function () {
            var parser = new route_parser_1.RouteParser("http://test.com/notes/1");
            assert.equal(parser.getUrl(), "http://test.com/notes/1");
        });
        it("should work with one query parameter", function () {
            var parser = new route_parser_1.RouteParser("/notes/1?myparam=test");
            assert.equal(parser.getUrl(), "/notes/1?myparam=test");
        });
        it("should work with multiple query parameters", function () {
            var parser = new route_parser_1.RouteParser("/notes/1?myparam=test&myotherparam=t");
            assert.equal(parser.getUrl(), "/notes/1?myparam=test&myotherparam=t");
        });
        it("should strip a duplicate query parameter", function () {
            var parser = new route_parser_1.RouteParser("/notes/1?myparam=test&myparam=something");
            assert.equal(parser.getUrl(), "/notes/1?myparam=test");
        });
    });
    describe("getUrl(params)", function () {
        it("should replace the url string values", function () {
            var parser = new route_parser_1.RouteParser("/notes/:noteID");
            assert.equal(parser.getUrl({ noteID: "5" }), "/notes/5");
        });
        it("should replace the url string values", function () {
            var parser = new route_parser_1.RouteParser("/notes/:noteID");
            assert.equal(parser.getUrl({ noteID: "5" }), "/notes/5");
        });
        it("should replace the query parameter values", function () {
            var parser = new route_parser_1.RouteParser("/notes/1?myparam=:value&otherone=:other");
            assert.equal(parser.getUrl({ value: "test", other: "something" }), "/notes/1?myparam=test&otherone=something");
        });
        it("should replace the query parameter keys", function () {
            var parser = new route_parser_1.RouteParser("/notes/1?:key=value&:other=other");
            assert.equal(parser.getUrl({ key: "test", other: "something" }), "/notes/1?test=value&something=other");
        });
        it("should throw an error when not specifying a key", function () {
            var parser = new route_parser_1.RouteParser("/notes/1?:key=value");
            assert.throws(function () {
                parser.getUrl();
            }, Error, "The following parameter was not specified: key");
        });
    });
});

//# sourceMappingURL=route-parser-tests.js.map
