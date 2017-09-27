import {MethodDeclaration, Decorator} from "ts-simple-ast";
import {POST_DECORATOR_NAME, GET_DECORATOR_NAME} from "./../constants";

export function getMethodDecorator(method: MethodDeclaration) {
    let methodDecorator: Decorator;

    // todo: should use FindReferences on the decorators to get these... or ensure it's the right decorator (not just based on the name)
    for (const decorator of method.getDecorators()) {
        const name = decorator.getName();
        if (name === POST_DECORATOR_NAME || name === GET_DECORATOR_NAME) {
            methodDecorator = decorator;
            break;
        }
    }

    return methodDecorator;
}
