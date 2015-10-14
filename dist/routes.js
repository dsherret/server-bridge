var Routes = (function () {
    function Routes(router) {
        var _this = this;
        this.router = router;
        this.routeInitializations.forEach(function (item) {
            item(_this);
        });
    }
    Routes.prototype.getPath = function (route) {
        if (route[0] != "/") {
            route = "/" + route;
        }
        route = this.basePath + route;
        if (route[0] != "/") {
            route = "/" + route;
        }
        return route;
    };
    Routes.initializeRoutes = function (router) {
        var routes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            routes[_i - 1] = arguments[_i];
        }
        routes.forEach(function (route) {
            var routerConstructor = route;
            new routerConstructor(router);
        });
    };
    return Routes;
})();
exports.Routes = Routes;
