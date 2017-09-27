import Ast from "ts-simple-ast";

const BASE_CLASS_NAME = "Routes";

export function getClasses(ast: Ast) {
    const definitionFile = ast.getSourceFileOrThrow("server-bridge.d.ts");
    // const baseClass = definitionFile.getClass(BASE_CLASS_NAME)!; // todo: use OrThrow here and use this to tell if the base class extends this
    const allClasses = ast.getSourceFiles().map(file => file.getClasses()).reduce((a, b) => a.concat(b), []);
    const routeClasses = allClasses.filter(c => {
        const extendsDec = c.getExtends();
        if (extendsDec == null)
            return false;
        return extendsDec.getText() === BASE_CLASS_NAME;
    });

    if (routeClasses.length === 0)
        throw new Error(`Could not find any classes that extend ${BASE_CLASS_NAME}.`);

    return routeClasses;
}
