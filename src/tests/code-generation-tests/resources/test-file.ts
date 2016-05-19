/// <reference path="../../../typings/globals/es6-promise/index.d.ts" />
import {Use, Get, Post, Routes} from "server-bridge";
import {Note} from "./test-note";

@Use("/notes")
export class NoteRoutes extends Routes {
    @Get("/:noteID")
    getMethod(noteID: number) {
        // dummy code
        return new Promise<number>(() => 12);
    }

    @Post("/")
    postMethod(note: Note) {
        // dummy code
        return new Promise<number>(() => 5);
    }
}
