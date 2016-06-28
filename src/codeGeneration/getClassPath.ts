import * as TSCode from "ts-type-info";
import {USE_DECORATOR_NAME} from "./../constants";

export function getClassPath(classDef: TSCode.ClassDefinition) {
    let usePath = "";

    for (const decorator of classDef.decorators) {
        if (decorator.name === USE_DECORATOR_NAME && decorator.arguments.length > 0) {
            usePath = decorator.arguments[0].text;
            break;
        }
    }

    return usePath;
}
