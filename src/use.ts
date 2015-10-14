import {Routes} from "./routes";

export function Use(basePath: string = "") {
    return (target: typeof Routes) => {
        target.prototype.basePath = basePath;
    };
}