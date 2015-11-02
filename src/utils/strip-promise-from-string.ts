export function stripPromiseFromString(str: string) {
    const PROMISE_START = 'Promise<';
    const promiseStartIndex = str.indexOf(PROMISE_START);

    if (promiseStartIndex === 0) {
        if (str[str.length - 1] === ">") {
            const startIndex = PROMISE_START.length;
            str = str.substr(startIndex, str.length - 1 - startIndex);
        }
    }

    return str;
}