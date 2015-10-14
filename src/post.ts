import {Routes} from "./routes";

export function Post(route: string = null) {
    return (target: Routes, methodName: string, descriptor: TypedPropertyDescriptor<(sentObject: Object) => Promise<any>>) => {
        target.routeInitializations = target.routeInitializations || [];
        target.routeInitializations.push((instance) => {
            if (route == null) {
                route = methodName;
            }
            
            instance.router.post(instance.getPath(route), (req, res, next) => {
                const sentObject = req.body;

                return descriptor.value(sentObject).then((result) => {
                    res.send(result);
                }).catch(err => next(err));
            });
        });
    };
}