function Use(basePath) {
    if (basePath === void 0) { basePath = ""; }
    return function (target) {
        target.prototype.basePath = basePath;
    };
}
exports.Use = Use;
function Get(route) {
    if (route === void 0) { route = null; }
    return baseMethodRoute(route, 0);
}
exports.Get = Get;
function Post(route) {
    if (route === void 0) { route = null; }
    return baseMethodRoute(route, 1);
}
exports.Post = Post;
function baseMethodRoute(route, method) {
    return function (target, methodName, descriptor) {
        if (route == null) {
            route = methodName;
        }
        target.routeDefinitions = target.routeDefinitions || [];
        target.routeDefinitions.push({
            method: method,
            name: route,
            func: descriptor.value
        });
    };
}

//# sourceMappingURL=decorators.js.map
