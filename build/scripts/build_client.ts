import brotli from 'gulp-brotli';
import { constants } from 'zlib';
import { build } from 'vite';
import { src, dest } from 'gulp';
import del from 'del';
import gzip from 'gulp-gzip';

const root = '../';
const distDir = `${root}/dist`;
const releaseDir = `${root}/release`;

/**
 * Uses Vite to build a Vue project at the web client dir,
 * in production mode; built files are created in
 * `../<webclient>/dist`
 */
export function compileClient() {
  return build({
    root,
    mode: 'production',
  });
}


export function compressToBrotli() {
  return src([
    `${distDir}/**/*.js`,
    `${distDir}/**/*.css`,
    `${distDir}/index.html`
  ])
  .pipe(brotli.compress({
    extension: 'br',
    params: {
      [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY
    }
  }))
  .pipe(dest(`${distDir}`));
}


export function compressToGzip() {
  return src([
    `${distDir}/**/*.js`,
    `${distDir}/**/*.css`,
    `${distDir}/index.html`
  ])
  .pipe(gzip({ append: true, gzipOptions: { level: 9 }}))
  .pipe(dest(`${distDir}`));
}

/** Copies all client files to the release dir */
export function copyClient() {
  return src(`${distDir}/**`).pipe(dest(`${releaseDir}/web_client`));
}


/** Deletes all files in the client release dir */
export function cleanClient() {
  return del([
    `${releaseDir}/web_client/**`,
    `!${releaseDir}/web_client`,
  ], { force: true });
}