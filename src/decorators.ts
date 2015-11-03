import {Routes} from "./routes";
import {Method} from "./method";

export function Use(basePath: string = "") {
    return (target: typeof Routes) => {
        target.prototype.basePath = basePath;
    };
}

export function Get(route: string = null) {
    return baseMethodRoute(route, Method.Get);
}

export function Post(route: string = null) {
    return baseMethodRoute(route, Method.Post);
}

function baseMethodRoute(route: string, method: Method) {
    return (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(sentObject: Object) => Promise<any>>) => {
        if (route == null) {
            route = methodName;
        }

        target.routeDefinitions = target.routeDefinitions || [];
        target.routeDefinitions.push({
            method: method,
            name: route,
            func: descriptor.value
        });
    };
}
