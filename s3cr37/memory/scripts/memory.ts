


interface IPuzzlePiece {
  order: number;
  defaultOrder: number;
  draggable: boolean;
  obfuscated: boolean;
  color: string;
  image: string;
  shapeData: {[key: string]: {
    style: {sel: string|string[]; props: string[]};
  }};
  shape: {[key: string]: boolean};
}

interface IPuzzleAnswer {
  defaultOrder: number;
  color: string;
  image: string;
  shapeData: {[key: string]: {
    style: {sel: string|string[]; props: string[]}
    class?: {[key: string]: boolean};
  }};
  shape: {[key: string]: boolean};
  pieceIndex?: number;
  success: boolean;
  fail: boolean;
}

enum PaletteTable {
  COLOR,
  SHAPE
}



class MemoryPuzzle {


  public shuffleSpeed = 100;
  public shuffleAmount = 10;
  public levels = new PuzzleLevels();


  public pieces = [] as IPuzzlePiece[];
  public answers = [] as IPuzzleAnswer[];

  private _colorTable = {
    easy: [
      '#fff', '#000', 'orange',
      'red', 'green', 'blue',
      'deeppink', 'purple',
      'yellow', 'slategray', 'brown', 'cyan'
    ],
    monodark: ['black'],
    monolight: ['white'],
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
      'darkgray', 'gray', 'dimgray',
      'slategray', 'darkslategray', 'black'
    ],

    medium: [
      'lightsalmon', 'coral', 'gold',
      'goldenrod', 'darkgoldenrod', 'chocolate',
      'peachpuff'
    ]
  };

  private _shapeTable = {
    easy: [
      'diamond', 'diamond-narrow', 'diamond-cut', 'sun',
      'cross', 'trapezoid', 'square', 'circle', 'crecent',
      'heart', 'parallelogram'
    ]
  };

  private _shapeData = {
    'triangle-up': {
      style: {
        sel: '*',
        props: ['border-bottom-color']
      },
    },
    'triangle-down': {
      style: {
        sel: '*',
        props: ['border-top-color']
      },
    },
    'triangle-right': {
      style: {
        sel: '*',
        props: ['border-left-color']
      },
    },
    'triangle-left': {
      style: {
        sel: '*',
        props: ['border-right-color']
      },
    },
    'square': {
      style: {
        sel: '*',
        props: ['color']
      },
    },
    'circle': {
      style: {
        sel: '*',
        props: ['background']
      },
    },
    'heart': {
      style: {
        sel: '*::before, *::after',
        props: ['background']
      },
    },
    'trapezoid': {
      style: {
        sel: '*',
        props: ['border-bottom-color']
      },
    },
    'parallelogram': {
      style: {
        sel: '*',
        props: ['background']
      },
    },
    'sun': {
      style: {
        sel: ['*', '*::before, *::after'],
        props: ['background', 'background']
      },
    },
    'crecent': {
      style: {
        sel: '*',
        props: ['color']
      },
    },
    'diamond': {
      style: {
        sel: ['*', '*::after'],
        props: ['border-bottom-color', 'border-top-color']
      },
    },
    'diamond-narrow': {
      style: {
        sel: ['*', '*::after'],
        props: ['border-bottom-color', 'border-top-color']
      },
    },
    'diamond-cut': {
      style: {
        sel: ['*', '*::after'],
        props: ['border-bottom-color', 'border-top-color']
      },
    },
    'cross': {
      style: {
        sel: ['*', '*::after'],
        props: ['background', 'background']
      },
    }
  };

  private _answersCleared = true;

  private _ee     = new EventEmitter();
  private _stats: Stats;
  private _events = ['success', 'fail'];
  private _level:   IPuzzleLevel;
  private _levelIndex = 0;
  private _stage  = 0;

  private tempStats = {
    hits: 0,
    misses: 0
  };

  set level(val: number) {
    this._level = this.levels.stage[this._stage][val];
    this._levelIndex = val;
    this._populateBoard();

    // Can be called before initialized
    if (this._stats)
      this._stats.updRealTimeStats();
  }

  set stage(val: number) {
    this._stage = val;
    this.level = 0;
  }

  //
  // TODO - need to observe solution pieces
  //
  constructor(private _app: IApp) {
    this.level = 0;
    this._populateBoard();
    this._stats = new Stats(_app, this.levels);
  }


  public onDragStart(ev: DragEvent, index?: number) {
    ev.dataTransfer.effectAllowed = 'move';
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
    insertTo.shape = insertFrom.shape;
    insertFrom.color = null;

    let shapes = {} as {[key: string]: boolean};
    for (let s in this._shapeData) {
      shapes[s] = false;
    }
    insertFrom.shape = Object.assign({}, shapes);
    insertFrom.draggable = false;


    if (insertTo.defaultOrder == insertFrom.defaultOrder) {
      insertTo.success = true;
      this.tempStats.hits += 1;
    }
    else {
      insertTo.fail = true;
      this.tempStats.misses += 1;
    }


    let answers =
          this.answers.filter(ans => !(ans.fail == ans.success))
    ;

    // Send events based on completed boards
    if (answers.length == this.answers.length) {
      if (insertTo.fail) this._ee.emit('fail');
      else {
        this._ee.emitEvent('success');

        this._stats.puzzleCompleted = {
          hits: this.tempStats.hits,
          misses: this.tempStats.misses,
          pieces: this.answers.length,
          stage: this._stage,
          level: this._levelIndex
        };

        this.tempStats.hits = 0;
        this.tempStats.misses = 0;
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
          this._app.isBoardActive = true;
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


  //
  // TODO - Refactor this function into smaller parts
  //
  public setupBoard() {
    let colorLength = this._level.length

      , colorPallete =
          (this._level.palette)
            ? this._level.palette
            : null

      , colors = this._pickPalette(colorLength, this._colorTable, colorPallete)

      , shapes = this._pickPalette(colorLength, this._shapeTable, this._level.shapes)

      , style = (document.getElementById('shapeStyles')
                || document.createElement('style')) as HTMLStyleElement
    ;

    if (!style.id) {
      style.id = 'shapeStyles';
      document.head.appendChild(style);
    }

    let css = style.sheet as CSSStyleSheet;
    for (let i = 0; i < css.cssRules.length; i++) {
      css.deleteRule(0);
    }

    for (let i = 0; i < colors.length; i++) {
      let ans = this.answers[i]
        , piece = this.pieces[i]
      ;
      piece.color = colors[i];
      piece.order = i + 1;
      piece.obfuscated = true;
      if (this._level.shapes) {
        for (let s in piece.shape) {
          if (piece.shape[s]) {
            piece.shape[s] = false;
            break;
          }
        }
        let shapeKey = shapes[i]
          , shape = piece.shapeData[shapeKey]
        ;

        piece.shape[shapeKey] = true;

        if (shapeKey == 'square') {
          if (!this._answersCleared){
            this._clearAnswerData(ans);
          }
          continue;
        }

        if (typeof shape.style.sel == 'string') {
          let sel = shape.style.sel.replace(/\*/g, `.${shapeKey}`)
            , prop = shape.style.props[0]
          ;
          css.insertRule(`${sel} { ${prop}: ${colors[i]} }`, css.cssRules.length);
        }
        else {
          for (let j = 0; j < shape.style.sel.length; j++) {
            let sel = `${shape.style.sel[j].replace(/\*/g, `.${shapeKey}`)}`
              , prop = shape.style.props[j]
            ;

            css.insertRule(`${sel} { ${prop}: ${colors[i]} }`, css.cssRules.length);
          }
        }

        piece.color = 'transparent';

      }

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

    // Lock successful solutions and prevent sending blank
    if (to.success || to.pieceIndex == null) return;

    if (to) {
      from.color = to.color;
      from.shape = to.shape;
      from.draggable = true;
      this._clearAnswerData(to);
    }
  }


  private _populateBoard() {

    if (this.pieces.length) {
      this.pieces = [];
      this.answers = [];
    }

    let shapes = {} as {[key: string]: boolean};
    for (let s in this._shapeData) {
      shapes[s] = false;
    }

    for (let i = 0; i < this._level.length; i++) {


      let piece = {
            order: i + 1,
            defaultOrder: i + 1,
            draggable: false,
            color: null,
            shapeData: Object.assign({}, this._shapeData),
            shape: Object.assign({}, shapes),
            image: null,
            obfuscated: true
          }
        , answer = {
          defaultOrder: i + 1,
          color: null,
          shapeData: Object.assign({}, this._shapeData),
          shape: Object.assign({}, shapes),
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
    let shapes = {} as {[key: string]: boolean};
    for (let s in this._shapeData) {
      shapes[s] = false;
    }
    ans.fail = false;
    ans.success = false;
    ans.color = null;
    ans.shape = shapes;
    ans.image = null;
    ans.pieceIndex = null;
  }


  private _pickPalette(len: number, table: {[key: string]: string[]}, type?: string) {
    let saveList = [] as string[]
      , palette =
          (type && type in table)
            ? table[type].slice(0)
            : table['easy'].slice(0)
    ;

    for (let i = 0; i < len; i++) {
      let random = Math.floor(Math.random() * palette.length)
        , item = palette[random]
      ;
      saveList.push(item);
      // Preserve single-color palletes
      if (palette.length > 1)
        palette.splice(random, 1);
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