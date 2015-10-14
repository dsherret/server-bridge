/// <reference path="../../node_modules/code-block-writer/dist/code-block-writer.d.ts" />
/// <reference path="../../node_modules/type-info-ts/dist/type-info-ts.d.ts" />

import CodeBlockWriter from "code-block-writer";
import * as TSCode from "type-info-ts";

export function getCodeFromClasses(classes: TSCode.ClassDefinition[], importMapping: {[importName: string]: string}) {
    const importWriter = new CodeBlockWriter();
    const writer = new CodeBlockWriter();
    const types: { [typeName: string]: TSCode.Type } = {};

    function isLibType(typeName: string) {
        // todo: do a check through lib.d.ts to ignore those types
        return ["string", "number", "Date"].some(t => t == typeName);
    }

    function usesType(type: TSCode.Type) {
        let typeName = type.name;

        if (!isLibType(typeName)) {
            const lastPeriodIndex = type.name.lastIndexOf(".");

            if (lastPeriodIndex >= 0) {
                typeName = typeName.substr(lastPeriodIndex + 1);
            }

            types[typeName] = type;
        }
    }

    classes.forEach((c, classIndex) => {
        if (classIndex > 0) {
            writer.newLine();
        }

        // this code is very poorly written -- needs refactoring
        writer.write(`export class ${c.name} extends ClientBase`).block(() => {
            let usePath: string;

            for (const decorator of c.decorators) {
                if (decorator.name === "Use" && decorator.arguments.length > 0) {
                    usePath = decorator.arguments[0].text;
                    break;
                }
            }
            
            writer.write("constructor()").block(() => {
                writer.write(`super("${usePath}")`);
            });

            c.methods.forEach(m => {
                let method: TSCode.DecoratorDefinition;

                for (const decorator of m.decorators) {
                    if (decorator.name === "Post" || decorator.name === "Get") {
                        method = decorator;
                        break;
                    }
                }

                if (method == null) {
                    console.warn(`Ignoring method ${m.name} because it did not have a Post or Get decorator.`);
                    return;
                }

                writer.write(`${m.name}(`);

                m.parameters.forEach((p, parameterIndex) => {
                    if (parameterIndex > 0) {
                        writer.write(", ");
                    }

                    writer.write(`${p.name}: ${p.type.name}`);

                    usesType(p.type);
                });

                writer.write(")");

                writer.block(() => {
                    writer.write(`this.${method.name.toLowerCase()}(`);

                    let requestPath = "/";
                    
                    if (method.arguments.length > 0) {
                        requestPath = method.arguments[0].text || "/";

                        const colonIndex = requestPath.indexOf(":");

                        if (colonIndex >= 0) {
                            requestPath = requestPath.substr(0, colonIndex);
                        }

                        if (requestPath.length === 0) {
                            requestPath = "/";
                        }
                    }

                    writer.write(`"${requestPath}"`);

                    m.parameters.forEach(p => {
                        writer.write(", ");
                        writer.write(p.name);
                    });

                    writer.write(`);`);
                })
            });
        });
    });

    importWriter.writeLine(`import {ClientBase} from "decorator-routes"`);

    for (const typeName in types) {
        if (importMapping[typeName] == null) {
            throw `An import mapping needs to be specified on the options parameter for '${typeName}' when calling getGeneratedCode()`;
        }

        importWriter.writeLine(`import {${typeName}} from "${importMapping[typeName]}";`)
    }

    return importWriter.newLine().toString() + writer.toString();
}