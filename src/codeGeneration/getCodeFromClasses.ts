import CodeBlockWriter from "code-block-writer";
import * as TSCode from "ts-type-info";
import {stripPromiseFromString, stripQuotes, RouteParser} from "./../utils";
import {TypesDictionary} from "./TypesDictionary";
import {getClassPath} from "./getClassPath";
import {InterfaceFromTypeGenerator} from "./InterfaceFromTypeGenerator";
import {getMethodDecorator} from "./getMethodDecorator";
import {CLIENT_BASE_NAME} from "./../constants";

interface Options {
    classes: TSCode.ClassDefinition[];
    classMapping?: { [className: string]: string };
    libraryName: string;
}

export function getCodeFromClasses(options: Options) {
    const fileForWrite = TSCode.createFile();
    const types = new TypesDictionary();
    const {libraryName, classes} = options;

    classes.forEach((c) => {
        const name = options.classMapping[c.name] || c.name;

        fileForWrite.addClass({
            name,
            isExported: true,
            extendsTypes: [CLIENT_BASE_NAME],
            implementsTypes: ["I" + name],
            constructorDef: {
                parameters: [{
                    name: "options",
                    isOptional: true,
                    type: "{ urlPrefix: string; }"
                }],
                onWriteFunctionBody: functionWriter => {
                    functionWriter.write(`super((options == null ? "" : (options.urlPrefix || "")) + "${stripQuotes(getClassPath(c))}");`);
                }
            },
            methods: getMethods(c, param => types.add(param.type))
        });

        fileForWrite.addInterface({
            name: "I" + name,
            isExported: true,
            methods: getMethods(c)
        });
    });

    fileForWrite.onBeforeWrite = writer => writer
        .writeLine("/* tslint:disable */")
        .writeLine("// ReSharper disable All");

    fileForWrite.addImport({
        namedImports: [{ name: CLIENT_BASE_NAME }],
        moduleSpecifier: libraryName
    });

    const referencedTypes = types.getTypes();
    fileForWrite.interfaces.push(...getInterfacesFromTypes(referencedTypes));
    fileForWrite.enums.push(...getEnumsFromTypes(referencedTypes));
    fileForWrite.interfaces.forEach((def, i) => {
        fileForWrite.setOrderOfMember(i, def);
    });
    fileForWrite.enums.forEach((def, i) => {
        fileForWrite.setOrderOfMember(fileForWrite.interfaces.length + i, def);
    });

    return fileForWrite.write();
}

function getMethods(c: TSCode.ClassDefinition, onAddParam?: (param: TSCode.ClassMethodParameterDefinition) => void) {
    return c.methods
        .filter(m => m.scope === TSCode.Scope.Public)
        .map(m => ({ decorator: getMethodDecorator(m), method: m }))
        .filter(methodAndDecorator => methodAndDecorator.decorator != null)
        .map(methodAndDecorator => ({
            name: methodAndDecorator.method.name,
            parameters: methodAndDecorator.method.parameters.map(param => {
                if (onAddParam != null) {
                    onAddParam(param);
                }
                return {
                    name: param.name,
                    type: param.type.text
                };
            }),
            onWriteFunctionBody: (methodWriter: CodeBlockWriter) => {
                writeBaseStatement(methodWriter, methodAndDecorator.method, methodAndDecorator.decorator);
            },
            returnType: getReturnTypeFromText(methodAndDecorator.method.returnType.text)
        }));
}

function getReturnTypeFromText(returnTypeText: string) {
    const isPromise = /^Promise<.*>$/.test(returnTypeText);

    if (!isPromise) {
        returnTypeText = `Promise<${returnTypeText}>`;
    }

    return returnTypeText;
}

function writeBaseStatement(writer: CodeBlockWriter, method: TSCode.ClassMethodDefinition, methodDecorator: TSCode.DecoratorDefinition) {
    const parser = new RouteParser(methodDecorator.arguments.length > 0 ? stripQuotes(methodDecorator.arguments[0].text) : method.name);
    const urlParameterNames = parser.getParameterNames();

    verifyMethodHasParameterNames(method, urlParameterNames);

    writer.write(`return super.${methodDecorator.name.toLowerCase()}<${getReturnType(method)}>(`);
    writer.write(`${parser.getUrlCodeString()}`);

    method.parameters.forEach(parameter => {
        if (!urlParameterNames.some(name => name === parameter.name)) {
            writer.write(", ");
            writer.write(parameter.name);
        }
    });

    writer.write(`);`);
}

function getReturnType(method: TSCode.ClassMethodDefinition) {
    return stripPromiseFromString(method.returnType.text);
}

function getInterfacesFromTypes(types: TSCode.TypeDefinition[]) {
    const interfaceFromTypeGenerator = new InterfaceFromTypeGenerator();
    const interfaces: TSCode.InterfaceDefinition[] = [];

    types.filter(typeDef => !typeDef.definitions.some(t => t.isEnumDefinition())).forEach(typeDef => {
        interfaces.push(...interfaceFromTypeGenerator.getInterfacesFromType(typeDef));
    });

    return interfaces;
}

function getEnumsFromTypes(types: TSCode.TypeDefinition[]) {
    const enums: TSCode.EnumDefinition[] = [];

    types.forEach(typeDef => {
        typeDef.definitions.forEach(def => {
            if (def.isEnumDefinition())
                enums.push(def);
        });
    });

    return enums;
}

function verifyMethodHasParameterNames(method: TSCode.ClassMethodDefinition, paramNames: string[]) {
    paramNames.forEach(paramName => {
        if (!method.parameters.some(p => p.name === paramName)) {
            throw new Error(`The parameter ${paramName} specified in the route does not exist on the method ${method.name}`);
        }
    });
}
