var path_join_1 = require("./utils/path-join");
function Get(route) {
    if (route === void 0) { route = null; }
    return function (target, methodName, descriptor) {
        target.routeInitializations = target.routeInitializations || [];
        target.routeInitializations.push(function (instance) {
            if (route == null) {
                route = methodName;
            }
            instance.router.get(path_join_1.pathJoin(instance.basePath, route), function (req, res, next) {
                return descriptor.value(req.params).then(function (result) {
                    res.status(200);
                    res.setHeader("Content-Type", "application/json");
                    res.send(JSON.stringify(result));
                }).catch(function (err) { return next(err); });
            });
        });
    };
}
exports.Get = Get;
