import {getClasses} from "./get-classes";
import {getCodeFromClasses} from "./get-code-from-classes";

export function getGeneratedCode(options: { importMapping?: {[importName: string]: string} }, ...fileNames: string[]) {
    const classes = getClasses(...fileNames);

    return getCodeFromClasses(classes, options.importMapping || {});
}

console.log(getGeneratedCode({ importMapping: { Note: "shared-lib" } }, "test-file.ts"));