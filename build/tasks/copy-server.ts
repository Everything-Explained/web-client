import * as gulp from 'gulp';
import * as path from 'path';
import * as replace from 'gulp-replace';

let baseDir = '../../server';

let serverFiles = [
  `${baseDir}/**/**.js`,
  `${baseDir}/config.json`,
  `${baseDir}/package.json`,
  `${baseDir}/**/**.pem`,
  `!${baseDir}/node_modules/**`
];


export function setProduction() {
  return gulp.src(`${baseDir}/run.bat`)
    .pipe(replace('=development', '=production'))
    .pipe(gulp.dest('../staging/server'));
}

export function copyServer() {
  return gulp.src(serverFiles)
    .pipe(gulp.dest('../staging/server'))
}

