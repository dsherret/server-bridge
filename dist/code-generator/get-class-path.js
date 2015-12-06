function getClassPath(classDef) {
    var usePath;
    for (var _i = 0, _a = classDef.decorators; _i < _a.length; _i++) {
        var decorator = _a[_i];
        if (decorator.name === "Use" && decorator.arguments.length > 0) {
            usePath = decorator.arguments[0].text;
            break;
        }
    }
    return usePath;
}
exports.getClassPath = getClassPath;

//# sourceMappingURL=get-class-path.js.map
