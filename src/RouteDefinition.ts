import {Method} from "./Method";

export interface RouteDefinition {
    method: Method;
    name: string;
    func: Function;
}
