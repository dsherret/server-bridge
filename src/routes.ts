import * as express from "express";

export class Routes {
    routeInitializations: Array<(instance: Routes) => void>;
    basePath: string;

    constructor(public router: express.Router) {
        this.routeInitializations.forEach((item) => {
            item(this);
        });
    }
}
