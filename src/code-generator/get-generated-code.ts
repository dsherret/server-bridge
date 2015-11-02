import {getClasses} from "./get-classes";
import {getCodeFromClasses} from "./get-code-from-classes";
import {getDocumentation} from "./get-documentation";

interface Options {
    importMapping?: { [importName: string]: string };
    libraryName?: string;
}

// todo: error when fileName doesn't exist

export function getGeneratedCode(options: Options, ...fileNames: string[]) {
    const classes = getClasses(...fileNames);
    const {importMapping, libraryName = "decorator-routes-superagent-client" } = options;

    return getDocumentation({ libraryName: libraryName }) +
        getCodeFromClasses({ classes: classes, importMapping: importMapping || {}, libraryName: libraryName });
}

//console.log(getGeneratedCode({ importMapping: { Note: "shared-lib" } }, "src/__tests__/resources/test-file.ts"));
