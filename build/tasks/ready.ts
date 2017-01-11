import * as gulp from 'gulp';
import * as replace from 'gulp-replace';

let dev_style = `link(rel='stylesheet' href='/au/src/app.css')`;

gulp.task('readyIndex', () => {
  return gulp.src('../au/index.pug')
  .pipe(replace(dev_style, ''))
  .pipe(gulp.dest('../releaseV2'));
});

gulp.task('readyApp', () => {
  return gulp.src('../au/src/app.pug')
  .pipe(replace('//- require', 'require'))
  .pipe(gulp.dest('../au/src', {overwrite: true}));
});


gulp.task('ready', ['readyApp', 'readyIndex']);