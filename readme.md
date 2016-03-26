server-bridge
=============

Code generation for a statically typed bridge between the client and server.

## What does this library do?

1. Helps you write code on the server that listens for requests.
2. Generates client-side code from the server-side code to send requests to the server.

## Example

### Server Side

1. Install `server-bridge`:

    ```
    npm install server-bridge --save
    typings install npm:server-bridge --save
    ```

2. Declare a route class that inherits from `Routes`. Add a `@Use` decorator with the path if necessary and then define `@Get` and `@Post` decorators on the methods similar to as shown:

    ```typescript
    // note-routes.ts
    import {Use, Get, Post, Routes} from "server-bridge";
    import {StorageFactory} from "./../factories/storage-factory";
    import {Note} from "./note";

    @Use("/notes")
    export class NoteRoutes extends Routes {
        @Get("/:noteID")
        get(noteID: string) {
            return StorageFactory.createNoteStorage().get(noteID);
        }

        @Post("/")
        set(note: Note) {
            return StorageFactory.createNoteStorage().set(note);
        }
    }
    ```

3. Install `server-bridge-express` to initialize routes for express:

    ```
    npm install server-bridge-express --save
    typings install npm:server-bridge-express --save
    ```

4. Initialize the routes with `server-bridge-express`

    ```typescript
    import * as express from "express";
    import {initializeRoutes} from "server-bridge-express";
    import {NoteRoutes} from "./note-routes";

    const router = express.Router();
    initializeRoutes(router, [NoteRoutes]);
    // use router when configuring express
    ```

### Client Side

1. Generate client side code from the server side code:

    ```typescript
    import {getGeneratedCode} from "server-bridge";
    import * as fs from "fs";

    // get the generated code
    const clientSideCode = getGeneratedCode({
        files: ["note-routes.ts"]
        classMapping: { "NoteRoutes": "NoteApi" },
        importMapping: { "Note": "./note" },
        libraryName: "server-bridge-superagent-client"
    });
    // write it to a file
    fs.writeFile("../my-client-application/src/server.ts", clientSideCode);
    ```

2. Install `server-bridge-superagent-client` in the client application by running:

    ```
    npm install server-bridge-superagent-client --save
    typings install npm:server-bridge-superagent-client --save
    ```

After generating the code, `server.ts` would contain the following code for use in a client-side application:

```typescript
import {ClientBase} from "server-bridge-superagent-client";
import {Note} from "./note";

export class NoteApi extends ClientBase {
    constructor(options?: {urlPrefix: string; }) {
        super((options == null ? "" : (options.urlPrefix || "")) + "/notes");
    }

    get(noteID: string) {
        return super.get<Note>("/" + noteID);
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
