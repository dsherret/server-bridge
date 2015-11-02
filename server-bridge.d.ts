declare module "server-bridge" {
    import * as express from "express";

    export function getGeneratedCode(options: { importMapping?: { [importName: string]: string; }; }, ...fileNames: string[]): string;
    export function initializeRoutes(router: express.Router, routes: typeof Routes[]): void;
    export function Get(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(obj: Object) => Promise<any>>) => void;
    export function Post(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(sentObject: Object) => Promise<any>>) => void;
    export function Use(basePath?: string): (target: typeof Routes) => void;
    export class Routes {
        router: express.Router;
        routeInitializations: Array<(instance: Routes) => void>;
        basePath: string;
        constructor(router: express.Router);
        getPath(route: string): string;
    }
}
