import CodeBlockWriter from "code-block-writer";
import * as TSCode from "ts-type-info";
import {stripPromiseFromString, stripQuotes, RouteParser} from "./../utils";
import {TypesDictionary} from "./TypesDictionary";
import {getClassPath} from "./getClassPath";
import {getMethodDecorator} from "./getMethodDecorator"

const CLIENT_BASE_NAME = "ClientBase";

interface Options {
    classes: TSCode.ClassDefinition[];
    importMapping: { [importName: string]: string };
    classMapping?: { [className: string]: string };
    libraryName: string;
}

export function getCodeFromClasses(options: Options) {
    const importWriter = new CodeBlockWriter();
    const writer = new CodeBlockWriter();
    const types = new TypesDictionary();
    const {libraryName, classes, importMapping} = options;

    classes.forEach((c, classIndex) => {
        if (classIndex > 0) {
            writer.newLine();
        }

        c.name = options.classMapping[c.name] || c.name;
        c.methods = c.methods.filter(m => m.scope === TSCode.Scope.Public);
        c.extendsTypeExpressions.length = 0;
        c.addExtends("ClientBase");
        c.setConstructor({
            parameters: [{
                name: "options",
                isOptional: true,
                type: "{ urlPrefix: string; }"
            }]
        });
        const classPath = stripQuotes(getClassPath(c));
        c.constructorDef.onWriteFunctionBody = writer => {
            writer.write(`super((options == null ? "" : (options.urlPrefix || "")) + "${classPath}");`);
        };
        c.properties.length = 0;
        c.staticMethods.length = 0;
        c.staticProperties.length = 0;
        c.decorators.length = 0;
        c.methods = c.methods.filter(method => {
            let methodDecorator = getMethodDecorator(method);

            if (methodDecorator == null) {
                console.warn(`Ignoring method ${method.name} because it did not have a Post or Get decorator.`);
                return false;
            }
            else {
                method.decorators.length = 0;
                method.parameters.forEach(p => {
                    types.add(p.typeExpression);
                });
                method.onWriteFunctionBody = writer => {
                    writeBaseStatement(writer, method, methodDecorator);
                };
                return true;
            }
        });

        // todo: pass in writer
        writer.write(c.write());
    });

    importWriter.writeLine(`import {${CLIENT_BASE_NAME}} from "${libraryName}";`);

    Object.keys(types.getTypes()).forEach(typeName => {
        if (typeName === CLIENT_BASE_NAME) {
            throw new Error(`Having a type with the name ClientBase is currently not supported. Please use a different type name.`);
        }
        else if (importMapping[typeName] == null) {
            throw new Error(`An import mapping needs to be specified on the options parameter for '${typeName}' when calling getGeneratedCode()`);
        }

        importWriter.writeLine(`import {${typeName}} from "${importMapping[typeName]}";`);
    });

    return importWriter.newLine().newLine().write(writer.toString());
}

function writeBaseStatement(writer: CodeBlockWriter, method: TSCode.ClassMethodDefinition, methodDecorator: TSCode.DecoratorDefinition) {
    const parser = new RouteParser(methodDecorator.arguments.length > 0 ? stripQuotes(methodDecorator.arguments[0].text) : null);
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
    let returnType = method.returnTypeExpression == null ? "void" : method.returnTypeExpression.text;

    return stripPromiseFromString(returnType);
}

function verifyMethodHasParameterNames(method: TSCode.ClassMethodDefinition, paramNames: string[]) {
    paramNames.forEach(paramName => {
        if (!method.parameters.some(p => p.name === paramName)) {
            throw new Error(`The parameter ${paramName} specified in the route does not exist on the method ${method.name}`);
        }
    });
}
