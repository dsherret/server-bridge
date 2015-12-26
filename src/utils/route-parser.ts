import {ArrayUtils} from "./array-utils";

export class RouteParser {
    private urlParts: string[];
    private queryParameters: { [name: string]: string } = {};
    private isHttpString = false;

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

    getUrl(params: { [key: string]: string; } = {}) {
        return this.getUrlPartsString(params) + this.getQueryParametersString(params);
    }

    private getUrlPartsString(params: { [key: string]: string; }) {
        let str = "";

        if (this.isHttpString) {
            str += "http://";
        }
        else {
            str += "/";
        }

        return str + this.urlParts.map(p => this.fillStringWithParams(p, params)).join("/");
    }

    private getQueryParametersString(params: { [key: string]: string; }) {
        const queryNames = Object.keys(this.queryParameters);
        let str = "";

        if (queryNames.length > 0) {
            str += "?";

            const paramStrings: string[] = [];

            for (const name of queryNames) {
                const key = this.fillStringWithParams(name, params);
                const value = this.fillStringWithParams(this.queryParameters[name], params);

                paramStrings.push(`${key}=${value}`);
            }

            str += paramStrings.join("&");
        }

        return str;
    }

    private fillStringWithParams(str: string, params: { [key: string]: string; }) {
        if (str[0] === ":") {
            const paramName = str.substr(1);

            if (typeof params[paramName] !== "undefined") {
                str = params[paramName];
            }
            else {
                throw new Error(`The following parameter was not specified: ${paramName}`);
            }
        }

        return str;
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
