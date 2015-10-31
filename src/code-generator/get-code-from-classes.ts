import CodeBlockWriter from "code-block-writer";
import * as TSCode from "type-info-ts";
import {ClassWriter} from "./class-writer";
import {TypesDictionary} from "./types-dictionary";

interface Options {
    classes: TSCode.ClassDefinition[];
    importMapping: { [importName: string]: string };
    libraryName: string;
}

export function getCodeFromClasses(options: Options) {
    const importWriter = new CodeBlockWriter();
    const writer = new CodeBlockWriter();
    const types = new TypesDictionary();
    const {libraryName, classes, importMapping} = options;
    const clientBaseName = "ClientBase";

    classes.forEach((c, classIndex) => {
        if (classIndex > 0) {
            writer.newLine();
        }

        const classWriter = new ClassWriter(c, types);
        classWriter.writeToWriter(writer);
    });

    importWriter.writeLine(`import {${clientBaseName}} from "${libraryName}"`);

    for (const typeName in types.getTypes()) {
        if (typeName === clientBaseName) {
            throw `Having a type with the name ClientBase is currently not supported. Please use a different type name.`; 
        }
        else if (importMapping[typeName] == null) {
            throw `An import mapping needs to be specified on the options parameter for '${typeName}' when calling getGeneratedCode()`;
        }

        importWriter.writeLine(`import {${typeName}} from "${importMapping[typeName]}";`)
    }

    return importWriter.newLine().toString() + writer.newLine().toString();
}
