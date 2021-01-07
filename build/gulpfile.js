"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
const build_client_1 = require("./scripts/build_client");
process.env.NODE_ENV = 'production';
const task = gulp_1.default.task;
const parallel = gulp_1.default.parallel;
const series = gulp_1.default.series;
task('release', series(build_client_1.compileClient, parallel(build_client_1.compressToGzip, build_client_1.cleanClient), build_client_1.deleteRawFiles, build_client_1.copyClient));
