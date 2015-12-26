import {ArrayUtils} from "./array-utils";

export class RouteParser {
    private urlParts: string[];
    private queryParameters: { [name: string]: string } = {};

    constructor(routeString: string) {
        this.parse(routeString);
    }

    getParameterNames() {
        const queryParameterKeys = Object.keys(this.queryParameters);
        const queryParameterValues = queryParameterKeys.map(k => this.queryParameters[k]);
        const parameterNames = this.urlParts.filter(p => p[0] === ":")
            .concat(queryParameterKeys.filter(n => n[0] === ":"))
            .concat(queryParameterValues.filter(v => v[0] === ":"))
            .map(p => p.substr(1));

        return ArrayUtils.getUniqueInStringArray(parameterNames);
    }

    private parse(routeString: string) {
        const questionMarkIndex = routeString.indexOf("?");

        if (questionMarkIndex >= 0) {
            this.parseUrlParts(routeString.substr(0, questionMarkIndex));
            this.parseQueryParameters(routeString.substr(questionMarkIndex + 1));
        }
        else {
            this.parseUrlParts(routeString);
        }
    }

    private parseUrlParts(url: string) {
        this.urlParts = url.split("/").filter(p => p.length !== 0);
    }

    private parseQueryParameters(query: string) {
        query.split("&").forEach(p => {
            const equalsIndex = p.indexOf("=");

            if (equalsIndex === -1) {
                throw new Error(`A query parameter must have an equals sign: ${query}`);
            }

            this.queryParameters[p.substr(0, equalsIndex)] = p.substr(equalsIndex + 1);
        });
    }
}
