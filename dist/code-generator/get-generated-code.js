var get_classes_1 = require("./get-classes");
var get_code_from_classes_1 = require("./get-code-from-classes");
function getGeneratedCode(options) {
    var fileNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fileNames[_i - 1] = arguments[_i];
    }
    var classes = get_classes_1.getClasses.apply(void 0, fileNames);
    var importMapping = options.importMapping, _a = options.libraryName, libraryName = _a === void 0 ? "decorator-routes" : _a;
    return get_code_from_classes_1.getCodeFromClasses({ classes: classes, importMapping: importMapping || {}, libraryName: libraryName });
}
exports.getGeneratedCode = getGeneratedCode;
