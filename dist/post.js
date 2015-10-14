function Post(route) {
    if (route === void 0) { route = null; }
    return function (target, methodName, descriptor) {
        target.routeInitializations = target.routeInitializations || [];
        target.routeInitializations.push(function (instance) {
            if (route == null) {
                route = methodName;
            }
            instance.router.post(instance.getPath(route), function (req, res, next) {
                var sentObject = req.body;
                return descriptor.value(sentObject).then(function (result) {
                    res.send(result);
                }).catch(function (err) { return next(err); });
            });
        });
    };
}
exports.Post = Post;
