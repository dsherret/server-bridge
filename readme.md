decorator-routes
================

A wrapper around existing routing libraries to enable better syntax by using decorators.

## Example

Here's an example of what this might look like:

First declare a route class:

```typescript
import {Use, Get, Post, Routes} from "decorator-routes";
import {StorageFactory} from "./../factories/storage-factory";
import {Note} from "./../models/note";

@Use("/notes")
export class NoteRoutes extends Routes {
    @Get("/:noteID")
    get(noteID: string) {
        return StorageFactory.createNoteStorage().get(noteID);
    }

    @Post("/")
    post(note: Note) {
        return StorageFactory.createNoteStorage().post(note);
    }
}
```

Then initialize all the routes:

```typescript
// rough idea code
import {Router} from "express";
import {initializeRoutes} from "decorator-routes-express";
import {NoteRoutes} from "./note-routes";

const router = express.Router();
initializeRoutes(router, NoteRoutes);
// use router here
```