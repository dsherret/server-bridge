decorator-routes
================

A wrapper around existing routing libraries to enable better syntax by using decorators.

## Example

Here's an example of what this might look like:

Define a contract:

```typescript
import {Note} from "./../models/note";

export interface INoteRoutes {
	get(noteID: string): Promise<Note>;
	set(note: Note): Promise<Note>;
}
```

Declare a route class:

```typescript
import {Use, Get, Post, Routes} from "decorator-routes";
import {StorageFactory} from "./../factories/storage-factory";
import {Note} from "./../models/note";
import {INoteRoutes} from "shared-libs";

@Use("/notes")
export class NoteRoutes extends Routes implements INoteRoutes {
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
import {Router} from "express";
import {initializeRoutes} from "decorator-routes-express";
import {NoteRoutes} from "./note-routes";

const router = express.Router();
initializeRoutes(router, NoteRoutes);
// use router here
```

Then the code that calls this will use the interface to have strong typing between the client and server. Need to think that out, but should be easy.