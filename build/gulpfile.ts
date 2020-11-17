import gulp from 'gulp';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import csso from 'gulp-csso';


const watch = gulp.watch;


function parseCSS() {
  return gulp.src('../src/_app.css')
    .pipe(postcss([
        require('postcss-easy-import'),
        // require('precss'),
        require('autoprefixer'),
      ])
      .on('error', (err: NodeJS.ErrnoException) => {console.log(err);})
    )
    .pipe(csso({
      restructure: false,
    }))
    .pipe(rename('main.css'))
    .pipe(gulp.dest('../src'))
  ;
}


function watchCSS() {
  watch(['../src/**/**.css', '!../src/main.css'], parseCSS);
}

gulp.task('css', watchCSS);