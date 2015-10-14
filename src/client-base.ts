import * as request from "superagent";

export class ClientBase {
    constructor(private baseUrl: string) {
    }

    protected get<ReturnType>(url: string, args: Object = null) {
        const req = request.get(this.baseUrl + url);

        if (args != null) {
            req.query(args);
        }

        return new Promise<ReturnType>((resolve, reject) => {
            req.end((err: any, res: request.Response) => {
                if (err) {
                    reject(err);
                }

                resolve(res.body as ReturnType);
            });
        });
    }

    protected post<SendType, ReturnType>(url: string, sendObj: SendType, args: Object = null) {
        const req = request.post(this.baseUrl + url);

        if (args != null) {
            req.query(args);
        }

        req.send(sendObj);

        return new Promise<ReturnType>((resolve, reject) => {
            req.end((err: any, res: request.Response) => {
                if (err) {
                    reject(err);
                }

                resolve(res.body as ReturnType);
            });
        });
    }
}