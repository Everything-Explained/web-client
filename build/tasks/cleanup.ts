import * as gulp from 'gulp';
import * as replace from 'gulp-replace';


export function revertBuildCSS() {
  return gulp.src('../au/aurelia_project/tasks/build.ts')
    .pipe(replace('processCSS,', '// processCSS,'))
    .pipe(gulp.dest('../au/aurelia_project/tasks', {overwrite: true}));

}

export function revertAppCSS() {
  return gulp.src('../au/src/app.pug')
  .pipe(replace('require(', '//- require('))
  .pipe(gulp.dest('../au/src', {overwrite: true}));
}