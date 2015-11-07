import * as TSCode from "ts-type-info";

export function getRequestPath(methodDecorator: TSCode.DecoratorDefinition) {
    let requestPath = "";

    if (methodDecorator.arguments.length > 0) {
        requestPath = methodDecorator.arguments[0].text || "/";
        requestPath = stipColonStringFromPath(requestPath);
    }

    return makeSlashIfEmpty(requestPath);
}

function stipColonStringFromPath(requestPath: string) {
    const colonIndex = requestPath.indexOf(":");

    if (colonIndex >= 0) {
        requestPath = requestPath.substr(0, colonIndex);
    }

    return requestPath;
}

function makeSlashIfEmpty(requestPath: string) {
    if (requestPath.length === 0) {
        requestPath = "/";
    }

    return requestPath;
}