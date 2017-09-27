import Ast from "ts-simple-ast";
import {getClasses} from "./getClasses";
import {getCodeFromClasses} from "./getCodeFromClasses";
import {getDocumentation} from "./getDocumentation";

interface Options {
    classMapping?: { [className: string]: string };
    libraryName?: string;
    includeDocumentation?: boolean;
}

export function getGeneratedCode(ast: Ast, options: Options) {
    const {classMapping, libraryName = "server-bridge-superagent-client", includeDocumentation = true } = options;
    const classes = getClasses(ast);

    return (includeDocumentation ? getDocumentation({ libraryName: libraryName }) : "") +
        getCodeFromClasses(ast, { classes, classMapping: classMapping || {}, libraryName: libraryName});
}
