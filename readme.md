decorator-routes
================

Enables better syntax when defining routes.

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
    async get(noteID: string) {
        return await StorageFactory.createNoteStorage().get(noteID);
    }

    @Post("/")
    async post(note: Note) {
        return await StorageFactory.createNoteStorage().post(note);
    }
}
```

Then initialize all the routes:

```typescript
// rough idea code
import {Router} from "express";
import {initializeForExpress} from "decorator-routes";
import {NoteRoutes} from "./note-routes";

const router = express.Router();
initializeForExpress(router, NoteRoutes);
```