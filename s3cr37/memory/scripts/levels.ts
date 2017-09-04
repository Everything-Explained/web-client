

interface IPuzzleLevel {
  length:        number;
  duration:      number;
  shuffleSpeed:  number;
  shuffleAmount: number;
  palette?:      string;
}


class PuzzleLevels {

  private _table: HTMLElement;
  private _puzzle: HTMLElement;
  private _solution: HTMLElement;

  private _stageOneLevels = [

    {
      length: 3, duration: 5,
      shuffleSpeed: 80, shuffleAmount: 25
    },

    {
      length: 3, duration: 3,
      shuffleSpeed: 80, shuffleAmount: 25
    },

    {
      length: 4, duration: 5,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      length: 5, duration: 7,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      length: 5, duration: 5,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      length: 6, duration: 10,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      length: 6, duration: 7,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      length: 7, duration: 10,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      length: 7, duration: 7,
      shuffleSpeed: 100, shuffleAmount: 20
    },

    {
      length: 3, duration: 4,
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

  ] as IPuzzleLevel[];


  public stage = [
    this._stageOneLevels
  ];



  constructor() {}




}