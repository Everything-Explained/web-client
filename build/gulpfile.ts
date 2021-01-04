import gulp from 'gulp';
import { cleanClient, compileClient, compressToBrotli, compressToGzip, copyClient } from './scripts/build_client';

process.env.NODE_ENV = 'production';

const task     = gulp.task;
const parallel = gulp.parallel;
const series   = gulp.series;

task('release',
  series(
    compileClient,
    parallel(compressToBrotli, compressToGzip, cleanClient),
    copyClient
  )
);