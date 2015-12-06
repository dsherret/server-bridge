import {getClasses} from "./get-classes";
import {getCodeFromClasses} from "./get-code-from-classes";
import {getDocumentation} from "./get-documentation";

interface Options {
    classMapping?: { [className: string]: string };
    importMapping?: { [importName: string]: string };
    libraryName?: string;
}

// todo: error when fileName doesn't exist

export function getGeneratedCode(options: Options, fileNames: string[]) {
    const classes = getClasses(fileNames);
    const {classMapping, importMapping, libraryName = "server-bridge-superagent-client" } = options;

    return getDocumentation({ libraryName: libraryName }) +
        getCodeFromClasses({ classes: classes, importMapping: importMapping || {}, classMapping: classMapping || {}, libraryName: libraryName });
}

// console.log(getGeneratedCode({ classMapping: { NoteRoutes: "NoteApi" }, importMapping: { Note: "shared-lib" } }, "src/__tests__/resources/test-file.ts"));
