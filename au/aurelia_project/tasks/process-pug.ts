
import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as sourcemaps from 'gulp-sourcemaps';
import * as pug from 'gulp-pug';
import {build} from 'aurelia-cli';
let project =  require('../aurelia.json');

export default function processMarkup() {

  let p = pug();

  p.on('error', err => {
    console.log(err.message);
    p.emit('end');
  });

  return gulp.src(project.markupProcessor.source)
    .pipe(changedInPlace({firstPass: true}))
    .pipe(sourcemaps.init())
    .pipe(p)
    .pipe(build.bundle());
}