/// <reference path="../../../../node_modules/@types/es6-promise/index.d.ts" />
import {Use, Get, Routes} from "./../../../main";

@Use("/notes")
export class NoteRoutes extends Routes {
    @Get("/:noteID")
    getMethod() { // should error because noteID is not specified
        return new Promise<number>(() => 12);
    }
}
