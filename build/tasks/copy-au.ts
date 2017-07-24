import * as gulp from 'gulp';

export default function copyScripts() {
  return gulp.src('../au/scripts/**.js')
        .pipe(gulp.dest('../staging/client/scripts'));
}