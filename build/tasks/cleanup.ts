import * as gulp from 'gulp';
import * as replace from 'gulp-replace';



export default function cleanup() {
  return gulp.src('../au/src/app.pug')
  .pipe(replace('require(', '//- require('))
  .pipe(gulp.dest('../au/src', {overwrite: true}));
}