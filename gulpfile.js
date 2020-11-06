/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

const watch = gulp.watch;


function parseCSS(cb) {
  gulp.src('./src/_app.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require('postcss-easy-import'),
      require('precss'),
    ]))
    .pipe(rename('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public'))
  ;
  cb();
}


function watchCSS() {
  watch(['./src/**.css', '!./src/main.css'], parseCSS);
}


exports.css = watchCSS;