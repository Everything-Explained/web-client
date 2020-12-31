import brotli from 'gulp-brotli';
import { constants } from 'zlib';
import { build } from 'vite';
import { src, dest } from 'gulp';
import del from 'del';
import gzip from 'gulp-gzip';
import changed from 'gulp-changed';

const root         = '..';
const distDir      = `${root}/dist`;
const vueDist      = `${distDir}/vue`;
const releaseDir   = `${root}/release/web_client`;
export const compressDirs = [
  `${vueDist}/**/*.js`,
  `${vueDist}/**/*.css`,
  `${vueDist}/**/*.json`,
  `${vueDist}/index.html`
];

/**
 * Uses Vite to build a Vue project at the web client dir,
 * in production mode; built files are created in
 * `../<webclient>/dist`
 */
export function compileClient() {
  return build({
    root,
    outDir: './dist/vue',
    mode: 'production',
  });
}


export function compressToBrotli(dirs: string[], dist: string, ext?: string) {
  const options = { extension: ext ? `.${ext}.br` : '.br' };
  return function toBrotli() {
    return src(dirs)
      .pipe(changed(dist, options))
      .pipe(brotli.compress({
        extension: 'br',
        params: {
          [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY
        }
      }))
      .pipe(dest(dist));
  };
}


export function compressToGzip(dirs: string[], dist: string, ext?: string) {
  const options = { extension: ext ? `.${ext}.gz` : '.gz' };
  return function toGzip() {
    return src(dirs)
      .pipe(changed(dist, options))
      .pipe(gzip({ append: true, gzipOptions: { level: 9 }}))
      .pipe(dest(dist));
  };
}

/** Copies all client files to the release dir */
export function copyClient() {
  return src(`${vueDist}/**`).pipe(dest(releaseDir));
}


export function copyPageData() {
  return src([
    `${root}/src/views/blog/*.json`,
    `${root}/src/views/red33m/*.json`,
  ])
  .pipe(changed(`${distDir}/_data`))
  .pipe(dest(`${distDir}/_data`));
}

export function releasePageData() {
  return src(`${distDir}/_data/**`)
  .pipe(changed(`${releaseDir}/_data`))
  .pipe(dest(`${releaseDir}/_data`));
}


/** Deletes all files in the client release dir */
export function cleanClient() {
  return del([
    `${releaseDir}/**`,
    `!${releaseDir}/`,
  ], { force: true });
}