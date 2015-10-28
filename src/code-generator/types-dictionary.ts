import * as TSCode from "type-info-ts";

export class TypesDictionary {
    private types: { [typeName: string]: TSCode.Type } = {};

    add(type: TSCode.Type) {
        let typeName = type.name;

        if (!this.isLibType(typeName)) {
            const lastPeriodIndex = type.name.lastIndexOf(".");

            if (lastPeriodIndex >= 0) {
                typeName = typeName.substr(lastPeriodIndex + 1);
            }

            this.types[typeName] = type;
        }
    }

    getTypes() {
        return this.types;
    }

    // todo: Move out of this class. This filtering should be done by the ImportWriter
    private isLibType(typeName: string) {
        // todo: do an automatic check through lib.d.ts to ignore those types
        return ["string", "number", "Date"].some(t => t == typeName);
    }
}
