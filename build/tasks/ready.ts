import * as gulp from 'gulp';
import * as replace from 'gulp-replace';
let hash = require('custom-hash');
import * as fs from 'fs';

let dev_style = `link(rel='stylesheet' href='/au/src/app.css')`
  , dev_live = `script(src='/au/src/libs/live.js')`
;

export function readyIndex() {

  // Apply cache-busting to vendor bundle
  let app = fs.readFileSync('../au/scripts/app-bundle.js').toString('utf-8');
  hash.configure({ maxLength: 10 });
  let appHash = hash.digest(app);

  return gulp.src('../au/index.pug')
    .pipe(replace('vendor-bundle.js', `vendor-bundle.js?v=${appHash}`))
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