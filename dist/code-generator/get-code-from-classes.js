var code_block_writer_1 = require("code-block-writer");
var class_writer_1 = require("./class-writer");
var types_dictionary_1 = require("./types-dictionary");
function getCodeFromClasses(classes, importMapping) {
    var importWriter = new code_block_writer_1.default();
    var writer = new code_block_writer_1.default();
    var types = new types_dictionary_1.TypesDictionary();
    classes.forEach(function (c, classIndex) {
        if (classIndex > 0) {
            writer.newLine();
        }
        var classWriter = new class_writer_1.ClassWriter(c, types);
        classWriter.writeToWriter(writer);
    });
    importWriter.writeLine("import {ClientBase} from \"decorator-routes\"");
    for (var typeName in types.getTypes()) {
        if (importMapping[typeName] == null) {
            throw "An import mapping needs to be specified on the options parameter for '" + typeName + "' when calling getGeneratedCode()";
        }
        importWriter.writeLine("import {" + typeName + "} from \"" + importMapping[typeName] + "\";");
    }
    return importWriter.newLine().toString() + writer.newLine().toString();
}
exports.getCodeFromClasses = getCodeFromClasses;
