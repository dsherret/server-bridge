import {Routes} from "./routes";
import {pathJoin} from "./utils/path-join";

export function Get(route: string = null) {
    return (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(obj: Object) => Promise<any>>) => {
        target.routeInitializations = target.routeInitializations || [];
        target.routeInitializations.push((instance) => {
            if (route == null) {
                route = methodName;
            }

            instance.router.get(pathJoin(instance.basePath, route), (req, res, next) => {
                return descriptor.value(req.params).then((result) => {
                    res.status(200);
                    res.setHeader("Content-Type", "application/json");
                    res.send(JSON.stringify(result));
                }).catch(err => next(err));
            });
        });
    };
}