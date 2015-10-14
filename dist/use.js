function Use(basePath) {
    if (basePath === void 0) { basePath = ""; }
    return function (target) {
        target.prototype.basePath = basePath;
    };
}
exports.Use = Use;
