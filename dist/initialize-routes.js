function initializeRoutes(router, routes) {
    routes.forEach(function (route) {
        var routerConstructor = route;
        new routerConstructor(router);
    });
}
exports.initializeRoutes = initializeRoutes;
