"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanClient = exports.copyClient = exports.deleteRawFiles = exports.compressToGzip = exports.compileClient = void 0;
// import brotli from 'gulp-brotli';
// import { constants } from 'zlib';
const vite_1 = require("vite");
const gulp_1 = require("gulp");
const del_1 = __importDefault(require("del"));
const gulp_gzip_1 = __importDefault(require("gulp-gzip"));
const root = '..';
const distDir = `${root}/dist`;
const releaseDir = `${root}/release`;
/**
 * Uses Vite to build a Vue project at the web client dir,
 * in production mode; built files are created in
 * `../<webclient>/dist`
 */
function compileClient() {
    return vite_1.build({
        root,
        mode: 'production',
    });
}
exports.compileClient = compileClient;
// export function compressToBrotli() {
//   return src([
//     `${distDir}/**/*.js`,
//     `${distDir}/**/*.css`,
//     `${distDir}/index.html`
//   ])
//   .pipe(brotli.compress({
//     extension: 'br',
//     params: {
//       [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY
//     }
//   }))
//   .pipe(dest(`${distDir}`));
// }
function compressToGzip() {
    return gulp_1.src([
        `${distDir}/**/*.js`,
        `${distDir}/**/*.css`,
        `${distDir}/index.html`
    ])
        .pipe(gulp_gzip_1.default({ append: true, gzipOptions: { level: 9 } }))
        .pipe(gulp_1.dest(`${distDir}`));
}
exports.compressToGzip = compressToGzip;
function deleteRawFiles() {
    return del_1.default([
        `${distDir}/assets/*.js`,
        `${distDir}/assets/*.css`,
        `${distDir}/index.html`,
    ], { force: true });
}
exports.deleteRawFiles = deleteRawFiles;
/** Copies all client files to the release dir */
function copyClient() {
    return gulp_1.src(`${distDir}/**`).pipe(gulp_1.dest(`${releaseDir}/web_client`));
}
exports.copyClient = copyClient;
/** Deletes all files in the client release dir */
function cleanClient() {
    return del_1.default([
        `${releaseDir}/web_client/**`,
        `!${releaseDir}/web_client`,
        `!${releaseDir}/web_client/version.txt`,
        `!${releaseDir}/web_client/_data`
    ], { force: true });
}
exports.cleanClient = cleanClient;
