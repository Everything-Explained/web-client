import * as path from 'path';
import * as bluebird from 'bluebird';
import { writeFileSync } from 'fs';
import * as bunyan from 'bunyan';

let readFile = bluebird.promisify(require('fs').readFile) as any
  , readDir = bluebird.promisify(require('fs').readdir) as any
  , log = bunyan.createLogger({name: 'FaqBuilder'})
;

class Test {

  private _faqPath = path.join(__dirname, '../au/src/views/home/faqdata');
  private _configFile = path.join(this._faqPath, 'faq.json');

  private _config: { [key: string]: string; };

  constructor() {
    log.info('...FAQ Processing Started...');
    this._config = {};
    this.readDir();
  }

  async readDir() {
    let files = await readDir(this._faqPath) as string[]
      , oldConfig = JSON.parse(await readFile(this._configFile))
    ;

    // Get only MarkDown files
    files = files.filter(v => { return path.extname(v) == '.md'; });
    let count = 0
      , changed = 0
      , added = 0
    ;

    files.forEach(async f => {
      let filePath = path.join(this._faqPath, f)
        , fileData = await readFile(filePath, 'utf8')
        , name = f.split('.', 1)[0]
      ;

      this._config[name] = fileData || '';

      if (oldConfig[name] != undefined) {
        if (oldConfig[name] != fileData) {
          ++changed;
          let changes = oldConfig[name].length - fileData.length;
          log.info(`Updated: [${name}] ::: ${changes > 0 ? '-' : '+'}${Math.abs(changes)} char(s)`);
        }
      }
      else {
        ++added;
        log.info(`Added "${name}"`);
      }

      ++count;
      if (count == files.length) {
        if (changed) {
          writeFileSync(this._configFile, JSON.stringify(this._config, null, 2));
        }
        else {
          log.warn(`(No Changes or Additions)`);
        }
        log.info('...FAQ Processing Finished...');
      }


    });

  }
}
new Test();