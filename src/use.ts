import {Routes} from "./routes";

export function Use(basePath: string = "") {
    return (target: Routes) => {
        target.basePath = basePath;
    };
}