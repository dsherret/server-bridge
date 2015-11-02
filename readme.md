server-bridge
=============

Code generation for a strongly typed bridge between the client and server.

This library is experimental and needs a bit of work, **so don't use it at this time!**

## What does this library do?

1. Help you write code on the server that listens for requests.
2. Generates client-side code from the server side code to send requests to the server.

## Example

## Server Side

Currently only express is supported on the server side.

Declare a route class that inherits from `Routes`:

```typescript
// note-routes.ts
import {Use, Get, Post, Routes} from "server-bridge";
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
import * as express from "express";
import {initializeRoutes} from "server-bridge";
import {NoteRoutes} from "./note-routes";

const router = express.Router();
initializeRoutes(router, [NoteRoutes]);
// use router here
```

## Client Side

Client side code can be generated automatically from the server side code.

```typescript
import {getGeneratedCode} from "server-bridge";
    
const clientSideCode = getGeneratedCode({
    classMapping: { "NoteRoutes": "NoteApi" },
    importMapping: { "Note": "./note" }
}, "note-routes.ts");
```

After doing this, `clientSideCode` would contain the following code for use in a client-side file:

```typescript
import {ClientBase} from "server-bridge-superagent-client";
import {Note} from "./note";

export class NoteApi extends ClientBase {
    constructor(options?: {urlPrefix: string; }) {
        super((options == null ? "" : (options.urlPrefix || "")) + "/notes");
    }

    get(noteID: string) {
        return super.get<Note>(`/${noteID}`);
    }

    set(note: Note) {
        return super.post<Note>("/", note);
    }
}
```

Which could then be used in the client like so:

```typescript
import {NoteApi} from "./server";

const notes = new NoteApi();
notes.get(5).then((note) => {
    // use note here
});
```

Note: Only superagent is supported client side right now.
