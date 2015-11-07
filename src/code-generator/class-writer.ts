import CodeBlockWriter from "code-block-writer";
import * as TSCode from "ts-type-info";
import {TypesDictionary} from "./types-dictionary";
import {getRequestPath} from "./get-request-path";
import {getClassPath} from "./get-class-path";
import {getMethodDecorator} from "./get-method-decorator";
import {TypeWriter} from "./type-writer";
import {stripPromiseFromString} from "./../utils/strip-promise-from-string";

export class ClassWriter {
    private typeWriter: TypeWriter;

    constructor(private classDef: TSCode.ClassDefinition, types: TypesDictionary, private className: string) {
        this.typeWriter = new TypeWriter(types);
    }

    writeToWriter(writer: CodeBlockWriter) {
        this.writeHeader(writer);
        this.writeBody(writer);
    }

    private writeHeader(writer: CodeBlockWriter) {
        writer.write(`export class ${this.className} extends ClientBase`);
    }

    private writeBody(writer: CodeBlockWriter) {
        writer.block(() => {
            this.writeConstructor(writer);
            this.writeMethods(writer);
        });
    }

    private writeConstructor(writer: CodeBlockWriter) {
        writer.write("constructor(options?: { urlPrefix: string; })").block(() => {
            writer.write(`super((options == null ? "" : (options.urlPrefix || "")) + "${getClassPath(this.classDef)}");`);
        });
    }

    private writeMethods(writer: CodeBlockWriter) {
        this.classDef.methods.forEach((method) => {
            writer.newLine();
            this.writeMethod(writer, method)
        });
    }

    private writeMethod(writer: CodeBlockWriter, method: TSCode.MethodDefinition) {
        let methodDecorator = getMethodDecorator(method);

        if (methodDecorator == null) {
            console.warn(`Ignoring method ${method.name} because it did not have a Post or Get decorator.`);
            return;
        }

        this.writeMethodHeader(writer, method);
        this.writeMethodBody(writer, method, methodDecorator);
    }

    private writeMethodHeader(writer: CodeBlockWriter, method: TSCode.MethodDefinition) {
        writer.write(`${method.name}(`);
        this.writeMethodParameters(writer, method);
        writer.write(")");
    }

    private writeMethodParameters(writer: CodeBlockWriter, method: TSCode.MethodDefinition) {
        method.parameters.forEach((parameter, parameterIndex) => {
            if (parameterIndex > 0) {
                writer.write(", ");
            }

            this.writeMethodParameter(writer, method, parameter);
        });
    }

    private writeMethodParameter(writer: CodeBlockWriter, method: TSCode.MethodDefinition, parameter: TSCode.ParameterDefinition) {
        writer.write(`${parameter.name}: `);
        this.typeWriter.write(writer, parameter.type);
    }

    private writeMethodBody(writer: CodeBlockWriter, method: TSCode.MethodDefinition, methodDecorator: TSCode.DecoratorDefinition) {
        writer.block(() => {
            this.writeBaseStatement(writer, method, methodDecorator);
        });
    }
    
    private writeBaseStatement(writer: CodeBlockWriter, method: TSCode.MethodDefinition, methodDecorator: TSCode.DecoratorDefinition) {
        writer.write(`return super.${methodDecorator.name.toLowerCase()}<${this.getReturnType(method)}>(`);
        writer.write(`"${getRequestPath(methodDecorator)}"`);

        method.parameters.forEach(parameter => {
            writer.write(", ");
            writer.write(parameter.name);
        });

        writer.write(`);`);
    }

    private getReturnType(method: TSCode.MethodDefinition) {
        let returnType = method.returnType == null ? "void" : method.returnType.name;

        return stripPromiseFromString(returnType);
    }
}
