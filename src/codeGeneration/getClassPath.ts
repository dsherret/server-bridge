import {ClassDeclaration} from "ts-simple-ast";
import {USE_DECORATOR_NAME} from "./../constants";

export function getClassPath(classDec: ClassDeclaration) {
    for (const decorator of classDec.getDecorators()) {
        if (decorator.getName() === USE_DECORATOR_NAME && decorator.getArguments().length > 0)
            return decorator.getArguments()[0].getText();
    }
    return "";
}
