var path_join_1 = require("./utils/path-join");
function Post(route) {
    if (route === void 0) { route = null; }
    return function (target, methodName, descriptor) {
        target.routeInitializations = target.routeInitializations || [];
        target.routeInitializations.push(function (instance) {
            if (route == null) {
                route = methodName;
            }
            instance.router.post(path_join_1.pathJoin(instance.basePath, route), function (req, res, next) {
                var sentObject = req.body;
                return descriptor.value(sentObject).then(function (result) {
                    res.status(200);
                    res.setHeader("Content-Type", "application/json");
                    res.send(JSON.stringify(result));
                }).catch(function (err) { return next(err); });
            });
        });
    };
}
exports.Post = Post;
