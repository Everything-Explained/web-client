
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

  //
  // TODO - Non-destructive addition/creation of new stat properties
  //        for new levels or new stats.
  //
  constructor(private _app: IApp, levels: PuzzleLevels) {
    this.readyDB(levels);
  }

  public async readyDB(levels: PuzzleLevels) {
    let user = await localforage.getItem('femmbyte') as IUser;

    if (!user) {
      this._user = {
        name: 'femmbyte',
        hits: 0,
        realHits: 0,
        misses: 0,
        stage: []
      };

      let stages = [];
      for (let s = 0; s < levels.stage.length; s++) {
        stages.push([]);

        for (let l = 0; l < levels.stage[s].length; l++) {
          stages[s].push({
            hits: 0,
            misses: 0,
            averages: [],
            realHits: 0,
            tries: 0
          });
        }
      }

      this._user.stage = stages;

      await localforage.setItem('femmbyte', this._user);
    } else {
      this._user = user;
    }

    console.log(this._user);
    this.updRealTimeStats();
  }

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
    console.log(this._user, `${avg}%, ${realAvg}%`);
    this.updRealTimeStats();
  }

  public updRealTimeStats() {

    this._app.totalAccuracy = this.getAccuracy(this._user.hits, this._user.misses);
    this._app.levelAccuracy = this.getAverage(this._user.stage[this._app.stage][this._app.level].averages)
  }

  public getAccuracy(hits: number, misses: number) {
    let avg = 100 - Math.floor((misses / hits) * 100);
    return avg;
  }

  public getAverage(data: number[]) {

    if (!data.length) return 0;
    let answer = 0;
    for (let d of data) {
      answer += d;
    }

    return Math.floor(answer / data.length);
  }

}