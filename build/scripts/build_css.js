"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchCSS = exports.buildCSS = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const gulp_1 = __importDefault(require("gulp"));
const gulp_postcss_1 = __importDefault(require("gulp-postcss"));
const gulp_rename_1 = __importDefault(require("gulp-rename"));
const watch = gulp_1.default.watch;
const styleDir = '../src/styles';
function parseCSS(cb) {
    return gulp_1.default.src(`${styleDir}/_main.css`)
        .pipe(gulp_postcss_1.default([
        require('postcss-easy-import'),
        require('postcss-media-variables'),
        require('postcss-css-variables'),
        require('autoprefixer'),
        require('postcss-media-variables'),
    ])
        .on('error', (err) => { console.log(err.message); cb(); }))
        .pipe(gulp_rename_1.default('main.css'))
        .pipe(gulp_1.default.dest(`${styleDir}`));
}
function buildCSS() {
    return (gulp_1.default.src(`${styleDir}/_main.css`)
        .pipe(gulp_postcss_1.default([
        require('postcss-easy-import'),
        require('postcss-media-variables'),
        require('postcss-css-variables'),
        require('postcss-media-variables'),
        require('postcss-sort-media-queries')({ sort: 'desktop-first' }),
        require('autoprefixer'),
        require('cssnano')({
            preset: 'advanced'
        })
    ])
        .on('error', (err) => { console.log(err); }))
        .pipe(gulp_rename_1.default('main.css'))
        .pipe(gulp_1.default.dest(`${styleDir}`)));
}
exports.buildCSS = buildCSS;
function watchCSS() {
    watch([`${styleDir}/**/**.css`, `!${styleDir}/main.css`], parseCSS);
}
exports.watchCSS = watchCSS;
