var array_utils_1 = require("./array-utils");
var RouteParser = (function () {
    function RouteParser(routeString) {
        this.queryParameters = {};
        this.parse(routeString);
    }
    RouteParser.prototype.getParameterNames = function () {
        var _this = this;
        var queryParameterKeys = Object.keys(this.queryParameters);
        var queryParameterValues = queryParameterKeys.map(function (k) { return _this.queryParameters[k]; });
        var parameterNames = this.urlParts.filter(function (p) { return p[0] === ":"; })
            .concat(queryParameterKeys.filter(function (n) { return n[0] === ":"; }))
            .concat(queryParameterValues.filter(function (v) { return v[0] === ":"; }))
            .map(function (p) { return p.substr(1); });
        return array_utils_1.ArrayUtils.getUniqueInStringArray(parameterNames);
    };
    RouteParser.prototype.parse = function (routeString) {
        var questionMarkIndex = routeString.indexOf("?");
        if (questionMarkIndex >= 0) {
            this.parseUrlParts(routeString.substr(0, questionMarkIndex));
            this.parseQueryParameters(routeString.substr(questionMarkIndex + 1));
        }
        else {
            this.parseUrlParts(routeString);
        }
    };
    RouteParser.prototype.parseUrlParts = function (url) {
        this.urlParts = url.split("/").filter(function (p) { return p.length !== 0; });
    };
    RouteParser.prototype.parseQueryParameters = function (query) {
        var _this = this;
        query.split("&").forEach(function (p) {
            var equalsIndex = p.indexOf("=");
            if (equalsIndex === -1) {
                throw new Error("A query parameter must have an equals sign: " + query);
            }
            _this.queryParameters[p.substr(0, equalsIndex)] = p.substr(equalsIndex + 1);
        });
    };
    return RouteParser;
})();
exports.RouteParser = RouteParser;

//# sourceMappingURL=route-parser.js.map
