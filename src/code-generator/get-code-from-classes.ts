import CodeBlockWriter from "code-block-writer";
import * as TSCode from "type-info-ts";
import {ClassWriter} from "./class-writer";
import {TypesDictionary} from "./types-dictionary";

export function getCodeFromClasses(classes: TSCode.ClassDefinition[], importMapping: {[importName: string]: string}) {
    const importWriter = new CodeBlockWriter();
    const writer = new CodeBlockWriter();
    const types = new TypesDictionary();

    classes.forEach((c, classIndex) => {
        if (classIndex > 0) {
            writer.newLine();
        }

        const classWriter = new ClassWriter(c, types);
        classWriter.writeToWriter(writer);
    });

    importWriter.writeLine(`import {ClientBase} from "decorator-routes"`);

    for (const typeName in types.getTypes()) {
        if (importMapping[typeName] == null) {
            throw `An import mapping needs to be specified on the options parameter for '${typeName}' when calling getGeneratedCode()`;
        }

        importWriter.writeLine(`import {${typeName}} from "${importMapping[typeName]}";`)
    }

    return importWriter.newLine().toString() + writer.newLine().toString();
}
