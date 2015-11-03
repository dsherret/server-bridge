import {Method} from "./method";

export interface RouteDefinition {
    method: Method;
    name: string;
    func: Function;
}
