import * as gulp from 'gulp';
import * as replace from 'gulp-replace';
import * as fs from 'fs';

let dev_style = `link(rel='stylesheet' href='/au/src/app.css')`
  , dev_live = `script(src='/au/src/libs/live.js')`
;

/**
 * Write index with revisioned vendor bundle
 * and removed dev deps.
 */
export function readyIndex() {

  let files = fs.readdirSync('../au/scripts')
    , file = null as string
  ;

  files.forEach(f => {
    if (~f.indexOf('vendor') && f.split('-').length == 3) {
      file = f;
    }
  });

  if (!file) throw new Error('Build Aurelia with REV as true');

  return gulp.src('../au/index.pug')
    .pipe(replace('vendor-bundle.js', `${file}`))
    .pipe(replace(dev_style, ''))
    .pipe(replace(dev_live, ''))
    .pipe(gulp.dest('../staging/client'))
  ;
}


export function readyApp() {
   return gulp.src('../au/src/app.pug')
    .pipe(replace('//- require', 'require'))
    .pipe(gulp.dest('../au/src', {overwrite: true}))
  ;
}


export function readyCSS() {
  return gulp.src('../au/aurelia_project/tasks/build.ts')
    .pipe(replace('// processCSS,', 'processCSS,'))
    .pipe(gulp.dest('../au/aurelia_project/tasks', {overwrite: true}))
  ;
}


export function readyAurelia() {
  return gulp.src('../au/aurelia_project/aurelia.json')
    .pipe(replace('"rev": false', '"rev": true'))
    .pipe(gulp.dest('../au/aurelia_project'))
  ;
}