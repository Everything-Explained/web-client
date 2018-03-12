import * as gulp from 'gulp';
import {revertAppCSS, revertBuildCSS, revertAureliaConfig} from './tasks/cleanup';
import copyScripts from './tasks/copy-au';
import {readyApp, readyCSS, readyIndex, readyAurelia} from './tasks/ready';
import {copyChangelogs, copyAdmin, copyStaticErrors, copyLogs, copyStandalone, copyIptable} from './tasks/copy-assets';
import {copyServer, setProduction} from './tasks/copy-server';


gulp.task('readyBuild', gulp.series(
  readyApp,
  readyCSS,
  readyAurelia
));

gulp.task('readyIndex', readyIndex);


gulp.task('clean', gulp.parallel(revertAppCSS, revertBuildCSS, revertAureliaConfig));


gulp.task('setupServer', gulp.series(setProduction, copyServer));

gulp.task('copyApp', copyScripts);

gulp.task('copytest', copyChangelogs);

gulp.task('test', revertAureliaConfig);

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