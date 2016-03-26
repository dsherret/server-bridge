import {ArrayUtils} from "./ArrayUtils";

export class RouteParser {
    private urlParts: string[];
    private queryParameters: { [name: string]: string } = {};
    private isHttpString: boolean;

    constructor(routeString: string) {
        this.parse(routeString || "");
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

    getUrlCodeString() {
        let urlString = `"${this.getUrlPartsString() + this.getQueryParametersString()}"`;

        return urlString.replace(/\s\+\s\"\"$/, "");
    }

    private getUrlPartsString() {
        let str = "";

        if (this.isHttpString) {
            str += "http://";
        }
        else {
            str += "/";
        }

        return str + this.urlParts.map(p => this.handleString(p)).join("/");
    }

    private getQueryParametersString() {
        const queryNames = Object.keys(this.queryParameters);
        let str = "";

        if (queryNames.length > 0) {
            str += "?";

            const paramStrings: string[] = [];

            for (const name of queryNames) {
                const key = this.handleString(name);
                const value = this.handleString(this.queryParameters[name]);

                paramStrings.push(`${key}=${value}`);
            }

            str += paramStrings.join("&");
        }

        return str;
    }

    private handleString(str: string) {
        if (str[0] === ":") {
            return `" + ${str.substr(1)} + "`;
        }
        else {
            return str;
        }
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
        this.isHttpString = /^http:\/\//i.test(url);

        if (this.isHttpString) {
            url = url.substr(7);
        }

        this.urlParts = url.split("/").filter(p => p.length !== 0);
    }

    private parseQueryParameters(query: string) {
        query.split("&").forEach(p => {
            const equalsIndex = p.indexOf("=");

            if (equalsIndex === -1) {
                throw new Error(`A query parameter must have an equals sign: ${query}`);
            }

            const key = p.substr(0, equalsIndex);
            const value = p.substr(equalsIndex + 1);

            if (typeof this.queryParameters[key] === "undefined") {
                this.queryParameters[key] = value;
            }
        });
    }
}
