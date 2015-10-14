var code_block_writer_1 = require("code-block-writer");
function getCodeFromClasses(classes, importMapping) {
    var importWriter = new code_block_writer_1.default();
    var writer = new code_block_writer_1.default();
    var types = {};
    function isLibType(typeName) {
        return ["string", "number", "Date"].some(function (t) { return t == typeName; });
    }
    function usesType(type) {
        var typeName = type.name;
        if (!isLibType(typeName)) {
            var lastPeriodIndex = type.name.lastIndexOf(".");
            if (lastPeriodIndex >= 0) {
                typeName = typeName.substr(lastPeriodIndex + 1);
            }
            types[typeName] = type;
        }
    }
    classes.forEach(function (c, classIndex) {
        if (classIndex > 0) {
            writer.newLine();
        }
        writer.write("export class " + c.name + " extends ClientBase").block(function () {
            var usePath;
            for (var _i = 0, _a = c.decorators; _i < _a.length; _i++) {
                var decorator = _a[_i];
                if (decorator.name === "Use" && decorator.arguments.length > 0) {
                    usePath = decorator.arguments[0].text;
                    break;
                }
            }
            writer.write("constructor()").block(function () {
                writer.write("super(\"" + usePath + "\")");
            });
            c.methods.forEach(function (m) {
                var method;
                for (var _i = 0, _a = m.decorators; _i < _a.length; _i++) {
                    var decorator = _a[_i];
                    if (decorator.name === "Post" || decorator.name === "Get") {
                        method = decorator;
                        break;
                    }
                }
                if (method == null) {
                    console.warn("Ignoring method " + m.name + " because it did not have a Post or Get decorator.");
                    return;
                }
                writer.write(m.name + "(");
                m.parameters.forEach(function (p, parameterIndex) {
                    if (parameterIndex > 0) {
                        writer.write(", ");
                    }
                    writer.write(p.name + ": " + p.type.name);
                    usesType(p.type);
                });
                writer.write(")");
                writer.block(function () {
                    writer.write("this." + method.name.toLowerCase() + "(");
                    var requestPath = "/";
                    if (method.arguments.length > 0) {
                        requestPath = method.arguments[0].text || "/";
                        var colonIndex = requestPath.indexOf(":");
                        if (colonIndex >= 0) {
                            requestPath = requestPath.substr(0, colonIndex);
                        }
                        if (requestPath.length === 0) {
                            requestPath = "/";
                        }
                    }
                    writer.write("\"" + requestPath + "\"");
                    m.parameters.forEach(function (p) {
                        writer.write(", ");
                        writer.write(p.name);
                    });
                    writer.write(");");
                });
            });
        });
    });
    importWriter.writeLine("import {ClientBase} from \"decorator-routes\"");
    for (var typeName in types) {
        if (importMapping[typeName] == null) {
            throw "An import mapping needs to be specified on the options parameter for '" + typeName + "' when calling getGeneratedCode()";
        }
        importWriter.writeLine("import {" + typeName + "} from \"" + importMapping[typeName] + "\";");
    }
    return importWriter.newLine().toString() + writer.toString();
}
exports.getCodeFromClasses = getCodeFromClasses;
