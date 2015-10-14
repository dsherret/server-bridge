import * as TSCode from "type-info-ts";

const BASE_CLASS_NAME = "Routes";

export function getClasses(...fileNames: string[]) {
    const files = TSCode.getFileInfo(...fileNames);
    const allClasses = files.map((file) => file.classes).reduce((a, b) => a.concat(b));
    const routeClasses = allClasses.filter(c => c.baseClasses.some(base => base.name === BASE_CLASS_NAME));

    if (routeClasses.length === 0) {
        console.warn(`Could not find any classes that extends ${BASE_CLASS_NAME}.`);
    }

    allClasses.filter(c => routeClasses.indexOf(c) === -1).forEach((c) => {
        console.warn(`Ignoring class '${c.name}': Does not implement ${BASE_CLASS_NAME}.`);
    });

    return routeClasses;
}