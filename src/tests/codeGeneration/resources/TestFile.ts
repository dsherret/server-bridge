/// <reference path="../../../typings/globals/es6-promise/index.d.ts" />
import {Use, Get, Post, Routes} from "./../../../main";
import {Note, TypeAlias} from "./TestTypes";

@Use("/notes")
export class NoteRoutes extends Routes {
    @Get("/:noteID")
    getMethod(noteID: number) {
        return new Promise<number>(() => 12);
    }

    @Post("/")
    postMethod(note: Note) {
        return new Promise<number>(() => 5);
    }

    @Post()
    postAliasMethod(alias: TypeAlias) {
    }
}

export class RoutesWithoutUse extends Routes {
    @Get()
    getMethodNoRoute(params: { text: string }) {
        return new Promise<number>(() => 12);
    }
}
