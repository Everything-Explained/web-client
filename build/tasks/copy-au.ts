import * as gulp from 'gulp';

export default function copyScripts() {
  return gulp.src('../au/scripts/**.js')
        .pipe(gulp.dest('../releaseV2/scripts'));
}