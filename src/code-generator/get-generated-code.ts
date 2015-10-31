import {getClasses} from "./get-classes";
import {getCodeFromClasses} from "./get-code-from-classes";

interface Options {
    importMapping?: { [importName: string]: string };
    libraryName?: string;
}

export function getGeneratedCode(options: Options, ...fileNames: string[]) {
    const classes = getClasses(...fileNames);
    const {importMapping, libraryName = "decorator-routes" } = options;

    return getCodeFromClasses({ classes: classes, importMapping: importMapping || {}, libraryName: libraryName });
}

//console.log(getGeneratedCode({ importMapping: { Note: "shared-lib" } }, "src/__tests__/resources/test-file.ts"));
