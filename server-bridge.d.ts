declare module "server-bridge" {
    interface Options {
        classMapping?: { [className: string]: string };
        importMapping?: { [importName: string]: string };
        libraryName?: string;
        includeDocumentation?: boolean;
    }

    export function getGeneratedCode(options: Options, fileNames: string[]): string;
    export function Get(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(obj: any) => Promise<any>>) => void;
    export function Post(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(sentObject: any) => Promise<any>>) => void;
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
