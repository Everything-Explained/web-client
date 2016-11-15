import * as gulp from 'gulp';
let stylus = require('gulp-stylus');
import * as gc from 'gulp-changed';

gulp.task('stylus', () => {

  let s = stylus();
  s.on('error', (err) => {
    console.log(err.message);
    s.emit('end');
  });

  return gulp.src('static/**/**.styl')
    .pipe(gc('./static', {
      extension: '.css'
    }))
    .pipe(s)
    .pipe(gulp.dest('./static'));
});

gulp.task('watch', () => {
  gulp.watch('static/**/**.styl', ['stylus']);
});