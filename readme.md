decorator-routes
================

A wrapper around existing routing libraries to enable better syntax by using decorators.

This library is experimental and currently doesn't work exactly as explained here. So don't use it :)

## Example

## Server Side

Here's an example of what this might look like:

Declare a route class that inherits from `Routes`:

```typescript
// note-routes.ts
import {Use, Get, Post, Routes} from "decorator-routes";
import {StorageFactory} from "./../factories/storage-factory";
import {Note} from "shared-libs";

@Use("/notes")
export class NoteRoutes extends Routes {
    @Get("/:noteID")
    get(noteID: string) {
        return StorageFactory.createNoteStorage().get(noteID);
    }

    @Post("/")
    set(note: Note) {
        return StorageFactory.createNoteStorage().post(note);
    }
}
```

Then initialize all the routes:

```typescript
// rough idea code
import * as express from "express";
import {initializeRoutes} from "decorator-routes";
import {NoteRoutes} from "./note-routes";

const router = express.Router();
initializeRoutes(router, NoteRoutes);
// use router here
```

## Client Side

Client side code is generated automatically from the server side code.

```typescript
import {getGeneratedCode} from "decorator-routes";
    
const clientSideCode = getGeneratedCode({
    importMapping: { Note: "shared-lib" }
}, "note-routes.ts");
```
    
After doing this, `clientSideCode` would contain the following code for use in a client-side file:

```typescript
import {ClientBase } from "decorator-routes";
import {Note} from "shared-libs";

export class NoteRoutes extends ClientBase {
    constructor() {
        super("/notes");
    }

    get(noteID: string) {
        return this.get<Note>(`/${noteID}`);
    }

    set(note: Note) {
        return this.post<Note>("/", note);
    }
}
```

Which could then be used in the client like so:

import {NoteRoutes} from "./server";

const noteRoutes = new NoteRoutes();
noteRoutes.get(5).then((note) => {
    // use note here
});
