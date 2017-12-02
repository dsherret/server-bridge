interface Options {
    classMapping?: { [className: string]: string };
    libraryName?: string;
    includeDocumentation?: boolean;
    files: string[];
}
interface RouteDefinition {
    method: Method;
    name: string;
    func: Function;
}

export class Routes {
    routeDefinitions: RouteDefinition[];
    basePath: string;
}

export function getGeneratedCode(options: Options): string;
export function Get(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(obj?: any) => any>) => void;
export function Post(route?: string): (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(sentObject: any) => any>) => void;
export function Use(basePath?: string): (target: typeof Routes) => void;

declare const enum Method {
    Get = 0,
    Post = 1
}
