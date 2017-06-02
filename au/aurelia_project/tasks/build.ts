import * as gulp from 'gulp';
import transpile from './transpile';
import processPug from './process-pug';
import processCSS from './process-css';
import copyFiles from './copy-files';
import {build} from 'aurelia-cli';
let project = require('../aurelia.json');

export default gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processPug,
    // processCSS,
    copyFiles
  ),
  writeBundles
);

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
