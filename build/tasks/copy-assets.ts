import * as gulp from 'gulp';
import * as replace from 'gulp-replace';

export function copyChangelogs() {
  return gulp.src(['../au/src/views/changelog/**.json',
                   '../au/src/views/changelog/**/**.pug',
                   '!../au/src/views/changelog/changelog.pug'])
        .pipe(gulp.dest('../releaseV2/client/views/changelog'))
}

export function copyAdmin() {
  let src = [
    '../admin/**/**.js',
    '../admin/**/**.pug',
    '../admin/**/**.css',
    '!../admin/node_modules/**',
    '../admin/package.json'
  ]

  return gulp.src(src)
    .pipe(gulp.dest('../releaseV2/admin'))
}

export function copyStaticErrors() {
  let files = [
    '../static_errors/**.pug',
    '../au/src/style_utilities/static.css'
  ]

  return gulp.src(files)
    .pipe(replace('../au/src/style_utilities/static.css', 'static.css'))
    .pipe(gulp.dest('../releaseV2/static_errors'));
}