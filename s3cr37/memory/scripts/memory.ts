
interface IPuzzleProperties {
  length:        number;
  duration:      number;
  shuffleSpeed:  number;
  shuffleAmount: number;
  palette?:      number;
}


interface IPuzzlePiece {
  order: number;
  draggable: boolean;
  color?: string;
  shape?: string;
}



class MemoryPuzzle {


  public level = 0;
  public stage = 0;
  public shuffleSpeed = 100;
  public shuffleAmount = 10;


  public pieces = [] as IPuzzlePiece[];

  private _colorTable = {
    easy: [
      'white', 'black', 'orange',
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

  private _levels = new PuzzleLevels();


  constructor(private _app: IApp) {
    let colors = this._pickColors(4);
    for (let i = 0; i < 4; i++) {
      this.pieces.push({
        order: i + 1,
        draggable: true,
        color: null,
        shape: null
      });
    }

  }


  public onDragStart(ev: DragEvent) {
    let id = ev.target['id'];
    ev.dataTransfer.setData('text', `${id}`);
    console.log(id);
  }
  public onDrop(ev: DragEvent) {
    let id = ev.dataTransfer.getData('text')
      , insertFrom = document.getElementById(id)
      , insertTo = ev.target as HTMLElement
      , phFrom = insertFrom.parentElement
      , phTo = insertTo.parentElement
      , orderId = insertFrom.dataset['orderId']
    ;

    // Lock successful solutions
    if (insertTo.classList.contains('success')) return;

    if (!orderId) {
      insertTo.dataset['orderId'] = id;
    }

    insertTo.style.backgroundColor =
      window.getComputedStyle(insertFrom, null).getPropertyValue('background-color')
    ;

    // For easter eggs
    // insertFrom.style.backgroundImage =
    //   window.getComputedStyle(insertTo, null).getPropertyValue('background-image')
    // ;

    if (phFrom.dataset['defaultOrder'] == phTo.dataset['defaultOrder']) {
      insertTo.classList.add('success');
    }
    else insertTo.classList.add('fail');

    // Clear colors from original insert
    insertFrom.style.backgroundColor = null;
    insertFrom.style.backgroundImage = null;
  }


  public resetBoard() {
    let colors = this._pickColors(this.pieces.length)
      , solutionPieces =
          this._toArray((this._app.$refs['solution'] as HTMLElement)
                        .childNodes) as HTMLElement[]
    ;

    solutionPieces.forEach(el => {
      let obj = el.children[0] as HTMLElement;
      if (obj.classList.length == 1) return;
      obj.style.backgroundColor = null;
      obj.style.backgroundImage = null;
      obj.classList.remove('fail');
      obj.classList.remove('success');
    });

    for (let i = 0; i < colors.length; i++) {
      this.pieces[i].color = colors[i];
    }
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