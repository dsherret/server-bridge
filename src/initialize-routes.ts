import * as express from "express";
import {Routes} from "./routes";

export function initializeRoutes(router: express.Router, routes: typeof Routes[]) {
    routes.forEach((route) => {
        const routerConstructor = route as any;
        new routerConstructor(router);
    });
}
