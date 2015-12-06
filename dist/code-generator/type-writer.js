var TypeWriter = (function () {
    function TypeWriter(types) {
        this.types = types;
    }
    TypeWriter.prototype.write = function (writer, type) {
        if (type.name.indexOf(" ") === -1 || type.properties.length === 0) {
            writer.write(type.name);
            this.types.add(type);
        }
        else {
            this.writeTypeWithProperties(writer, type);
        }
    };
    TypeWriter.prototype.writeTypeWithProperties = function (writer, type) {
        writer.write("{ ");
        for (var _i = 0, _a = type.properties; _i < _a.length; _i++) {
            var property = _a[_i];
            writer.write(property.name + ": ");
            this.write(writer, property.type);
            writer.write("; ");
        }
        writer.write("}");
    };
    return TypeWriter;
})();
exports.TypeWriter = TypeWriter;

//# sourceMappingURL=type-writer.js.map
