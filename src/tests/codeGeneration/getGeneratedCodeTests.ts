import * as assert from "assert";
import * as path from "path";
import {getDocumentation} from "./../../codeGeneration/getDocumentation";
import {getGeneratedCode} from "./../../main";

describe("getGeneratedCode", () => {
    const expectedCode =
`/* tslint:disable */
// ReSharper disable All
import {ClientBase} from "server-bridge-superagent-client";

export interface INoteRoutes {
    getMethod(noteID: number): Promise<number>;
    postMethod(note: Note): Promise<number>;
    postAliasMethod(alias: TypeAlias): Promise<void>;
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
    status: Status;
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

export interface ObjectTypeAliasReferencedInterface {
    prop: string;
}

export interface TypeAliasReferencedInterface {
    prop: string;
}

export enum Status {
    Enabled = 0,
    Disabled = 1
}

export type ObjectTypeAlias = { name: string; other?: ObjectTypeAliasReferencedInterface; };
export type TypeAlias = { myAliasProp: TypeAliasReferencedInterface; };

export class NoteRoutes extends ClientBase implements INoteRoutes {
    constructor(options?: { urlPrefix: string; }) {
        super((options == null ? "" : (options.urlPrefix || "")) + "/notes");
    }

    getMethod(noteID: number) {
        return super.get<number>("/" + encodeURIComponent(noteID));
    }

    postMethod(note: Note) {
        return super.post<number>("/", note);
    }

    postAliasMethod(alias: TypeAlias) {
        return super.post<void>("/postAliasMethod", alias);
    }
}

export class RoutesWithoutUse extends ClientBase implements IRoutesWithoutUse {
    constructor(options?: { urlPrefix: string; }) {
        super((options == null ? "" : (options.urlPrefix || "")) + "");
    }

    getMethodNoRoute(params: { text: string; }) {
        return super.get<number>("/getMethodNoRoute", params);
    }
}
`;

    it("should equal the expected code", () => {
        const actualCode = getGeneratedCode({
            includeDocumentation: false,
            files: [path.resolve(__dirname, "./../../../src/tests/codeGeneration/resources/TestFile.ts")]
        });
        assert.equal(actualCode, expectedCode);
    });

    it("should equal the expected code", () => {
        const libraryName = "my-library-name";
        const actualCode = getGeneratedCode({
            includeDocumentation: true,
            files: [path.resolve(__dirname, "./../../../src/tests/codeGeneration/resources/TestFile.ts")],
            libraryName: libraryName
        });

        const documentation = getDocumentation({ libraryName });
        assert.equal(actualCode.substr(0, documentation.length), documentation);
    });

    it("should error when it can't find any file that extends the base class name", () => {
        assert.throws(() => {
            getGeneratedCode({
                includeDocumentation: false,
                files: []
            });
        }, "Could not find any classes that extends Routes");
    });

    it("should error when specifying a parameter in the route that does not exist in the method", () => {
        assert.throws(() => {
            getGeneratedCode({
                includeDocumentation: false,
                files: [path.resolve(__dirname, "./../../../src/tests/codeGeneration/resources/VerifyParameterNamesTestFile.ts")]
            });
        }, "The parameter noteID specified in the route does not exist on the method getMethod");
    });
});
