import * as TSCode from "ts-type-info";

const BASE_CLASS_NAME = "Routes";

export function getClasses(fileNames: string[]) {
    const result = TSCode.getInfoFromFiles(fileNames);
    const allClasses = result.files.map((file) => file.classes).reduce((a, b) => a.concat(b), []);
    const routeClasses = allClasses.filter(c => c.extendsTypes.some(base => base.text === BASE_CLASS_NAME));

    if (routeClasses.length === 0) {
        throw new Error(`Could not find any classes that extend ${BASE_CLASS_NAME}.`);
    }

    return routeClasses;
}
