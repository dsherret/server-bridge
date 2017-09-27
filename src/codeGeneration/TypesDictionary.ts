import {Type, TypeGuards, ExpressionWithTypeArguments} from "ts-simple-ast";
import * as ts from "typescript";

export class TypesDictionary {
    private types: Type[] = [];

    add(type: Type) {
        const typeName = type.getText();

        if (!this.isLibType(typeName) && this.types.indexOf(type) === -1) {
            this.types.push(type);
            this.addDependentTypes(type);
        }
    }

    getTypes() {
        return this.types.slice(0);
    }

    private addDependentTypes(type: Type) {
        const symbol = type.getSymbol();
        if (symbol == null)
            return;

        for (const declaration of symbol.getDeclarations()) {
            if (TypeGuards.isClassDeclaration(declaration)) {
                // extends
                const extendsDec = declaration.getExtends();
                if (extendsDec != null)
                    this.handleExpressionWithTypeArguments(extendsDec);
                // implements
                for (const implementsExpr of declaration.getImplements())
                    this.handleExpressionWithTypeArguments(implementsExpr);
                // properties
                for (const property of declaration.getInstanceProperties()) {
                    if (TypeGuards.isPropertyDeclaration(property) || TypeGuards.isParameterDeclaration(property))
                        this.add(property.getType());
                    else if (TypeGuards.isGetAccessorDeclaration(property))
                        this.add(property.getReturnType());
                }
            }
            else if (TypeGuards.isInterfaceDeclaration(declaration)) {
                // extends
                for (const extendsExpr of declaration.getExtends())
                    this.handleExpressionWithTypeArguments(extendsExpr);
                // properties
                for (const property of declaration.getProperties())
                    this.add(property.getType());
            }
            else if (TypeGuards.isTypeAliasDeclaration(declaration)) {
                this.add(declaration.getType());
            }
        }

        type.getTypeArguments().forEach(typeArg => this.add(typeArg));
        type.getProperties().forEach(prop => {
            prop.getDeclarations().forEach(p => {
                if (TypeGuards.isPropertySignature(p))
                    this.add(p.getType());
            });
        });
    }

    private handleExpressionWithTypeArguments(expressionWithTypeArgs: ExpressionWithTypeArguments) {
        const expr = expressionWithTypeArgs.getExpression();
        if (TypeGuards.isIdentifier(expr))
            this.add(expr.getType());
        for (const typeArg of expressionWithTypeArgs.getTypeArguments()) {
            // todo: use TypeGuards.isTypeReference when supported
            if (typeArg.getKind() === ts.SyntaxKind.TypeReference) {
                const typeName = typeArg.getNodeProperty("typeName" as any);
                if (TypeGuards.isIdentifier(typeName))
                    this.add(typeName.getType());
            }
        }
    }

    private isLibType(typeName: string) {
        // todo: do an automatic check through lib.d.ts to ignore those types
        return ["string", "number", "Date", "boolean"].some(t => t === typeName);
    }
}
