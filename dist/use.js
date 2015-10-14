function Use(basePath) {
    if (basePath === void 0) { basePath = ""; }
    return function (target) {
        target.basePath = basePath;
    };
}
exports.Use = Use;
