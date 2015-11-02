function pathJoin() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i - 0] = arguments[_i];
    }
    return paths.map(function (p) { return handleSlashes(p); }).reduce(function (a, b) { return a + b; });
}
exports.pathJoin = pathJoin;
function handleSlashes(str) {
    if (typeof str === "string" && str.length > 0) {
        if (str[0] != "/") {
            str = "/" + str;
        }
        if (str[str.length - 1] === "/") {
            str = str.substr(0, str.length - 1);
        }
    }
    return str;
}
