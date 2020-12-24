/* eslint-disable @typescript-eslint/no-var-requires */
import gulp from 'gulp';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';

const watch = gulp.watch;

const styleDir = '../src/styles';

function parseCSS(cb: () => void) {
  return gulp.src(`${styleDir}/_main.css`)
    .pipe(postcss([
        require('postcss-easy-import'),
        require('postcss-media-variables'),
        require('postcss-css-variables'),
        require('autoprefixer'),
        require('postcss-media-variables'),
      ])
      .on('error', (err: NodeJS.ErrnoException) => { console.log(err.message); cb(); })
    )
    .pipe(rename('main.css'))
    .pipe(gulp.dest(`${styleDir}`))
  ;
}

export function buildCSS() {
  return (
    gulp.src(`${styleDir}/_main.css`)
      .pipe(postcss([
          require('postcss-easy-import'),
          require('postcss-media-variables'),
          require('postcss-css-variables'),
          require('postcss-media-variables'),
          require('postcss-sort-media-queries')({ sort: 'desktop-first' }),
          require('autoprefixer'),
          require('cssnano')({
            preset: 'advanced'
          })
        ])
        .on('error', (err: NodeJS.ErrnoException) => {console.log(err);})
      )
      .pipe(rename('main.css'))
      .pipe(gulp.dest(`${styleDir}`))
  );
}


export function watchCSS() {
  watch([`${styleDir}/**/**.css`, `!${styleDir}/main.css`], parseCSS);
}