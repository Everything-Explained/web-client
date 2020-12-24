"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
const build_md_1 = require("./scripts/build_md");
const build_client_1 = require("./scripts/build_client");
const build_css_1 = require("./scripts/build_css");
const task = gulp_1.default.task;
const parallel = gulp_1.default.parallel;
const series = gulp_1.default.series;
task('release', series(parallel(build_md_1.bundleMDPages, build_css_1.buildCSS), build_client_1.compileClient, parallel(build_client_1.compressToBrotli, build_client_1.compressToGzip, build_client_1.cleanClient), build_client_1.copyClient));
task('compress', build_client_1.compressToBrotli);
task('build-md', build_md_1.bundleMDPages);
task('watch-css', build_css_1.watchCSS);
