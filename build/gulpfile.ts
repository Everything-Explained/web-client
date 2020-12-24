import gulp from 'gulp';
import { bundleMDPages } from './scripts/build_md';
import { cleanClient, compileClient, compressToBrotli, compressToGzip, copyClient } from './scripts/build_client';
import { buildCSS, watchCSS } from './scripts/build_css';


const task     = gulp.task;
const parallel = gulp.parallel;
const series   = gulp.series;

task('release',
  series(
    parallel(bundleMDPages, buildCSS),
    compileClient,
    parallel(compressToBrotli, compressToGzip, cleanClient),
    copyClient
  )
);

task('compress', compressToBrotli);
task('build-md', bundleMDPages);
task('watch-css', watchCSS);