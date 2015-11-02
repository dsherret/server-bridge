var get_classes_1 = require("./get-classes");
var get_code_from_classes_1 = require("./get-code-from-classes");
var get_documentation_1 = require("./get-documentation");
function getGeneratedCode(options) {
    var fileNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fileNames[_i - 1] = arguments[_i];
    }
    var classes = get_classes_1.getClasses.apply(void 0, fileNames);
    var classMapping = options.classMapping, importMapping = options.importMapping, _a = options.libraryName, libraryName = _a === void 0 ? "server-bridge-superagent-client" : _a;
    return get_documentation_1.getDocumentation({ libraryName: libraryName }) +
        get_code_from_classes_1.getCodeFromClasses({ classes: classes, importMapping: importMapping || {}, classMapping: classMapping || {}, libraryName: libraryName });
}
exports.getGeneratedCode = getGeneratedCode;
