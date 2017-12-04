import * as TSCode from "ts-type-info";

export class InterfaceFromTypeGenerator {
    private handledDefinitions: TSCode.ModuleMemberDefinitions[] = [];

    getInterfacesFromType(typeDef: TSCode.TypeDefinition) {
        const interfaces: TSCode.InterfaceDefinition[] = [];

        typeDef.definitions.forEach(def => {
            if (this.handledDefinitions.indexOf(def) === -1) {
                this.handledDefinitions.push(def);
                interfaces.push(this.getInterfaceFromDefinition(def));
            }
        });

        return interfaces;
    }

    private getInterfaceFromDefinition(def: TSCode.ModuleMemberDefinitions) {
        const interfaceDef = TSCode.createInterface({
            name: def.name,
            isExported: true
        });

        if (def instanceof TSCode.InterfaceDefinition || def instanceof TSCode.ClassDefinition) {
            def.properties.forEach(prop => {
                interfaceDef.addProperty({
                    name: prop.name,
                    type: prop.type.text,
                    isOptional: prop.isOptional
                });
            });

            def.extendsTypes.forEach(e => {
                interfaceDef.addExtends(e.text);
            });

            if (def instanceof TSCode.ClassDefinition) {
                def.implementsTypes.forEach(i => {
                    interfaceDef.addExtends(i.text);
                });
            }

            def.typeParameters.forEach(typeParam => {
                interfaceDef.addTypeParameter({
                    name: typeParam.name,
                    constraintType: typeParam.constraintType != null ? typeParam.constraintType.text : null
                });
            });
        }

        return interfaceDef;
    }
}
