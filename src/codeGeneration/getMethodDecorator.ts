import * as TSCode from "ts-type-info";
import {POST_DECORATOR_NAME, GET_DECORATOR_NAME} from "./../constants";

export function getMethodDecorator(method: TSCode.ClassMethodDefinition) {
    let methodDecorator: TSCode.DecoratorDefinition;

    for (const decorator of method.decorators) {
        if (decorator.name === POST_DECORATOR_NAME || decorator.name === GET_DECORATOR_NAME) {
            methodDecorator = decorator;
            break;
        }
    }

    return methodDecorator;
}
