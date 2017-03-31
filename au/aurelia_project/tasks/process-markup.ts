import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import {build} from 'aurelia-cli';

let project =  require('../aurelia.json');

export default function processMarkup() {
  return gulp.src(project.markupProcessor.source)
    .pipe(changedInPlace({firstPass: true}))
    .pipe(build.bundle());
}
