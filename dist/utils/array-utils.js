var ArrayUtils = (function () {
    function ArrayUtils() {
    }
    ArrayUtils.getUniqueInStringArray = function (a) {
        var seen = {};
        return a.filter(function (item) { return seen.hasOwnProperty(item) ? false : (seen[item] = true); });
    };
    return ArrayUtils;
})();
exports.ArrayUtils = ArrayUtils;

//# sourceMappingURL=array-utils.js.map
