import * as TSCode from "ts-type-info";

export function getMethodDecorator(method: TSCode.MethodDefinition) {
    let methodDecorator: TSCode.DecoratorDefinition;

    for (const decorator of method.decorators) {
        if (decorator.name === "Post" || decorator.name === "Get") {
            methodDecorator = decorator;
            break;
        }
    }

    return methodDecorator;
}
