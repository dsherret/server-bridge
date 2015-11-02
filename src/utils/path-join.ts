export function pathJoin(...paths: string[]) {
    return paths.map(p => handleSlashes(p)).reduce((a, b) => a + b);
}

function handleSlashes(str: string) {
    if (typeof str === "string" && str.length > 0) {
        if (str[0] != "/") {
            str = "/" + str;
        }

        if (str[str.length - 1] === "/") {
            str = str.substr(0, str.length - 1);
        }
    }

    return str;
}