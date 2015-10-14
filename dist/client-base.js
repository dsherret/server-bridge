/// <reference path="../typings/superagent/superagent.d.ts" />
var request = require("superagent");
var ClientBase = (function () {
    function ClientBase(baseUrl) {
        this.baseUrl = baseUrl;
    }
    ClientBase.prototype.get = function (url, args) {
        if (args === void 0) { args = null; }
        var req = request.get(this.baseUrl + url);
        if (args != null) {
            req.query(args);
        }
        return new Promise(function (resolve, reject) {
            req.end(function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res.body);
            });
        });
    };
    ClientBase.prototype.post = function (url, sendObj, args) {
        if (args === void 0) { args = null; }
        var req = request.post(this.baseUrl + url);
        if (args != null) {
            req.query(args);
        }
        req.send(sendObj);
        return new Promise(function (resolve, reject) {
            req.end(function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res.body);
            });
        });
    };
    return ClientBase;
})();
exports.ClientBase = ClientBase;
