import * as assert from "assert";
import * as path from "path";
import Ast from "ts-simple-ast";
import {getDocumentation} from "./../../codeGeneration/getDocumentation";
import {getGeneratedCode} from "./../../main";

describe("getGeneratedCode", () => {
    const expectedCode =
`/* tslint:disable */
// ReSharper disable All
import {ClientBase} from "server-bridge-superagent-client";

export class NoteRoutes extends ClientBase implements INoteRoutes {
    constructor(options?: { urlPrefix: string; }) {
        super((options == null ? "" : (options.urlPrefix || "")) + "/notes");
    }

    getMethod(noteID: number): Promise<number> {
        return super.get<number>("/" + encodeURIComponent(noteID));
    }

    postMethod(note: Note): Promise<number> {
        return super.post<number>("/", note);
    }

    postAliasMethod(alias: TypeAlias): Promise<void> {
        return super.post<void>("/postAliasMethod", alias);
    }

    postEnumMethod(myEnum: MyEnum): Promise<void> {
        return super.post<void>("/postEnumMethod", myEnum);
    }
}

export interface INoteRoutes {
    getMethod(noteID: number): Promise<number>;
    postMethod(note: Note): Promise<number>;
    postAliasMethod(alias: TypeAlias): Promise<void>;
    postEnumMethod(myEnum: MyEnum): Promise<void>;
}

export class RoutesWithoutUse extends ClientBase implements IRoutesWithoutUse {
    constructor(options?: { urlPrefix: string; }) {
        super((options == null ? "" : (options.urlPrefix || "")) + "");
    }

    getMethodNoRoute(params: { text: string; }): Promise<number> {
        return super.get<number>("/getMethodNoRoute", params);
    }
}

export interface IRoutesWithoutUse {
    getMethodNoRoute(params: { text: string; }): Promise<number>;
}

export interface Note extends BaseInterface<TypeArgInterface> {
    referencedProp: ReferencedProp;
}

export interface Note {
    declarationMerging: string;
    myClass: MyClass;
}

export interface BaseInterface<T> {
    baseProp: T;
}

export interface TypeArgInterface {
    prop?: string;
}

export interface ReferencedProp {
    prop: string;
}

export interface MyClass extends BaseClass {
    prop: string;
}

export interface BaseClass extends BaseInterface<string> {
    baseProp: string;
    objectTypeAlias: ObjectTypeAlias;
}

export type ObjectTypeAlias = {
    name: string;
    other?: ObjectTypeAliasReferencedInterface;
};

export interface ObjectTypeAliasReferencedInterface {
    prop: string;
}

export type TypeAlias = {
    myAliasProp: TypeAliasReferencedInterface;
};

export interface TypeAliasReferencedInterface {
    prop: string;
}

export enum MyEnum {
    Member1 = 3,
    Member2 = 5
}
`;
    function getAst() {
        const ast = new Ast();
        ast.addSourceFiles(path.resolve(__dirname, "./../../../server-bridge.d.ts"));
        return ast;
    }

    it("should equal the expected code", () => {
        const ast = getAst();
        ast.addSourceFiles(path.resolve(__dirname, "./../../../src/tests/codeGeneration/resources/TestFile.ts"));
        const actualCode = getGeneratedCode(ast, {
            includeDocumentation: false
        });
        assert.equal(actualCode.replace(/\r?\n/g, "\n"), expectedCode.replace(/\r?\n/g, "\n"));
    });

    it("should equal the expected code", () => {
        const libraryName = "my-library-name";
        const ast = getAst();
        ast.addSourceFiles(path.resolve(__dirname, "./../../../src/tests/codeGeneration/resources/TestFile.ts"));
        const actualCode = getGeneratedCode(ast, {
            includeDocumentation: true,
            libraryName: libraryName
        });

        const documentation = getDocumentation({ libraryName });
        assert.equal(actualCode.substr(0, documentation.length), documentation);
    });

    it("should error when it can't find any file that extends the base class name", () => {
        const ast = getAst();
        assert.throws(() => {
            getGeneratedCode(ast, {
                includeDocumentation: false
            });
        }, "Could not find any classes that extends Routes");
    });

    it("should error when specifying a parameter in the route that does not exist in the method", () => {
        assert.throws(() => {
            const ast = getAst();
            ast.addSourceFiles(path.resolve(__dirname, "./../../../src/tests/codeGeneration/resources/VerifyParameterNamesTestFile.ts"));
            getGeneratedCode(ast, {
                includeDocumentation: false
            });
        }, "The parameter noteID specified in the route does not exist on the method getMethod");
    });
});
