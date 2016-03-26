export function stripQuotes(str: string) {
    if (str == null) {
        return str;
    }
    else {
        return str.replace(/^["']/, "").replace(/["']$/, "");
    }
}
