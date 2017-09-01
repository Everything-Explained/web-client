import * as gulp from 'gulp';
import * as gcat from 'gulp-concat';
import * as uglify from 'gulp-uglify';
import * as cleanCSS from 'gulp-clean-css';



gulp.task('concat-css', (done) => {
  gulp.src(['custom.css', 'styles.css'])
    .pipe(gcat('./styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('.'))
  ;
  done();
});

gulp.task('concat-js', (done) => {
  gulp.src(['./scripts/levels.js',
            './scripts/memory.js',
            './scripts/entry.js'])
    .pipe(gcat('./scripts.js'))
    .pipe(uglify({
      compress: true,
      mangle: true
    }))
    .pipe(gulp.dest('.'))
  ;
  done();
});


gulp.task('default', gulp.parallel('concat-js', 'concat-css'));

