import * as gulp from 'gulp';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import processPug from './process-pug';
import {build} from 'aurelia-cli';
let project = require('../aurelia.json');

export default gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processPug,
    // processMarkup,
    // processCSS
  ),
  writeBundles
);

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
