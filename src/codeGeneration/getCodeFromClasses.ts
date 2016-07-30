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
        fileForWrite.addClass({
            name: options.classMapping[c.name] || c.name,
            isExported: true,
            extendsTypes: [CLIENT_BASE_NAME],
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
            methods: c.methods
                .filter(m => m.scope === TSCode.Scope.Public)
                .map(m => ({ decorator: getMethodDecorator(m), method: m }))
                .filter(methodAndDecorator => methodAndDecorator.decorator != null)
                .map(methodAndDecorator => ({
                    name: methodAndDecorator.method.name,
                    parameters: methodAndDecorator.method.parameters.map(param => {
                        types.add(param.type);
                        return {
                            name: param.name,
                            type: param.type.text
                        };
                    }),
                    onWriteFunctionBody: (methodWriter: CodeBlockWriter) => {
                        writeBaseStatement(methodWriter, methodAndDecorator.method, methodAndDecorator.decorator);
                    }
                }))
        });
    });

    fileForWrite.addImport({
        namedImports: [{ name: CLIENT_BASE_NAME }],
        moduleSpecifier: libraryName
    });

    const referencedTypes = types.getTypes();
    fileForWrite.interfaces.push(...getInterfacesFromTypes(referencedTypes));
    fileForWrite.interfaces.forEach((def, i) => {
        fileForWrite.setOrderOfMember(i, def);
    });

    return fileForWrite.write();
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

    types.forEach(typeDef => {
        interfaces.push(...interfaceFromTypeGenerator.getInterfacesFromType(typeDef));
    });

    return interfaces;
}

function verifyMethodHasParameterNames(method: TSCode.ClassMethodDefinition, paramNames: string[]) {
    paramNames.forEach(paramName => {
        if (!method.parameters.some(p => p.name === paramName)) {
            throw new Error(`The parameter ${paramName} specified in the route does not exist on the method ${method.name}`);
        }
    });
}
