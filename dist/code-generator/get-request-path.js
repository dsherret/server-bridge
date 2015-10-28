function getRequestPath(methodDecorator) {
    var requestPath = "";
    if (methodDecorator.arguments.length > 0) {
        requestPath = methodDecorator.arguments[0].text || "/";
        requestPath = stipColonStringFromPath(requestPath);
    }
    return makeSlashIfEmpty(requestPath);
}
exports.getRequestPath = getRequestPath;
function stipColonStringFromPath(requestPath) {
    var colonIndex = requestPath.indexOf(":");
    if (colonIndex >= 0) {
        requestPath = requestPath.substr(0, colonIndex);
    }
    return requestPath;
}
function makeSlashIfEmpty(requestPath) {
    if (requestPath.length === 0) {
        requestPath = "/";
    }
    return requestPath;
}
