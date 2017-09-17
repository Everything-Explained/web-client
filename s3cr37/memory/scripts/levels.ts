

interface IPuzzleLevel {
  length:        number;
  duration:      number;
  shuffleSpeed:  number;
  shuffleAmount: number;
  palette?:      string;
  shapes?:       string;
}


class PuzzleLevels {

  private _table: HTMLElement;
  private _puzzle: HTMLElement;
  private _solution: HTMLElement;

  private _stage1Levels = [

    {
      length: 3, duration: 5,
      shuffleSpeed: 50, shuffleAmount: 30
    },

    {
      length: 3, duration: 3,
      shuffleSpeed: 50, shuffleAmount: 30
    },

    {
      length: 4, duration: 5,
      shuffleSpeed: 80, shuffleAmount: 20
    },

    {
      length: 4, duration: 3,
      shuffleSpeed: 80, shuffleAmount: 20
    },

    {
      length: 5, duration: 7,
      shuffleSpeed: 80, shuffleAmount: 20
    },

    {
      length: 5, duration: 4,
      shuffleSpeed: 80, shuffleAmount: 20
    },

    {
      length: 6, duration: 8,
      shuffleSpeed: 80, shuffleAmount: 20
    },

    {
      length: 6, duration: 5,
      shuffleSpeed: 80, shuffleAmount: 20
    },

    {
      length: 7, duration: 10,
      shuffleSpeed: 80, shuffleAmount: 20
    },

    {
      length: 7, duration: 6,
      shuffleSpeed: 80, shuffleAmount: 20
    }

  ] as IPuzzleLevel[];

  private _stage2Levels = [
    {
      length: 3, duration: 5,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },
    {
      length: 3, duration: 3,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },
    {
      length: 4, duration: 6,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },
    {
      length: 4, duration: 4,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },
    {
      length: 5, duration: 7,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },
    {
      length: 5, duration: 4,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },
    {
      length: 6, duration: 8,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },
    {
      length: 6, duration: 6,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },
    {
      length: 7, duration: 10,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },
    {
      length: 7, duration: 7,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    }
  ] as IPuzzleLevel[];

  private _stage3Levels = [
    {
      length: 3, duration: 6,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'blue'
    },
    {
      length: 3, duration: 3,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'red'
    },
    {
      length: 4, duration: 8,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'blue'
    },
    {
      length: 4, duration: 5,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'red'
    },
    {
      length: 5, duration: 8,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'blue'
    },
    {
      length: 5, duration: 5,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'red'
    },
    {
      length: 6, duration: 9,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'blue'
    },
    {
      length: 6, duration: 6,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'red'
    },
    {
      length: 7, duration: 10,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'red'
    },
    {
      length: 7, duration: 8,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'red'
    },
  ] as IPuzzleLevel[];

  private _stage4Levels = [
    {
      length: 4, duration: 9,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'grayscale'
    },
    {
      length: 4, duration: 7,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'grayscale'
    },
    {
      length: 4, duration: 5,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'grayscale'
    },
    {
      length: 4, duration: 3,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'grayscale'
    },
    {
      length: 6, duration: 12,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'grayscale'
    },
    {
      length: 6, duration: 9,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'grayscale'
    },
    {
      length: 6, duration: 7,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'grayscale'
    },
    {
      length: 6, duration: 5,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'grayscale'
    },
  ] as IPuzzleLevel[];


  public stage = [
    this._stage1Levels,
    this._stage2Levels,
    this._stage3Levels,
    this._stage4Levels
  ];



  constructor() {}




}