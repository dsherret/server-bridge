/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />

declare module "decorator-routes" {
    import * as express from "express";

    export function getGeneratedCode(options: { importMapping?: { [importName: string]: string; }; }, ...fileNames: string[]): string;
    export function Get(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(obj: Object) => Promise<any>>) => void;
    export function Post(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(sentObject: Object) => Promise<any>>) => void;
    export function Use(basePath?: string): (target: Routes) => void;
    export class Routes {
        router: express.Router;
        routeInitializations: Array<(instance: Routes) => void>;
        basePath: string;
        constructor(router: express.Router);
        getPath(route: string): string;
        static initializeRoutes(router: express.Router, ...routes: typeof Routes[]): void;
    }
    export class ClientBase {
        private baseUrl;
        constructor(baseUrl: string);
        protected get<ReturnType>(url: string, args?: Object): Promise<ReturnType>;
        protected post<SendType, ReturnType>(url: string, sendObj: SendType, args?: Object): Promise<ReturnType>;
    }
}