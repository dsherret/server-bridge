import {RouteDefinition} from "./RouteDefinition";

export class Routes {
    // do not put a default values on these properties because it will overwrite the prototype value
    routeDefinitions: RouteDefinition[];
    basePath: string;
}
