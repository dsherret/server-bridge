export class ArrayUtils {
    static getUniqueInStringArray(a: string[]) {
        const seen: { [index: string]: boolean; } = {};

        return a.filter((item) => seen.hasOwnProperty(item) ? false : (seen[item] = true));
    }
}
