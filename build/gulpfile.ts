import * as gulp from 'gulp';
import {revertAppCSS, revertBuildCSS} from './tasks/cleanup';
import copyScripts from './tasks/copy-au'
import {readyApp, readyCSS, readyIndex} from './tasks/ready';
import {copyChangelogs, copyAdmin, copyStaticErrors, copyLogs, copyStandalone, copyIptable} from './tasks/copy-assets';
import {copyServer, setProduction} from './tasks/copy-server';


gulp.task('ready', gulp.series(
  readyApp,
  readyCSS,
  readyIndex
));

gulp.task('clean', gulp.parallel(revertAppCSS, revertBuildCSS));

gulp.task('setupServer', gulp.series(setProduction, copyServer))

gulp.task('copyApp', copyScripts);

gulp.task('copytest', copyChangelogs);

gulp.task('release',
  gulp.parallel(

    // Copy client files
    copyScripts,
    copyChangelogs,
    copyStaticErrors,
    copyAdmin,
    revertAppCSS,
    revertBuildCSS,

    // Copy server files
    gulp.series(
      setProduction,
      copyServer,
      gulp.parallel(
        copyLogs,
        copyStandalone,
        copyIptable
      )
    )
  )
);