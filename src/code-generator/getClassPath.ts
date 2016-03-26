import * as TSCode from "ts-type-info";

export function getClassPath(classDef: TSCode.ClassDefinition) {
    let usePath: string;

    for (const decorator of classDef.decorators) {
        if (decorator.name === "Use" && decorator.arguments.length > 0) {
            usePath = decorator.arguments[0].text;
            break;
        }
    }

    return usePath;
}
