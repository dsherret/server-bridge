import CodeBlockWriter from "code-block-writer";
import * as TSCode from "ts-type-info";
import {TypesDictionary} from "./types-dictionary";

export class TypeWriter {
    constructor(private types: TypesDictionary) {
    }

    write(writer: CodeBlockWriter, type: TSCode.Type) {
        // todo: instead of checking for a space, create a property in TsTypeInfo
        if (type.name.indexOf(" ") === -1 || type.properties.length === 0) {
            writer.write(type.name);
            this.types.add(type);
        }
        else {
            this.writeTypeWithProperties(writer, type);
        }
    }

    private writeTypeWithProperties(writer: CodeBlockWriter, type: TSCode.Type) {
        writer.write("{ ");

        for (const property of type.properties) {
            writer.write(`${property.name}: `);
            this.write(writer, property.type);
            writer.write("; ");
        }

        writer.write("}");
    }
}
