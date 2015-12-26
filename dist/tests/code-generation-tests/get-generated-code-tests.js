var assert = require("assert");
var main_1 = require("./../../main");
var path = require("path");
describe("getGeneratedCode", function () {
    var expectedCode = "\nimport {ClientBase} from \"server-bridge-superagent-client\";\nimport {Note} from \"note.ts\";\n\nexport class NoteRoutes extends ClientBase {\n   constructor(options?: { urlPrefix: string; }) {\n       super((options == null ? \"\" : (options.urlPrefix || \"\")) + \"/notes\");\n   }\n\n   getMethod(noteID: { noteID: string; test: number; }) {\n       return super.get<number>(\"/\", noteID);\n   }\n\n   postMethod(note: Note) {\n       return super.post<number>(\"/\", note);\n   }\n}\n";
    var actualCode = main_1.getGeneratedCode({
        includeDocumentation: false,
        importMapping: {
            "Note": "note.ts"
        }
    }, [path.resolve(__dirname, "./../../../src/tests/code-generation-tests/resources/test-file.ts")]);
    it("should equal the expected code", function () {
        assert.equal(actualCode, expectedCode);
    });
});

//# sourceMappingURL=get-generated-code-tests.js.map
