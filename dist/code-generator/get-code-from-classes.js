var code_block_writer_1 = require("code-block-writer");
var class_writer_1 = require("./class-writer");
var types_dictionary_1 = require("./types-dictionary");
var CLIENT_BASE_NAME = "ClientBase";
function getCodeFromClasses(options) {
    var importWriter = new code_block_writer_1.default();
    var writer = new code_block_writer_1.default();
    var types = new types_dictionary_1.TypesDictionary();
    var libraryName = options.libraryName, classes = options.classes, importMapping = options.importMapping;
    classes.forEach(function (c, classIndex) {
        if (classIndex > 0) {
            writer.newLine();
        }
        var classWriter = new class_writer_1.ClassWriter(c, types, options.classMapping[c.name] || c.name);
        classWriter.writeToWriter(writer);
    });
    importWriter.writeLine("import {" + CLIENT_BASE_NAME + "} from \"" + libraryName + "\";");
    Object.keys(types.getTypes()).forEach(function (typeName) {
        if (typeName === CLIENT_BASE_NAME) {
            throw new Error("Having a type with the name ClientBase is currently not supported. Please use a different type name.");
        }
        else if (importMapping[typeName] == null) {
            throw new Error("An import mapping needs to be specified on the options parameter for '" + typeName + "' when calling getGeneratedCode()");
        }
        importWriter.writeLine("import {" + typeName + "} from \"" + importMapping[typeName] + "\";");
    });
    return importWriter.newLine().toString() + writer.toString();
}
exports.getCodeFromClasses = getCodeFromClasses;

//# sourceMappingURL=get-code-from-classes.js.map
