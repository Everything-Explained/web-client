import gulp from 'gulp';
import { bundleMDPages } from './scripts/build_md';
import { cleanClient, compileClient, compressToBrotli, compressToGzip, copyClient, copyPageData, compressDirs, releasePageData } from './scripts/build_client';
import { buildCSS, watchCSS } from './scripts/build_css';


const task     = gulp.task;
const parallel = gulp.parallel;
const series   = gulp.series;

task('release',
  series(
    parallel(buildCSS),
    compileClient,
    parallel(compressToBrotli(compressDirs, '../dist/vue'), compressToGzip(compressDirs, '../dist/vue'), cleanClient),
    copyClient
  )
);

task('build-md',
  series(
    bundleMDPages,
    copyPageData,
    parallel(
      compressToBrotli(['../dist/_data/*.json'], '../dist/_data', 'json'),
      compressToGzip(['../dist/_data/*.json'], '../dist/_data', 'json')
    ),
    releasePageData
  )
);
task('watch-css', watchCSS);