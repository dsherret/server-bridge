import * as TSCode from "ts-type-info";

export class TypesDictionary {
    private types: { [typeName: string]: TSCode.TypeDefinition } = {};

    add(type: TSCode.TypeDefinition) {
        let typeName = type.text;

        if (!this.isLibType(typeName) && !this.isObjectType(typeName)) {
            const lastPeriodIndex = type.text.lastIndexOf(".");

            if (lastPeriodIndex >= 0) {
                typeName = typeName.substr(lastPeriodIndex + 1);
            }

            this.types[typeName] = type;
        }
    }

    getTypesAsArray() {
        return Object.keys(this.types).map(prop => this.types[prop]);
    }

    getTypes() {
        return this.types;
    }

    private isObjectType(typeName: string) {
        return /^\{/.test(typeName);
    }

    private isLibType(typeName: string) {
        // todo: do an automatic check through lib.d.ts to ignore those types
        return ["string", "number", "Date"].some(t => t === typeName);
    }
}
