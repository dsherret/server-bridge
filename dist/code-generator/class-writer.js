var get_request_path_1 = require("./get-request-path");
var get_class_path_1 = require("./get-class-path");
var get_method_decorator_1 = require("./get-method-decorator");
var type_writer_1 = require("./type-writer");
var strip_promise_from_string_1 = require("./../utils/strip-promise-from-string");
var ClassWriter = (function () {
    function ClassWriter(classDef, types, className) {
        this.classDef = classDef;
        this.className = className;
        this.typeWriter = new type_writer_1.TypeWriter(types);
    }
    ClassWriter.prototype.writeToWriter = function (writer) {
        this.writeHeader(writer);
        this.writeBody(writer);
    };
    ClassWriter.prototype.writeHeader = function (writer) {
        writer.write("export class " + this.className + " extends ClientBase");
    };
    ClassWriter.prototype.writeBody = function (writer) {
        var _this = this;
        writer.block(function () {
            _this.writeConstructor(writer);
            _this.writeMethods(writer);
        });
    };
    ClassWriter.prototype.writeConstructor = function (writer) {
        var _this = this;
        writer.write("constructor(options?: { urlPrefix: string; })").block(function () {
            writer.write("super((options == null ? \"\" : (options.urlPrefix || \"\")) + \"" + get_class_path_1.getClassPath(_this.classDef) + "\");");
        });
    };
    ClassWriter.prototype.writeMethods = function (writer) {
        var _this = this;
        this.classDef.methods.forEach(function (method) {
            writer.newLine();
            _this.writeMethod(writer, method);
        });
    };
    ClassWriter.prototype.writeMethod = function (writer, method) {
        var methodDecorator = get_method_decorator_1.getMethodDecorator(method);
        if (methodDecorator == null) {
            console.warn("Ignoring method " + method.name + " because it did not have a Post or Get decorator.");
            return;
        }
        this.writeMethodHeader(writer, method);
        this.writeMethodBody(writer, method, methodDecorator);
    };
    ClassWriter.prototype.writeMethodHeader = function (writer, method) {
        writer.write(method.name + "(");
        this.writeMethodParameters(writer, method);
        writer.write(")");
    };
    ClassWriter.prototype.writeMethodParameters = function (writer, method) {
        var _this = this;
        method.parameters.forEach(function (parameter, parameterIndex) {
            if (parameterIndex > 0) {
                writer.write(", ");
            }
            _this.writeMethodParameter(writer, method, parameter);
        });
    };
    ClassWriter.prototype.writeMethodParameter = function (writer, method, parameter) {
        writer.write(parameter.name + ": ");
        this.typeWriter.write(writer, parameter.type);
    };
    ClassWriter.prototype.writeMethodBody = function (writer, method, methodDecorator) {
        var _this = this;
        writer.block(function () {
            _this.writeBaseStatement(writer, method, methodDecorator);
        });
    };
    ClassWriter.prototype.writeBaseStatement = function (writer, method, methodDecorator) {
        writer.write("return super." + methodDecorator.name.toLowerCase() + "<" + this.getReturnType(method) + ">(");
        writer.write("\"" + get_request_path_1.getRequestPath(methodDecorator) + "\"");
        method.parameters.forEach(function (parameter) {
            writer.write(", ");
            writer.write(parameter.name);
        });
        writer.write(");");
    };
    ClassWriter.prototype.getReturnType = function (method) {
        var returnType = method.returnType == null ? "void" : method.returnType.name;
        return strip_promise_from_string_1.stripPromiseFromString(returnType);
    };
    return ClassWriter;
})();
exports.ClassWriter = ClassWriter;

//# sourceMappingURL=class-writer.js.map
