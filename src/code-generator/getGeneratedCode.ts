import {getClasses} from "./getClasses";
import {getCodeFromClasses} from "./getCodeFromClasses";
import {getDocumentation} from "./getDocumentation";

interface Options {
    classMapping?: { [className: string]: string };
    importMapping?: { [importName: string]: string };
    libraryName?: string;
    includeDocumentation?: boolean;
    files: string[];
}

export function getGeneratedCode(options: Options) {
    const {classMapping, importMapping, libraryName = "server-bridge-superagent-client", includeDocumentation = true } = options;
    const classes = getClasses(options.files);

    return (includeDocumentation ? getDocumentation({ libraryName: libraryName }) : "") +
        getCodeFromClasses({ classes: classes, importMapping: importMapping || {}, classMapping: classMapping || {}, libraryName: libraryName});
}
