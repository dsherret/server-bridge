var get_classes_1 = require("./get-classes");
var get_code_from_classes_1 = require("./get-code-from-classes");
var get_documentation_1 = require("./get-documentation");
function getGeneratedCode(options, fileNames) {
    var classes = get_classes_1.getClasses(fileNames);
    var classMapping = options.classMapping, importMapping = options.importMapping, _a = options.libraryName, libraryName = _a === void 0 ? "server-bridge-superagent-client" : _a, _b = options.includeDocumentation, includeDocumentation = _b === void 0 ? true : _b;
    return (includeDocumentation ? get_documentation_1.getDocumentation({ libraryName: libraryName }) : "") +
        get_code_from_classes_1.getCodeFromClasses({ classes: classes, importMapping: importMapping || {}, classMapping: classMapping || {}, libraryName: libraryName });
}
exports.getGeneratedCode = getGeneratedCode;

//# sourceMappingURL=get-generated-code.js.map
