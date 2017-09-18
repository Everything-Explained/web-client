
interface IPuzzleStats {
  pieces: number;
  hits: number;
  misses: number;
  stage: number;
  level: number;
}

interface ILevelData {
  hits: number;
  realHits: number;
  misses: number;
  averages: number[];
  tries: number;
}

interface IUser {
  name: string;
  hits: number;
  realHits: number;
  misses: number;
  stage: ILevelData[][];
}


//
// TODO - Average success % per level
//
//      - Average success momentum % per level, customizeable
//        by momentum amount limited by available data
//
//      - Levels completed flawlessly
//
//      - Difficult levels
//
//      - Color difficulties
//
//      - Total hits and misses
//
class Stats {

  public level = 0;
  public stage = 0;

  private _user: IUser;
  private _timeouts: { [key: string]: NodeJS.Timer } = {};


  set puzzleCompleted(val: IPuzzleStats) {

    let hits = (val.misses >= val.hits) ? 0 : val.hits - val.misses
      , misses = val.misses
      , lvl = this._user.stage[val.stage][val.level]
    ;

    this._user.hits += val.hits;
    this._user.misses += val.misses;
    this._user.realHits += hits;
    lvl.hits += val.hits;
    lvl.realHits += hits;
    lvl.misses += misses;
    lvl.tries += 1;

    if (hits == val.pieces) {
      lvl.averages.push(100);
    }
    else if (!hits) {
      lvl.averages.push(0);
    }
    else {
      lvl.averages.push(Math.floor((hits / val.pieces) * 100));
    }

    localforage.setItem('femmbyte', this._user);
    let avg = this.getAccuracy(this._user.hits, this._user.misses)
      , realAvg = this.getAccuracy(this._user.realHits, this._user.misses)
    ;

    console.log(this._user);
    this.updRealTimeStats();
  }

  //
  // TODO - Non-destructive addition/creation of new stat properties
  //        for new levels or new stats.
  //
  constructor(private _app: IApp, private _levels: PuzzleLevels) {
    this.readyDB();
  }

  public async readyDB() {
    let user = await localforage.getItem('femmbyte') as IUser;

    if (!user) {
      this._initUser();
    } else {
      this._user = user;
      this._chkUpdateUser();
    }

    console.log(this._user);
    this.updRealTimeStats();
  }


  public updRealTimeStats() {

    clearInterval(this._timeouts['lvlAcc']);
    clearInterval(this._timeouts['totAcc']);

    this._animProgWheel(
      'levelAccuracy',
      'lvlAcc',
      this.getAverage(this._user.stage[this._app.stage][this._app.level].averages)
    );

    let totalAcc = this.getAccuracy(this._user.hits, this._user.misses);
    if (totalAcc.toFixed(2) !== this._app.totalAccuracy.toString())
      this._animProgWheel(
        'totalAccuracy',
        'totAcc',
        totalAcc
      )
    ;
  }



  public getAccuracy(hits: number, misses: number) {
    let avg = 100 - ((misses / hits) * 100);
    return avg;
  }

  public getAverage(data: number[]) {

    if (!data.length) return 0;
    let answer = 0;
    for (let d of data) {
      answer += d;
    }

    return answer / data.length;
  }

  private _animProgWheel(animProp: string, tName: string, max: number) {
    let [speed, timeout] = this._setAnimSpeed(max, this._app[animProp])
      , intervalStore = null as NodeJS.Timer
    ;

    intervalStore = this._timeouts[tName] = setInterval(() => {
      if (parseFloat(max.toFixed(2)) !== this._app[animProp]) {
        this._app[animProp] =
          parseFloat(
            this._animate(
              max,
              this._app[animProp],
              speed).toFixed(2)
          )
        ;
      } else {
        clearInterval(intervalStore);
      }
    }, timeout);
  }

  private _animate(max: number, current: number, speed: number) {
    let speedDiff = speed + current;

    if (speedDiff > max && speed > 0) {
      return max;
    }

    if (speedDiff < max && speed < 0) {
      return max;
    }

    return current + speed;
  }

  private _setAnimSpeed(max: number, current: number) {

    let speed = 0
      , timeout = 0
      , diff = max - current
      , threshold = Math.abs(diff)
    ;

    if (threshold > 50) {speed = 10.11; timeout = 40; }
    else if (threshold >= 30) { speed = 1.73; timeout = 30; }
    else if (threshold <= 1) {
      speed = 0.03;
      timeout = 35;
    }
    else if (threshold <= 3) {
      speed = .07;
      timeout = 30;
    }
    else if (threshold <= 7) {
      speed = .33;
      timeout = 30;
    }
    else if (threshold <= 15) {
      speed = .53;
      timeout = 35;
    }
    else if (threshold < 30) {
      speed = 3.11;
      timeout = 50;
    }

    speed = (diff < 0) ? speed * -1 : speed;

    console.log(speed);

    return [speed, timeout];
  }

  private _initUser() {

    this._user = {
      name: 'femmbyte',
      hits: 0,
      realHits: 0,
      misses: 0,
      stage: []
    };

    let stages = [];
    for (let s = 0; s < this._levels.stage.length; s++) {
      stages.push([]);

      for (let l = 0; l < this._levels.stage[s].length; l++) {
        stages[s].push({
          hits: 0,
          realHits: 0,
          misses: 0,
          averages: [],
          tries: 0
        });
      }
    }

    localforage.setItem('femmbyte', this._user);
    this._user.stage = stages;
    console.info('User Created');
  }

  private async _chkUpdateUser() {

    let save = false;

    // ADD/REMOVE Levels if applicable
    this._user.stage.forEach((levels, i) => {
      let realLvlLen = this._levels.stage[i].length;

      if (levels.length == realLvlLen) return;

      console.info('Updating Levels');
      save = true;

      if (levels.length > realLvlLen) {
        levels.splice(realLvlLen, levels.length - realLvlLen);
        return;
      }

      if (levels.length < realLvlLen) {
        let newLen = realLvlLen - levels.length;
        for (let i = 0; i < newLen; i++) {
          levels.push({
            hits: 0,
            realHits: 0,
            misses: 0,
            averages: [],
            tries: 0,
          });
        }
        return;
      }
    });


    if (this._user.stage.length < this._levels.stage.length) {
      console.info('Updating Stages');
      save = true;
      let userStageLength = this._user.stage.length
        , actualStageLength = this._levels.stage.length
      ;
      for (let i = userStageLength; i < actualStageLength; i++) {
        this._user.stage.push([]);

        while (this._user.stage[i].length < this._levels.stage[i].length) {
          this._user.stage[i].push({
            hits: 0,
            misses: 0,
            averages: [],
            realHits: 0,
            tries: 0
          });
        }

      }
    }

    if (save) {
      await localforage.setItem('femmbyte', this._user);
      console.info('Updated User');
      console.log(this._user);
    }
  }

}