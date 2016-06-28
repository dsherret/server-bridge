/// <reference path="../../../typings/globals/es6-promise/index.d.ts" />
import {Use, Get, Post, Routes} from "./../../../main";
import {Note, TypeAlias} from "./TestTypes";

@Use("/notes")
export class NoteRoutes extends Routes {
    @Get("/:noteID")
    getMethod() { // should error because noteID is not specified
        return new Promise<number>(() => 12);
    }
}
