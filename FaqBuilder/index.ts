import * as path from 'path';
import * as bluebird from 'bluebird';
import { writeFileSync } from 'fs';

let readFile = bluebird.promisify(require('fs').readFile) as any
  , readDir = bluebird.promisify(require('fs').readdir) as any
;

class Test {

  private _faqPath = path.join(__dirname, '../../au/src/views/home/faqdata');
  private _configFile = path.join(this._faqPath, 'faq.json');

  private _config: { [key: string]: string; };

  constructor() {
    this._config = {};
    this.readDir();
  }

  async readDir() {
    let files = await readDir(this._faqPath) as string[];

    // Get only MarkDown files
    files = files.filter(v => { return path.extname(v) == '.md'; });
    let count = 0;

    files.forEach(async f => {
      let filePath = path.join(this._faqPath, f)
        , fileData = await readFile(filePath, 'utf8')
      ;

      this._config[f.split('.', 1)[0]] = fileData || '';
      ++count;
      if (count == files.length) {
        writeFileSync(this._configFile, JSON.stringify(this._config, null, 2));
      }


    });

  }
}

new Test();