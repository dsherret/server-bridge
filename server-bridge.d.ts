declare module "server-bridge" {
    export function getGeneratedCode(options: { importMapping?: { [importName: string]: string; }; }, fileNames: string[]): string;
    export function Get(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(obj: Object) => Promise<any>>) => void;
    export function Post(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(sentObject: Object) => Promise<any>>) => void;
    export function Use(basePath?: string): (target: typeof Routes) => void;
    export class Routes {
        routeDefinitions: RouteDefinition[];
        basePath: string;
    }
    interface RouteDefinition {
        method: Method;
        name: string;
        func: Function;
    }
    const enum Method {
        Get = 0,
        Post = 1
    }
}
