var TSCode = require("ts-type-info");
var BASE_CLASS_NAME = "Routes";
function getClasses(fileNames) {
    var files = TSCode.getFileInfo(fileNames);
    var allClasses = files.map(function (file) { return file.classes; }).reduce(function (a, b) { return a.concat(b); });
    var routeClasses = allClasses.filter(function (c) { return c.baseClasses.some(function (base) { return base.name === BASE_CLASS_NAME; }); });
    if (routeClasses.length === 0) {
        console.warn("Could not find any classes that extends " + BASE_CLASS_NAME + ".");
    }
    return routeClasses;
}
exports.getClasses = getClasses;

//# sourceMappingURL=get-classes.js.map
