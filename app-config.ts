import 'aurelia-animator-velocity'

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-animator-velocity');

  aurelia.start().then(a => a.setRoot());
}