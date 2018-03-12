import * as gulp from 'gulp';
import * as replace from 'gulp-replace';
import * as fs from 'fs';


export function revertBuildCSS() {
  return gulp.src('../au/aurelia_project/tasks/build.ts')
    .pipe(replace('processCSS,', '// processCSS,'))
    .pipe(gulp.dest('../au/aurelia_project/tasks', {overwrite: true}))
  ;

}

export function revertAppCSS() {
  return gulp.src('../au/src/app.pug')
    .pipe(replace('require(', '//- require('))
    .pipe(gulp.dest('../au/src', {overwrite: true}))
  ;
}


/**
 * Delete revisioned files and remove new
 * revisions from dev build process.
 */
export function revertAureliaConfig() {

  let files = fs.readdirSync('../au/scripts');

  files.forEach(f => {
    if (f.split('-').length == 3) {
      fs.unlinkSync(`../au/scripts/${f}`);
    }
  });

  return gulp.src('../au/aurelia_project/aurelia.json')
    .pipe(replace('"rev": true', '"rev": false'))
    .pipe(gulp.dest('../au/aurelia_project'))
  ;
}