export function stripQuotes(str: string) {
    return (str || "").replace(/^["']/, "").replace(/["']$/, "");
}
