import * as gulp from 'gulp';
import * as replace from 'gulp-replace';

export function copyChangelogs() {
  return gulp.src(['../au/src/views/changelog/**.json',
                   '../au/src/views/changelog/**/**.md'])
        .pipe(gulp.dest('../staging/client/views/changelog'));
}

export function copyStandalone() {
  let src = [
    '../../release/client/robots.txt',
    '../../release/client/favicon.ico'
  ];

  return gulp.src(src)
    .pipe(gulp.dest('../staging/client'));

}


export function copyLogs() {
  return gulp.src('../../release/server/logs/**/**')
    .pipe(gulp.dest('../staging/server/logs'));
}


export function copyIptable() {
  return gulp.src('../../release/server/iptable.json')
    .pipe(gulp.dest('../staging/server'));
}


export function copyAdmin() {
  let src = [
    '../admin/**/**.js',
    '../admin/**/**.pug',
    '../admin/**/**.css',
    '!../admin/node_modules/**',
    '../admin/package.json'
  ];

  return gulp.src(src)
    .pipe(gulp.dest('../staging/admin'));
}

export function copyStaticErrors() {
  let files = [
    '../static_errors/**.pug',
    '../au/src/style_utilities/static.css'
  ];

  return gulp.src(files)
    .pipe(replace('../au/src/style_utilities/static.css', 'static.css'))
    .pipe(gulp.dest('../staging/static_errors'));
}