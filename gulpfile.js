var gulp = require("gulp");
var del = require("del");
var istanbul = require("gulp-istanbul");
var mocha = require("gulp-mocha");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var replace = require("gulp-replace");
var merge = require("merge2");
var p = require("./package.json");

gulp.task("typescript", ["clean-scripts"], function() {
    var tsProject = ts.createProject("tsconfig.json", {
        typescript: require("typescript")
    });

    var tsResult = gulp.src(["./src/**/*.ts"])
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest('./dist')),
        tsResult.js.pipe(replace(/(}\)\()(.*\|\|.*;)/g, '$1/* istanbul ignore next */$2'))
            .pipe(replace(/(var __[a-z]+ = \(this && this.__[a-z]+\))/g, '$1/* istanbul ignore next */'))
            .pipe(replace(/(if \(!exports.hasOwnProperty\(p\)\))/g, '/* istanbul ignore else */ $1'))
            // ignore empty constructors (for mixins and static classes)
            .pipe(replace(/(function [A-Za-z]+\(\) {[\s\n\t]+})/g, '/* istanbul ignore next */ $1'))
            .pipe(gulp.dest("./dist"))
    ]);
});

gulp.task("pre-test", ["typescript"], function () {
    return gulp.src(["./dist/**/*.js", "!./dist/tests/**/*.js"])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["pre-test"], function() {
    return gulp.src(["dist/tests/**/*.js", "!dist/tests/**/resources/*.js"])
        .pipe(mocha({ reporter: "progress" }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
            thresholds: {
                global: {
                    statements: 90,
                    branches: 90,
                    functions: 90,
                    lines: 90
                }
            }
        }));
});

gulp.task("tslint", function() {
    return gulp.src(["./src/**/*.ts", "!./src/typings/**/*.d.ts"])
        .pipe(tslint({ formatter: "verbose" }))
        .pipe(tslint.report());
});

gulp.task("watch", function() {
    gulp.watch("./src/**/*.ts", ["tslint", "typescript"]);
});

gulp.task("clean-scripts", function(cb) {
    return del(["./dist/**/*{.js,.js.map}"], cb);
});

gulp.task("default", ["tslint", "typescript"]);
