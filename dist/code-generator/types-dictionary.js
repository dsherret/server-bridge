var TypesDictionary = (function () {
    function TypesDictionary() {
        this.types = {};
    }
    TypesDictionary.prototype.add = function (type) {
        var typeName = type.name;
        if (!this.isLibType(typeName)) {
            var lastPeriodIndex = type.name.lastIndexOf(".");
            if (lastPeriodIndex >= 0) {
                typeName = typeName.substr(lastPeriodIndex + 1);
            }
            this.types[typeName] = type;
        }
    };
    TypesDictionary.prototype.getTypesAsArray = function () {
        var _this = this;
        return Object.keys(this.types).map(function (prop) { return _this.types[prop]; });
    };
    TypesDictionary.prototype.getTypes = function () {
        return this.types;
    };
    TypesDictionary.prototype.isLibType = function (typeName) {
        return ["string", "number", "Date"].some(function (t) { return t === typeName; });
    };
    return TypesDictionary;
})();
exports.TypesDictionary = TypesDictionary;

//# sourceMappingURL=types-dictionary.js.map
