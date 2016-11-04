
import * as gulp from 'gulp';
import * as gc from 'gulp-changed';
import * as del from 'del';
import * as replace from 'gulp-replace';
import * as fs from 'fs';

let bundle = require('aurelia-bundler').bundle;

let srcServer = [
      '!../server/node_modules/**',
      '!../server/.vscode/**',
      '../server/**/**.js',
      '../server/**/**.json',
      '../server/**/**.pem'
  ]

  , srcClient = [
      '!node_modules/**',
      '!**/node_modules/**',
      '!jspm_packages/**',
      '!build/**',
      '!.vscode/**',
      '!dist/**',
      '**/**.js',
      '**/**.css',
      '!gulpfile.js',
      '!config.js',
      '!test.js',
      '**/**.pug',
      '**/changelog.json',
      'robots.txt'
  ]

  , srcClientAssets = [
      '!node_modules/**',
      '!**/node_modules/**',
      '!jspm_packages/**',
      '!dist/**',
      '!build/**',
      '!.vscode/**',
      '**/**.png',
      '**/**.gif',
      '**/**.ico'
  ]

  , srcStatic = [
      '!static/node_modules/**',
      '!static/.vscode/**',
      'static/**/**.css',
      'static/**/**.js',
      'static/**/**.pug'
  ]

  , srcDist = [
    'dist/**/**.**',
    'config.js',
    '**/system.js'
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
              .pipe(gulp.dest('../release/server'));
});



gulp.task('copyClient', () => {
  return gulp.src(srcClient)
            .pipe(gc('./dist'))
            .pipe(gulp.dest('./dist'));
});

gulp.task('copyStatic', () => {
  return gulp.src(srcStatic)
            .pipe(gc('../release/client/static'))
            .pipe(gulp.dest('../release/client/static'));
});

gulp.task('copyAssets', () => {
  return gulp.src(srcClientAssets)
            .pipe(gulp.dest('./dist'));
});


gulp.task('readyConfig', () => {
  del(['../release/client/config.js']);
  let configFile = fs.readFileSync('config.js', 'ASCII');
  fs.writeFileSync('config.js.tmp', configFile);

  configFile = configFile.replace(': "*"', ': "dist/*"');
  fs.writeFileSync('config.js', configFile);
  return true;
});



gulp.task('build', ['readyConfig', 'copyClient', 'copyServer', 'copyAssets'], () => {
  del(['dist/app-build.js', 'dist/aurelia-build.js']);
  return bundle(config);
});



gulp.task('releaseFiles', ['build'], () => {
  return gulp.src(srcDist)
            .pipe(replace(': "dist/*"', ': "*"'))
            .pipe(gulp.dest('../release/client'));
});



gulp.task('release', ['releaseFiles'], () => {
  let configFile = fs.readFileSync('config.js.tmp', 'ASCII');
  fs.writeFileSync('config.js', configFile);
  del(['config.js.tmp']);
  return true;
});