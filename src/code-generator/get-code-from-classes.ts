import CodeBlockWriter from "code-block-writer";
import * as TSCode from "ts-type-info";
import {ClassWriter} from "./class-writer";
import {TypesDictionary} from "./types-dictionary";

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

        const classWriter = new ClassWriter(c, types, options.classMapping[c.name] || c.name);
        classWriter.writeToWriter(writer);
    });

    importWriter.writeLine(`import {${CLIENT_BASE_NAME}} from "${libraryName}";`);

    for (const typeName in types.getTypes()) {
        if (typeName === CLIENT_BASE_NAME) {
            throw `Having a type with the name ClientBase is currently not supported. Please use a different type name.`; 
        }
        else if (importMapping[typeName] == null) {
            throw `An import mapping needs to be specified on the options parameter for '${typeName}' when calling getGeneratedCode()`;
        }

        importWriter.writeLine(`import {${typeName}} from "${importMapping[typeName]}";`)
    }

    return importWriter.newLine().toString() + writer.toString();
}
