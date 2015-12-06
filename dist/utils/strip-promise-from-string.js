function stripPromiseFromString(str) {
    var PROMISE_START = 'Promise<';
    var promiseStartIndex = str.indexOf(PROMISE_START);
    if (promiseStartIndex === 0) {
        if (str[str.length - 1] === ">") {
            var startIndex = PROMISE_START.length;
            str = str.substr(startIndex, str.length - 1 - startIndex);
        }
    }
    return str;
}
exports.stripPromiseFromString = stripPromiseFromString;

//# sourceMappingURL=strip-promise-from-string.js.map
