import * as assert from "assert";
import {Use, Get, Post} from "./../decorators";
import {Method} from "./../Method";
import {Routes} from "./../Routes";

describe("decorators", () => {
    describe("MyClass", () => {
        @Use("use-string")
        class MyClass extends Routes {
            @Get("get-string")
            myGetMethod() {
            }

            @Post("post-string")
            myPostMethod() {
            }

            @Get()
            myGetMethodNoRoute() {
            }

            @Post()
            myPostMethodNoRoute() {
            }
        }

        it(`should have the correct base path`, () => {
            assert.equal(MyClass.prototype.basePath, "use-string");
        });

        describe("get method", () => {
            it(`should have the right function`, () => {
                assert.equal(MyClass.prototype.routeDefinitions[0].func, MyClass.prototype.myGetMethod);
            });

            it(`should have the right route name`, () => {
                assert.equal(MyClass.prototype.routeDefinitions[0].name, "get-string");
            });

            it(`should have the right method`, () => {
                assert.equal(MyClass.prototype.routeDefinitions[0].method, Method.Get);
            });
        });

        describe("post method", () => {
            it(`should have the right function`, () => {
                assert.equal(MyClass.prototype.routeDefinitions[1].func, MyClass.prototype.myPostMethod);
            });

            it(`should have the right route name`, () => {
                assert.equal(MyClass.prototype.routeDefinitions[1].name, "post-string");
            });

            it(`should have the right method`, () => {
                assert.equal(MyClass.prototype.routeDefinitions[1].method, Method.Post);
            });
        });

        describe("get method no route", () => {
            it(`should have the right route name`, () => {
                assert.equal(MyClass.prototype.routeDefinitions[2].name, "myGetMethodNoRoute");
            });
        });

        describe("post method no route", () => {
            it(`should have the right route name`, () => {
                assert.equal(MyClass.prototype.routeDefinitions[3].name, "myPostMethodNoRoute");
            });
        });
    });

    describe("MyClassNoUseStr", () => {
        @Use()
        class MyClassNoUseStr extends Routes {
        }

        it(`should have the correct base path`, () => {
            assert.equal(MyClassNoUseStr.prototype.basePath, "");
        });
    });
});
