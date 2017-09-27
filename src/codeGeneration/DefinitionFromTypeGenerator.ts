import {SourceFile, Type, InterfaceDeclaration, ClassDeclaration, TypeAliasDeclaration, EnumDeclaration, TypeGuards} from "ts-simple-ast";

export class DefinitionFromTypeGenerator {
    private handledDefinitions: any[] = [];

    constructor(private readonly fileForWrite: SourceFile) {
    }

    fillFileForType(typeDef: Type) {
        const symbol = typeDef.getAliasSymbol() || typeDef.getSymbol();
        if (symbol == null)
            return;

        for (const dec of symbol.getDeclarations()) {
            if (this.handledDefinitions.indexOf(dec as any) !== -1)
                continue;
            this.handledDefinitions.push(dec as any);

            if (TypeGuards.isTypeAliasDeclaration(dec))
                this.fillFileForTypeAlias(dec);
            else if (TypeGuards.isEnumDeclaration(dec))
                this.fillFileForEnum(dec);
            else if (TypeGuards.isInterfaceDeclaration(dec))
                this.fillFileForInterface(dec);
            else if (TypeGuards.isClassDeclaration(dec))
                this.fillFileForClass(dec);
        }
    }

    private fillFileForTypeAlias(dec: TypeAliasDeclaration) {
        this.fileForWrite.addTypeAlias({
            name: dec.getName(),
            isExported: true,
            type: dec.getTypeNode().getText()
        });
    }

    private fillFileForEnum(dec: EnumDeclaration) {
        this.fileForWrite.addEnum({
            name: dec.getName(),
            isExported: true,
            members: dec.getMembers().map(m => ({
                name: m.getName(),
                value: m.getValue()
            }))
        });
    }

    private fillFileForInterface(dec: InterfaceDeclaration) {
        this.fileForWrite.addInterface({
            name: dec.getName(),
            isExported: true,
            extends: dec.getExtends().map(e => e.getText()),
            properties: dec.getProperties().map(p => ({
                name: p.getName(),
                type: p.getTypeNode() != null ? p.getTypeNode().getText() : undefined,
                hasQuestionToken: p.hasQuestionToken()
            })),
            typeParameters: dec.getTypeParameters().map(p => ({
                name: p.getName(),
                constraint: p.getConstraintNode() != null ? p.getConstraintNode().getText() : undefined
            }))
        });
    }

    private fillFileForClass(dec: ClassDeclaration) {
        const extendsClause = dec.getImplements().map(i => i.getText());
        if (dec.getExtends() != null)
            extendsClause.push(dec.getExtends().getText());

        this.fileForWrite.addInterface({
            name: dec.getName(),
            isExported: true,
            extends: extendsClause,
            properties: dec.getInstanceProperties().filter(p => !TypeGuards.isSetAccessorDeclaration(p)).map(p => ({
                name: p.getName(),
                type: TypeGuards.isGetAccessorDeclaration(p) || TypeGuards.isSetAccessorDeclaration(p) ? (p.getReturnTypeNode() != null ? p.getReturnTypeNode().getText() : undefined) :
                    (p.getTypeNode() != null ? p.getTypeNode().getText() : undefined),
                hasQuestionToken: TypeGuards.isGetAccessorDeclaration(p) || TypeGuards.isSetAccessorDeclaration(p) ? false : p.hasQuestionToken()
            })),
            typeParameters: dec.getTypeParameters().map(p => ({
                name: p.getName(),
                constraint: p.getConstraintNode() != null ? p.getConstraintNode().getText() : undefined
            }))
        });
    }
}
