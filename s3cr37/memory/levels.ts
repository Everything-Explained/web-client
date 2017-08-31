
class PuzzleLevels {

  private _table: HTMLElement;
  private _puzzle: HTMLElement;
  private _solution: HTMLElement;

  public stageOneLevels = [

    {
      pieceCount: 3, countdown: 5,
      shuffleSpeed: 80, shuffleAmount: 25
    },

    {
      pieceCount: 3, countdown: 3,
      shuffleSpeed: 80, shuffleAmount: 25
    },

    {
      pieceCount: 4, countdown: 5,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      pieceCount: 5, countdown: 7,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      pieceCount: 5, countdown: 5,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      pieceCount: 6, countdown: 10,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      pieceCount: 6, countdown: 7,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      pieceCount: 7, countdown: 10,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      pieceCount: 7, countdown: 7,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      pieceCount: 3, countdown: 4,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },

    {
      pieceCount: 4, countdown: 6,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },

    {
      pieceCount: 4, countdown: 4,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },

    {
      pieceCount: 5, countdown: 7,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },

    {
      pieceCount: 5, countdown: 4,
      shuffleSpeed: 80, shuffleAmount: 25,
      palette: 'medium'
    },

  ] as IPuzzleProperties[];


  public stage = [
    this.stageOneLevels
  ];



  constructor(private _app: IApp) {}



  exec(level: number) {
    if (level < this.stageOneLevels.length) {
      this._app.puzzleSetup(this.stageOneLevels[level]);
    }
    else {
      console.warn(`Level "${level}" does not exist!`);
    }
  }




}