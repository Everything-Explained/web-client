import * as gulp from 'gulp';
import * as replace from 'gulp-replace';

let dev_style = `link(rel='stylesheet' href='/au/src/app.css')`
  , dev_live = `script(src='/au/src/libs/live.js')`
;

export function readyIndex() {
  return gulp.src('../au/index.pug')
    .pipe(replace(dev_style, ''))
    .pipe(replace(dev_live, ''))
    .pipe(gulp.dest('../staging/client'));
}


export function readyApp() {
   return gulp.src('../au/src/app.pug')
    .pipe(replace('//- require', 'require'))
    .pipe(gulp.dest('../au/src', {overwrite: true}));
}


export function readyCSS() {
  return gulp.src('../au/aurelia_project/tasks/build.ts')
    .pipe(replace('// processCSS,', 'processCSS,'))
    .pipe(gulp.dest('../au/aurelia_project/tasks', {overwrite: true}));
}