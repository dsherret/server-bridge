import * as TSCode from "ts-type-info";

const BASE_CLASS_NAME = "Routes";

export function getClasses(fileNames: string[]) {
    const files = TSCode.getFileInfo(fileNames);
    const allClasses = files.map((file) => file.classes).reduce((a, b) => a.concat(b));
    const routeClasses = allClasses.filter(c => c.extends.some(base => base.name === BASE_CLASS_NAME));

    if (routeClasses.length === 0) {
        console.warn(`Could not find any classes that extends ${BASE_CLASS_NAME}.`);
    }

    /*
    allClasses.filter(c => routeClasses.indexOf(c) === -1 && c.name != BASE_CLASS_NAME).forEach((c) => {
        console.warn(`Ignoring class '${c.name}': Does not extend ${BASE_CLASS_NAME}.`);
    });
    */

    return routeClasses;
}
