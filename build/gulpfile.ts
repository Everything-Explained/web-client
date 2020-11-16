import gulp from 'gulp';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';


const watch = gulp.watch;


function parseCSS() {
  return gulp.src('../src/_app.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require('postcss-easy-import'),
      // require('precss'),
      // require('autoprefixer'),
      // require('postcss-csso')
    ])
    .on('error', (err) => {console.log(err.message);})
    .on('warning', (warn) => { console.log(warn.message);}))
    .pipe(rename('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('../public'))
  ;
}


function watchCSS() {
  watch(['../src/**/**.css', '!../src/main.css'], parseCSS);
}

gulp.task('css', watchCSS);