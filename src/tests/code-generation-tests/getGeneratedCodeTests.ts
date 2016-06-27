import * as assert from "assert";
import {getGeneratedCode} from "./../../main";
import * as path from "path";

describe("getGeneratedCode", () => {
    const expectedCode =
`import {ClientBase} from "server-bridge-superagent-client";

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
    objectTypeAlias: { name: string; other?: TypeAliasReferencedInterface; };
}

export interface TypeAliasReferencedInterface {
    prop: string;
}

export class NoteRoutes extends ClientBase {
    constructor(options?: { urlPrefix: string; }) {
        super((options == null ? "" : (options.urlPrefix || "")) + "/notes");
    }

    getMethod(noteID: number) {
        return super.get<number>("/" + encodeURIComponent(noteID));
    }

    getMethodNoRoute(params: { text: string; }) {
        return super.get<number>("/getMethodNoRoute", params);
    }

    postMethod(note: Note) {
        return super.post<number>("/", note);
    }
}
`;

    it("should equal the expected code", () => {
        const actualCode = getGeneratedCode({
                includeDocumentation: false,
                files: [
                    path.resolve(__dirname, "./../../../src/tests/code-generation-tests/resources/TestFile.ts")
                ]
            });
        assert.equal(actualCode, expectedCode);
    });
});
