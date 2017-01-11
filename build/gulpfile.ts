import * as gulp from 'gulp';
import cleanup from './tasks/cleanup';
import copyScripts from './tasks/copy-au'


gulp.task('release', gulp.parallel(
  copyScripts,
  cleanup
));