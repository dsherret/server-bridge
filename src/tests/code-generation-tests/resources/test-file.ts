/// <reference path="../../../typings/es6-promise/es6-promise.d.ts" />
import {Use, Get, Post, Routes} from "server-bridge";
import {Note} from "./test-note";

@Use("/notes")
export class NoteRoutes extends Routes {
    @Get("/:noteID")
    getMethod(noteID: { noteID: string, test: number }) {
        return new Promise<number>(() => 12);
    }

    @Post("/")
    postMethod(note: Note) {
        return new Promise<number>(() => 5);
    }
}
