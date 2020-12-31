"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanClient = exports.releasePageData = exports.copyPageData = exports.copyClient = exports.compressToGzip = exports.compressToBrotli = exports.compileClient = exports.compressDirs = void 0;
const gulp_brotli_1 = __importDefault(require("gulp-brotli"));
const zlib_1 = require("zlib");
const vite_1 = require("vite");
const gulp_1 = require("gulp");
const del_1 = __importDefault(require("del"));
const gulp_gzip_1 = __importDefault(require("gulp-gzip"));
const gulp_changed_1 = __importDefault(require("gulp-changed"));
const root = '..';
const distDir = `${root}/dist`;
const vueDist = `${distDir}/vue`;
const releaseDir = `${root}/release/web_client`;
exports.compressDirs = [
    `${vueDist}/**/*.js`,
    `${vueDist}/**/*.css`,
    `${vueDist}/**/*.json`,
    `${vueDist}/index.html`
];
/**
 * Uses Vite to build a Vue project at the web client dir,
 * in production mode; built files are created in
 * `../<webclient>/dist`
 */
function compileClient() {
    return vite_1.build({
        root,
        outDir: './dist/vue',
        mode: 'production',
    });
}
exports.compileClient = compileClient;
function compressToBrotli(dirs, dist, ext) {
    const options = { extension: ext ? `.${ext}.br` : '.br' };
    return function toBrotli() {
        return gulp_1.src(dirs)
            .pipe(gulp_changed_1.default(dist, options))
            .pipe(gulp_brotli_1.default.compress({
            extension: 'br',
            params: {
                [zlib_1.constants.BROTLI_PARAM_QUALITY]: zlib_1.constants.BROTLI_MAX_QUALITY
            }
        }))
            .pipe(gulp_1.dest(dist));
    };
}
exports.compressToBrotli = compressToBrotli;
function compressToGzip(dirs, dist, ext) {
    const options = { extension: ext ? `.${ext}.gz` : '.gz' };
    return function toGzip() {
        return gulp_1.src(dirs)
            .pipe(gulp_changed_1.default(dist, options))
            .pipe(gulp_gzip_1.default({ append: true, gzipOptions: { level: 9 } }))
            .pipe(gulp_1.dest(dist));
    };
}
exports.compressToGzip = compressToGzip;
/** Copies all client files to the release dir */
function copyClient() {
    return gulp_1.src(`${vueDist}/**`).pipe(gulp_1.dest(releaseDir));
}
exports.copyClient = copyClient;
function copyPageData() {
    return gulp_1.src([
        `${root}/src/views/blog/*.json`,
        `${root}/src/views/red33m/*.json`,
    ])
        .pipe(gulp_changed_1.default(`${distDir}/_data`))
        .pipe(gulp_1.dest(`${distDir}/_data`));
}
exports.copyPageData = copyPageData;
function releasePageData() {
    return gulp_1.src(`${distDir}/_data/**`)
        .pipe(gulp_changed_1.default(`${releaseDir}/_data`))
        .pipe(gulp_1.dest(`${releaseDir}/_data`));
}
exports.releasePageData = releasePageData;
/** Deletes all files in the client release dir */
function cleanClient() {
    return del_1.default([
        `${releaseDir}/**`,
        `!${releaseDir}/`,
    ], { force: true });
}
exports.cleanClient = cleanClient;
