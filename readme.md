server-bridge
=============

[![npm version](https://badge.fury.io/js/server-bridge.svg)](https://badge.fury.io/js/server-bridge) [![Build Status](https://travis-ci.org/dsherret/server-bridge.svg?branch=master)](https://travis-ci.org/dsherret/server-bridge?branch=master)
[![Coverage Status](https://coveralls.io/repos/dsherret/server-bridge/badge.svg?branch=master&service=github)](https://coveralls.io/github/dsherret/server-bridge?branch=master)


Code generation for a statically typed bridge between the client and server.

## What does this library do?

1. Helps you write code on the server that listens for requests.
2. Generates client-side code from the server-side code to send requests to the server.

## Advantages

1. You don't have to write the client-side code to send requests.
2. After code generation, your client-side code will throw a compile error if a breaking change happened so you won't ever forget to update your client-side code.
3. Auto-completion will show you what is expected to be sent to the server.
4. The interfaces that describe what data is being sent/received from the server are automatically included in your client application.

## Current Support

Only express (server) and super-agent (client) are supported right now, but more support can be trivially added.
If there's something you would like open up an issue and I'll take a look at it.

## Example

A simple client-server example can be found [here](https://github.com/dsherret/server-bridge-example).

### Server Side

1. Install `server-bridge`:

    ```
    npm install server-bridge --save
    ```

2. Declare a route class that inherits from `Routes`. Add a `@Use` decorator with the path if necessary and then define `@Get` and `@Post` decorators on the methods similar to as shown:

    ```typescript
    // NoteRoutes.ts
    import {Use, Get, Post, Routes} from "server-bridge";
    import {Note} from "./Note";

    @Use("/notes")
    export class NoteRoutes extends Routes {
        static memoryNoteStorage: Note[] = [];

        // uses the method name for the path if none specified: /notes/getAll
        @Get()
        getAll() {
            console.log("Client requested to get all the notes.");
            // if you need to do any async work here then return a Promise instead
            return NoteRoutes.memoryNoteStorage;
        }

        @Get("/")
        getAllWithText(params: { text: string; }) { // query parameters need to be stored in an object
            const {text} = params;
            console.log(`Client requested to get all the note containing text: ${text}.`);
            return NoteRoutes.memoryNoteStorage.filter(n => n.text.indexOf(text) >= 0);
        }

        @Post("/")
        add(note: Note) {
            console.log("Client requested to add a note.");
            NoteRoutes.memoryNoteStorage.push(note);
        }
    }
    ```

3. Install `server-bridge-express` to initialize routes for express:

    ```
    npm install server-bridge-express --save
    ```

4. Initialize the routes with `initializeRoutes` from `server-bridge-express`

    ```typescript
    // index.ts
    import * as express from "express";
    import * as bodyParser from "body-parser";
    import {initializeRoutes} from "server-bridge-express";
    import {NoteRoutes} from "./NoteRoutes";

    const SERVER_PORT = 8082;
    const app = express();
    const router = express.Router();

    initializeRoutes(router, [NoteRoutes]);
    app.use(bodyParser.json());
    app.use("/", router);

    const server = app.listen(SERVER_PORT, () => {
        console.log(`Running on port ${server.address().port}`);
    });
    ```

### Client Side

1. Generate client side code from the server side code:

    ```typescript
    import * as fs from "fs";
    import {getGeneratedCode} from "server-bridge";

    // get the generated code
    const clientSideCode = getGeneratedCode({
        files: ["src/NoteRoutes.ts"],
        classMapping: { "NoteRoutes": "NoteApi" },
        libraryName: "server-bridge-superagent-client"
    });
    // write it to a file in the client application
    fs.writeFile("../client/src/server.ts", clientSideCode);
    ```

2. Install `server-bridge-superagent-client` in the client application by running:

    ```
    npm install server-bridge-superagent-client --save
    ```

After generating the code, `server.ts` would contain the following code for use in a client-side application:

```typescript
import {ClientBase} from "server-bridge-superagent-client";

export interface Note {
    text: string;
    creationDate: Date;
}

export interface INoteApi {
    getAll(): Promise<Note[]>;
    getAllWithText(params: { text: string; }): Promise<Note[]>;
    add(note: Note): Promise<void>;
}

export class NoteApi extends ClientBase implements INoteApi {
    constructor(options?: { urlPrefix: string; }) {
        super((options == null ? "" : (options.urlPrefix || "")) + "/notes");
    }

    getAll() {
        return super.get<Note[]>("/getAll");
    }

    getAllWithText(params: { text: string; }) {
        return super.get<Note[]>("/", params);
    }

    add(note: Note) {
        return super.post<void>("/", note);
    }
}
```

Which could then be used in the client like so:

```typescript
import {NoteApi} from "./server";

const notes = new NoteApi({ urlPrefix: "http://localhost:8082" });
notes.getAll().then((notes) => {
    // use notes here
});
```

#### Dependency: Promises

ES6 promises are used in the client application. If you are using an environment that doesn't support ES6 promises, then install the `es6-promise` package:

```
npm install es6-promise --save
typings install dt~es6-promise --save --global
```

And run the polyfill by running the following code when your application starts:

```
import "es6-promise";
```
