import * as TSCode from "ts-type-info";

export class TypesDictionary {
    private types: TSCode.TypeDefinition[] = [];

    add(type: TSCode.TypeDefinition) {
        let typeName = type.text;

        if (!this.isLibType(typeName) && this.types.indexOf(type) === -1) {
            this.types.push(type);
            this.addDependentTypes(type);
        }
    }

    getTypes() {
        return this.types.slice(0);
    }

    private addDependentTypes(type: TSCode.TypeDefinition) {
        type.definitions.forEach(def => {
            if (def.isClassDefinition() || def.isInterfaceDefinition()) {
                def.extendsTypes.forEach(e => this.add(e));

                if (def.isClassDefinition()) {
                    def.implementsTypes.forEach(i => this.add(i));
                }

                def.properties.forEach(prop => this.add(prop.type));
            }
            else if (def.isTypeAliasDefinition()) {
                this.add(def.type);
            }
        });

        type.typeArguments.forEach(typeArg => {
            this.add(typeArg);
        });

        type.properties.forEach(prop => {
            this.add(prop.type);
        });
    }

    private isLibType(typeName: string) {
        // todo: do an automatic check through lib.d.ts to ignore those types
        return ["string", "number", "Date"].some(t => t === typeName);
    }
}
