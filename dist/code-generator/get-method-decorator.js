function getMethodDecorator(method) {
    var methodDecorator;
    for (var _i = 0, _a = method.decorators; _i < _a.length; _i++) {
        var decorator = _a[_i];
        if (decorator.name === "Post" || decorator.name === "Get") {
            methodDecorator = decorator;
            break;
        }
    }
    return methodDecorator;
}
exports.getMethodDecorator = getMethodDecorator;

//# sourceMappingURL=get-method-decorator.js.map
