
import * as gulp from 'gulp';
import * as gc from 'gulp-changed';
import * as del from 'del';
import * as replace from 'gulp-replace';

let bundle = require('aurelia-bundler').bundle;

let srcServer = ['../server/**/**.js', '../server/**/**.json', '!../server/node_modules/**', '../server/**/**.pem']

  , srcClient = [
      '**/**.js',
      '**/**.css',
      '!node_modules/**',
      '!jspm_packages/**',
      '!dist/**',
      '!build/**',
      '!.vscode/**',
      '!gulpfile.js',
      '!config.js',
      '!test.js',
      '**/**.pug',
      '**/**.png',
      '**/**.gif',
      '**/**.woff',
      '**/**.woff2',
      '**/changelog.json'
  ]

  , srcDist = [
    'dist/**/theme.css',
    'dist/**/**/fonts.css',
    'dist/**/**.woff',
    'dist/**/**.png',
    'dist/**/**.gif',

    'dist/**/**.pug',
    'dist/aurelia-build.js',
    'dist/app-build.js',
    'config.js',
    'dist/bootstrap.js',
    '**/system.js',
    '!node_modules/**'
  ]

  , config = {
    force: true,
    baseURL: '.',
    configPath: './config.js',
    bundles: {
      'dist/app-build': {
        includes: [
          '[**/**.js]'
        ],
        options: {
          inject: true,
          minify: true,
          depCache: true,
          rev: false
        }
      },
      'dist/aurelia-build': {
        includes: [
          'aurelia-framework',
          'aurelia-bootstrapper',
          'aurelia-router',
          'aurelia-animator-css',
          'aurelia-templating-binding',
          'aurelia-templating-resources',
          'aurelia-templating-router',
          'aurelia-loader-default',
          'aurelia-history-browser',
          'aurelia-logging-console',
          'optiscroll',
          'moment',
          'validator',
          'text'
        ],
        options: {
          inject: true,
          minify: true,
          depCache: false
        }
      },
    }
  };

gulp.task('copyServer', () => {
    return gulp.src(srcServer)
      .pipe(gc('../release/server'))
      .pipe(gulp.dest('../release/server'))
});

gulp.task('copyClient', () => {

  return gulp.src(srcClient)
    .pipe(gc('./dist'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['copyClient', 'copyServer'], () => {
  del(['dist/app-build.js', 'dist/aurelia-build.js'])
  return bundle(config);
})

gulp.task('release', ['build'], () => {
  del(['../release/client/config.js'])
  return gulp.src(srcDist)
    .pipe(gc('../release/client'))
    .pipe(replace(': "dist/*"', ': "*"'))
    .pipe(gulp.dest('../release/client'));
});