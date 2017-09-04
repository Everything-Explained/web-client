


interface IPuzzlePiece {
  order: number;
  defaultOrder: number;
  draggable: boolean;
  obfuscated: boolean;
  color: string;
  image: string;
  shape: string;
}

interface IPuzzleAnswer {
  defaultOrder: number;
  color: string;
  image: string;
  shape: string;
  pieceIndex?: number;
  success: boolean;
  fail: boolean;
}



class MemoryPuzzle {


  private _level: IPuzzleLevel;
  private _stage = 0;
  public shuffleSpeed = 100;
  public shuffleAmount = 10;
  public levels = new PuzzleLevels();


  public pieces = [] as IPuzzlePiece[];
  public answers = [] as IPuzzleAnswer[];

  private _colorTable = {
    easy: [
      '#fff', '#000', 'orange',
      'red', 'green', 'blue', 'deepskyblue',
      'deeppink', 'purple', 'greenyellow',
      'yellow', 'slategray', 'brown', 'cyan'
    ],
    red: [
      'indianred', 'lightcoral', 'salmon',
      'darksalmon', 'lightsalmon', 'crimson',
      'red', 'firebrick', 'darkred',
      'palevioletred', 'lightpink'
    ],
    orange: [
      'coral', 'orangered', 'darkorange',
      'orange', 'navajowhite', 'goldenrod',
      'tan', 'burlywood', 'bisque',
      'sandybrown', 'darkgoldenrod', 'chocolate',
      'brown', 'maroon', 'sienna', 'peru',
      'gold', 'moccasin', 'peachpuff', 'khaki',
      'darkkhaki'
    ],
    green: [
      'greenyellow', 'chartreuse', 'lime',
      'limegreen', 'palegreen', 'lightgreen',
      'springgreen', 'seagreen', 'green',
      'darkgreen', 'yellowgreen', 'olivedrab',
      'olive', 'darkolivegreen', 'lightseagreen',
      'darkcyan'
    ],
    blue: [
      'aqua', 'lightcyan', 'paleturquoise',
      'aquamarine', 'turquoise', 'darkturquoise',
      'cadetblue', 'steelblue', 'lightsteelblue',
      'powderblue', 'skyblue', 'deepskyblue',
      'dodgerblue', 'royalblue', 'blue', 'navy'
    ],
    purple: [
      'plum', 'violet', 'fuchsia', 'deeppink',
      'blueviolet', 'darkviolet', 'purple', 'indigo',
      'slateblue', 'mediumslateblue', 'orchid', 'hotpink',
      'pink', 'mediumvioletred'
    ],
    grayscale: [
      'gainsboro', 'lightgray', 'silver',
      'darkgray', 'gray', 'dimgray', 'lightslategray',
      'slategray', 'darkslategray', 'black'
    ],

    medium: [
      'lightsalmon', 'coral', 'gold',
      'goldenrod', 'darkgoldenrod', 'chocolate',
      'peachpuff'
    ]
  };

  private _answersCleared = true;

  private _ee = new EventEmitter();
  private _events = ['success', 'fail'];


  set level(val: number) {
    this._level = this.levels.stage[this._stage][val];
    this._populateBoard();
  }

  //
  // TODO - need to observe solution pieces
  //
  constructor(private _app: IApp) {
    let colors = this._pickColors(4);

    this.level = 0;

    this._populateBoard();



  }


  public onDragStart(ev: DragEvent, index?: number) {
    ev.dataTransfer.setData('text', `${index}`);
  }
  public onDrop(ev: DragEvent, index: number) {
    let indexFrom = parseInt(ev.dataTransfer.getData('text'))
      , insertFrom = this.pieces[indexFrom]
      , insertTo = this.answers[index]
    ;


    this._answersCleared = false;

    // Lock successful solutions
    if (insertTo.success) return;

    // Swap pieces
    if (typeof insertTo.pieceIndex == 'number') {
      this.resetInsert(null, index);
    }

    insertTo.pieceIndex = indexFrom;

    // Move puzzle piece color
    insertTo.color = insertFrom.color;
    insertFrom.color = null;
    insertFrom.draggable = false;


    if (insertTo.defaultOrder == insertFrom.defaultOrder) {
      insertTo.success = true;
    }
    else insertTo.fail = true;

    let answers =
          this.answers.filter(ans => !(ans.fail == ans.success))
    ;

    // Send events based on completed boards
    if (answers.length == this.answers.length) {
      if (insertTo.fail) this._ee.emit('fail');
      else {
        this._ee.emitEvent('success');
      }
    }
  }


  public beginLevel() {
    this._app.countdown = this._level.duration;
    this.pieces.forEach(p => p.obfuscated = false);

    // Start memorize countdown
    let interval = setInterval(async () => {
      if (this._app.countdown == 1) {
        clearInterval(interval);
        this._shuffle().then(() => {
          this.pieces.forEach(p => p.draggable = true);
        });
      }
      --this._app.countdown;
    }, 1000);

  }

  private _shuffle() {
    let count = 0;

    return new Promise<boolean>((rs, rj) => {
      let interval = setInterval(() => {
        let order = this._uniqueOrder(this._level.length);

        this.pieces.forEach((p, i) => {
          p.order = order[i] + 1;
        });

        if (++count == this._level.shuffleAmount) {
          clearInterval(interval);
          rs(true);
        }

      }, this._level.shuffleSpeed);
    });

  }


  public setupBoard() {
    let colorLength = this._level.length

      , colorPallete =
          (this._level.palette)
            ? this._level.palette
            : null

      , colors = this._pickColors(colorLength, colorPallete)
    ;

    for (let i = 0; i < colors.length; i++) {
      let ans = this.answers[i]
        , piece = this.pieces[i]
      ;
      piece.color = colors[i];
      piece.order = i + 1;
      piece.obfuscated = true;
      if (!this._answersCleared){
        this._clearAnswerData(ans);
      }
    }
    this._answersCleared = true;
    return true;
  }


  public resetInsert(ev: MouseEvent, indexTo: number) {

    let to = this.answers[indexTo]
      , from = this.pieces[to.pieceIndex]
    ;

    // Lock successful solutions
    if (to.success) return;

    if (to) {
      from.color = to.color;
      from.draggable = true;
      this._clearAnswerData(to);
    }
  }


  private _populateBoard() {

    if (this.pieces.length) {
      this.pieces = [];
      this.answers = [];
    }

    for (let i = 0; i < this._level.length; i++) {
      let piece = {
            order: i + 1,
            defaultOrder: i + 1,
            draggable: false,
            color: null,
            shape: null,
            image: null,
            obfuscated: true
          }
        , answer = {
          defaultOrder: i + 1,
          color: null,
          shape: null,
          success: false,
          fail: false,
          image: null
        }
      ;

      this.pieces.push(piece);
      this.answers.push(answer);
    }
  }





  public on(event: string, fn: () => void) {
    if (~this._events.indexOf(event)) {
      this._ee.on(event, fn);
    }
    else console.warn(`Cannot bind to "${event}": Event does not exist.`);
  }


  private _clearAnswerData(ans: IPuzzleAnswer) {
    ans.fail = false;
    ans.success = false;
    ans.color = null;
    ans.image = null;
    ans.pieceIndex = null;
  }


  private _pickColors(len: number, palette?: string) {
    let saveList = [] as string[]
      , colorList =
          (palette && palette in this._colorTable)
            ? this._colorTable[palette].slice(0)
            : this._colorTable['easy'].slice(0)
    ;

    for (let i = 0; i < len; i++) {
      let random = Math.floor(Math.random() * colorList.length)
        , color = colorList[random]
      ;
      saveList.push(color);
      colorList.splice(random, 1);
    }

    return saveList;
  }


  private _toNumArray(len: number) {
    let list: number[] = [];
    for (let i = 0; i < len; i++) {
      list.push(i);
    }
    return list;
  }


  private _uniqueOrder(numbers: number[]|number): number[] {
    let order: number[] = []
      , numList =
          (numbers instanceof Array)
            ? numbers.slice()
            : this._toNumArray(numbers)
    ;

    while (numList.length) {
      let random = Math.floor(Math.random() * numList.length);

      // Force unique order
      if (order.length == numList[random]) {

        // Prevent same last number
        if (numList.length == 1) {
          return this._uniqueOrder(numbers);
        }
        continue;
      }
      order.push(numList[random]);
      numList.splice(random, 1);
    }
    return order;
  }


  private _toArray(nodes: NodeList) {
    return Array.prototype.slice.call(nodes);
  }



}