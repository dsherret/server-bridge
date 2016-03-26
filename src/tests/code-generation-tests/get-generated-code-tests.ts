import * as assert from "assert";
import {getGeneratedCode} from "./../../main";
import * as path from "path";

describe("getGeneratedCode", () => {
    const expectedCode =
`import {ClientBase} from "server-bridge-superagent-client";
import {Note} from "note.ts";

export class NoteRoutes extends ClientBase {
    constructor(options?: { urlPrefix: string; }) {
        super((options == null ? "" : (options.urlPrefix || "")) + "/notes");
    }

    getMethod(noteID: number) {
        return super.get<number>("/" + noteID);
    }

    postMethod(note: Note) {
        return super.post<number>("/", note);
    }
}
`;

    const actualCode = getGeneratedCode({
            includeDocumentation: false,
            importMapping: {
                "Note": "note.ts"
            },
            files: [
                path.resolve(__dirname, "./../../../src/tests/code-generation-tests/resources/test-file.ts"),
                path.resolve(__dirname, "./../../../src/tests/code-generation-tests/resources/test-note.ts")
            ]
        });

    it("should equal the expected code", () => {
        assert.equal(actualCode, expectedCode);
    });
});
