import * as TSCode from "type-info-ts";

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
