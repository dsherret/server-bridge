/// <reference path="../typings/express/express.d.ts" />
import * as express from "express";

export class Routes {
    routeInitializations: Array<(instance: Routes) => void>;
    basePath: string;

    constructor(public router: express.Router) {
        this.routeInitializations.forEach((item) => {
            item(this);
        });
    }

    // todo: move this out of this class and into its own file
    getPath(route: string) {
        if (route[0] != "/") {
            route = "/" + route;
        }

        route = this.basePath + route;

        if (route[0] != "/") {
            route = "/" + route;
        }

        return route;
    }

    static initializeRoutes(router: express.Router, ...routes: typeof Routes[]) {
        routes.forEach((route) => {
            const routerConstructor = route as any;
            new routerConstructor(router);
        });
    }
}