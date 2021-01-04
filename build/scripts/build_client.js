"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanClient = exports.copyClient = exports.compressToGzip = exports.compressToBrotli = exports.compileClient = void 0;
const gulp_brotli_1 = __importDefault(require("gulp-brotli"));
const zlib_1 = require("zlib");
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
function compressToBrotli() {
    return gulp_1.src([
        `${distDir}/**/*.js`,
        `${distDir}/**/*.css`,
        `${distDir}/index.html`
    ])
        .pipe(gulp_brotli_1.default.compress({
        extension: 'br',
        params: {
            [zlib_1.constants.BROTLI_PARAM_QUALITY]: zlib_1.constants.BROTLI_MAX_QUALITY
        }
    }))
        .pipe(gulp_1.dest(`${distDir}`));
}
exports.compressToBrotli = compressToBrotli;
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
        `!${releaseDir}/web_client/_data`
    ], { force: true });
}
exports.cleanClient = cleanClient;
