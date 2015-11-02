var Routes = (function () {
    function Routes(router) {
        var _this = this;
        this.router = router;
        this.routeInitializations.forEach(function (item) {
            item(_this);
        });
    }
    return Routes;
})();
exports.Routes = Routes;
