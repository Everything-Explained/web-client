import gulp from 'gulp';
import { cleanClient, compileClient, compressToGzip, copyClient, deleteRawFiles } from './scripts/build_client';

process.env.NODE_ENV = 'production';

const task     = gulp.task;
const parallel = gulp.parallel;
const series   = gulp.series;

task('release',
  series(
    compileClient,
    parallel(compressToGzip, cleanClient),
    deleteRawFiles,
    copyClient
  )
);