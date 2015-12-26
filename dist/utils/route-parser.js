var array_utils_1 = require("./array-utils");
var RouteParser = (function () {
    function RouteParser(routeString) {
        this.queryParameters = {};
        this.isHttpString = false;
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
    RouteParser.prototype.getUrl = function (params) {
        if (params === void 0) { params = {}; }
        return this.getUrlPartsString(params) + this.getQueryParametersString(params);
    };
    RouteParser.prototype.getUrlPartsString = function (params) {
        var _this = this;
        var str = "";
        if (this.isHttpString) {
            str += "http://";
        }
        else {
            str += "/";
        }
        return str + this.urlParts.map(function (p) { return _this.fillStringWithParams(p, params); }).join("/");
    };
    RouteParser.prototype.getQueryParametersString = function (params) {
        var queryNames = Object.keys(this.queryParameters);
        var str = "";
        if (queryNames.length > 0) {
            str += "?";
            var paramStrings = [];
            for (var _i = 0; _i < queryNames.length; _i++) {
                var name_1 = queryNames[_i];
                var key = this.fillStringWithParams(name_1, params);
                var value = this.fillStringWithParams(this.queryParameters[name_1], params);
                paramStrings.push(key + "=" + value);
            }
            str += paramStrings.join("&");
        }
        return str;
    };
    RouteParser.prototype.fillStringWithParams = function (str, params) {
        if (str[0] === ":") {
            var paramName = str.substr(1);
            if (typeof params[paramName] !== "undefined") {
                str = params[paramName];
            }
            else {
                throw new Error("The following parameter was not specified: " + paramName);
            }
        }
        return str;
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
        this.isHttpString = /^http:\/\//i.test(url);
        if (this.isHttpString) {
            url = url.substr(7);
        }
        this.urlParts = url.split("/").filter(function (p) { return p.length !== 0; });
    };
    RouteParser.prototype.parseQueryParameters = function (query) {
        var _this = this;
        query.split("&").forEach(function (p) {
            var equalsIndex = p.indexOf("=");
            if (equalsIndex === -1) {
                throw new Error("A query parameter must have an equals sign: " + query);
            }
            var key = p.substr(0, equalsIndex);
            var value = p.substr(equalsIndex + 1);
            if (typeof _this.queryParameters[key] === "undefined") {
                _this.queryParameters[key] = value;
            }
        });
    };
    return RouteParser;
})();
exports.RouteParser = RouteParser;

//# sourceMappingURL=route-parser.js.map
