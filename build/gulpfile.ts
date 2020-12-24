import gulp from 'gulp';
import { bundleMDPages } from './scripts/build_md';
const task     = gulp.task;
task('build-md', bundleMDPages);