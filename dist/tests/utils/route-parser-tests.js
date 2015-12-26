var assert = require("assert");
var route_parser_1 = require("./../../utils/route-parser");
describe("RouteParser", function () {
    describe("getParameterNames", function () {
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
});

//# sourceMappingURL=route-parser-tests.js.map
