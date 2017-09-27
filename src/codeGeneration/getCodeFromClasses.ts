import CodeBlockWriter from "code-block-writer";
import Ast, {SourceFile, ClassDeclaration, Type, InterfaceDeclaration, TypeAliasDeclaration, EnumDeclaration, MethodDeclaration, Decorator, MethodDeclarationStructure,
    ParameterDeclaration, Scope} from "ts-simple-ast";
import {stripPromiseFromString, stripQuotes, RouteParser} from "./../utils";
import {TypesDictionary} from "./TypesDictionary";
import {getClassPath} from "./getClassPath";
import {DefinitionFromTypeGenerator} from "./DefinitionFromTypeGenerator";
import {getMethodDecorator} from "./getMethodDecorator";
import {CLIENT_BASE_NAME} from "./../constants";

// NOTE: This code is bad! I wrote it many years ago. I would not recommend doing code generation this way.

interface Options {
    classes: ClassDeclaration[];
    classMapping?: { [className: string]: string };
    libraryName: string;
}

export function getCodeFromClasses(ast: Ast, options: Options) {
    const fileForWrite = ast.addSourceFileFromText("serverBridgeTempFile.ts", "");
    try {
        const types = new TypesDictionary();
        const {libraryName, classes} = options;

        classes.forEach((c) => {
            const name = options.classMapping[c.getName()] || c.getName();

            fileForWrite.addClass({
                name,
                isExported: true,
                extends: CLIENT_BASE_NAME,
                implements: ["I" + name],
                ctor: {
                    parameters: [{
                        name: "options",
                        hasQuestionToken: true,
                        type: "{ urlPrefix: string; }"
                    }],
                    bodyText: functionWriter => {
                        functionWriter.write(`super((options == null ? "" : (options.urlPrefix || "")) + "${stripQuotes(getClassPath(c))}");`);
                    }
                },
                methods: getMethods(c, param => {
                    if (param.getTypeNode() != null)
                        types.add(param.getType());
                })
            });

            fileForWrite.addInterface({
                name: "I" + name,
                isExported: true,
                methods: getMethods(c)
            });
        });

        fileForWrite.addImport({
            namedImports: [{ name: CLIENT_BASE_NAME }],
            moduleSpecifier: libraryName
        });

        const referencedTypes = types.getTypes();
        fillFileWithTypesAsDeclarations(fileForWrite, referencedTypes);

        fileForWrite.insertText(0, writer => writer.writeLine("/* tslint:disable */")
            .writeLine("// ReSharper disable All"));

        return fileForWrite.getFullText();
    }
    finally {
        ast.removeSourceFile(fileForWrite);
    }
}

function getMethods(c: ClassDeclaration, onAddParam?: (param: ParameterDeclaration) => void): MethodDeclarationStructure[] {
    return c.getInstanceMethods()
        .filter(m => m.getScope() === Scope.Public)
        .map(m => ({ decorator: getMethodDecorator(m), method: m }))
        .filter(methodAndDecorator => methodAndDecorator.decorator != null)
        .map(methodAndDecorator => ({
            name: methodAndDecorator.method.getName(),
            parameters: methodAndDecorator.method.getParameters().map(param => {
                if (onAddParam != null)
                    onAddParam(param);
                return {
                    name: param.getName(),
                    type: param.getTypeNode() != null ? param.getTypeNode().getText() : undefined
                };
            }),
            bodyText: (methodWriter: CodeBlockWriter) => {
                writeBaseStatement(methodWriter, methodAndDecorator.method, methodAndDecorator.decorator);
            },
            returnType: getReturnTypeFromText(methodAndDecorator.method.getReturnTypeNode() != null ? methodAndDecorator.method.getReturnTypeNode().getText()
                : methodAndDecorator.method.getReturnType().getText())
        }));
}

function getReturnTypeFromText(returnTypeText: string) {
    const isPromise = /^Promise<.*>$/.test(returnTypeText);

    if (!isPromise) {
        returnTypeText = `Promise<${returnTypeText}>`;
    }

    return returnTypeText;
}

function writeBaseStatement(writer: CodeBlockWriter, method: MethodDeclaration, methodDecorator: Decorator) {
    const parser = new RouteParser(methodDecorator.getArguments().length > 0 ? stripQuotes(methodDecorator.getArguments()[0].getText()) : method.getName());
    const urlParameterNames = parser.getParameterNames();

    verifyMethodHasParameterNames(method, urlParameterNames);

    writer.write(`return super.${methodDecorator.getName().toLowerCase()}<${getReturnType(method)}>(`);
    writer.write(`${parser.getUrlCodeString()}`);

    method.getParameters().forEach(parameter => {
        if (!urlParameterNames.some(name => name === parameter.getName())) {
            writer.write(", ");
            writer.write(parameter.getName());
        }
    });

    writer.write(`);`);
}

function getReturnType(method: MethodDeclaration) {
    const returnTypeNode = method.getReturnTypeNode();
    return stripPromiseFromString(returnTypeNode == null ? method.getReturnType().getText() : returnTypeNode.getText());
}

function fillFileWithTypesAsDeclarations(fileForWrite: SourceFile, types: Type[]) {
    const definitionFromTypeGenerator = new DefinitionFromTypeGenerator(fileForWrite);
    for (const typeDef of types) {
        definitionFromTypeGenerator.fillFileForType(typeDef);
    }
}

function verifyMethodHasParameterNames(method: MethodDeclaration, paramNames: string[]) {
    paramNames.forEach(paramName => {
        if (!method.getParameters().some(p => p.getName() === paramName))
            throw new Error(`The parameter ${paramName} specified in the route does not exist on the method ${method.getName()}`);
    });
}
