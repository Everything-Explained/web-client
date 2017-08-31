




interface IApp extends Vue {

  colorTable: {
    [key: string]: string[]
  };
  countdown: number;
  countdownStart: number;
  shuffleSpeed: number;
  shuffleAmount: number;
  level: number;
  levels: any[];
  randomizeCount: number;
  isPuzzleReady: boolean;
  isLoaded: boolean;
  puzzleLevels: PuzzleLevels;

  toArray: (list: NodeList) => any[];
  toNumberedArray: (count: number) => number[];
  pickColors: (count: number, palette?: string) => string[];
  reorderPuzzle: () => void;
  randomizeNums: (list: number[]) => number[];
  puzzleSetup: (options: IPuzzleProperties) => void;
  createTable: (options: ITableProperties) => void;

  assignPuzzleEvents: (insert: HTMLElement, placeholder: HTMLElement) => void;
  assignSolutionEvents: (insert: HTMLElement, placeholder: HTMLElement) => void;

  randomizePuzzle: (speed?: number, count?: number) => void;
  uniqueOrder: (numbers: number[]) => number[];

}


interface IPuzzleProperties {
  pieceCount: number;
  countdown: number;
  shuffleSpeed: number;
  shuffleAmount: number;
  palette?: string;
}

interface ITableProperties {
  puzzle: HTMLElement;
  placeholder: HTMLElement;
  insert: HTMLElement;
  solution: HTMLElement;
  pieceCount: number;
  palette?: string;
}


let app = new Vue({

  el: '#entry',




  data: {

    colorTable: {
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
    },

    isPuzzleReady: false,
    isLoaded: false,

    countdown: 0,
    countdownStart: 0,
    shuffleSpeed: 100,
    shuffleAmount: 10,

    level: 0,
    stage: 0,
    levels: null,

    randomizeCount: 0,

    puzzleLevels: null as PuzzleLevels
  },




  mounted: function() {

    this.puzzleLevels = new PuzzleLevels(this);
    this.levels = this.puzzleLevels.stage[0];
    setTimeout(() => {
      this.isLoaded = true;
    }, 30);
  },




  methods: {

    setLevel: function(ev: MouseEvent) {
      let obj = ev.target as HTMLSelectElement;
      this.level = obj.selectedIndex;
    },


    setupLevel: function() {
      this.puzzleLevels.exec(this.level);
    },


    puzzleSetup: function(options: IPuzzleProperties) {

      this.shuffleAmount = options.shuffleAmount;
      this.shuffleSpeed = options.shuffleSpeed;

      let placeholder = document.createElement('div')
        , insert = document.createElement('div')
        , puzzle = this.$refs['puzzle'] as HTMLElement
        , solution = this.$refs['solution'] as HTMLElement
        , pieceCount = options.pieceCount
      ;

      placeholder.classList.add('piece-placeholder');
      this.countdownStart = options.countdown;

      this.isPuzzleReady = true;

      let nodes =
            this.toArray(puzzle.childNodes).concat(
            this.toArray(solution.childNodes)) as HTMLElement[]
      ;
      nodes.forEach(el => el.remove());

      this.createTable({insert, placeholder, pieceCount, puzzle, solution, palette: options.palette});

    },


    createTable: function(options: ITableProperties) {
      let palette =
            (options.palette)
              ? this.pickColors(options.pieceCount, options.palette)
              : this.pickColors(options.pieceCount)
        , insert = options.insert
        , placeholder = options.placeholder
        , puzzle = options.puzzle
        , easterEggEntry = null as number
        , jj = Math.random() <= 0.001
      ;

      if (Math.random() <= 0.025) {
        easterEggEntry = Math.floor(Math.random() * options.pieceCount);
      }


      for (let i = 0; i < options.pieceCount; i++) {

        let p = placeholder.cloneNode() as HTMLElement;
        p.style.order = `${i + 1}`;
        p.dataset['defaultOrder'] = `${i + 1}`;
        insert = insert.cloneNode() as HTMLDivElement;

        if (i == easterEggEntry || jj) {
          let pos = (jj) ? i + 1 : Math.ceil(Math.random() * options.pieceCount);
          insert.style.backgroundImage = `url('imgs/dwaa${pos}.png')`;
        } else {
          insert.style.backgroundColor = palette[i];
        }
        
        insert.classList.add('insert');
        insert.classList.add('obfuscated');
        insert.id = `p${i}`;
        this.assignPuzzleEvents(insert, p);
        p.appendChild(insert);
        puzzle.appendChild(p);

        let s = placeholder.cloneNode() as HTMLElement;
        s.dataset['defaultOrder'] = `${i + 1}`;
        insert = insert.cloneNode() as HTMLDivElement;
        insert.classList.remove('obfuscated');
        insert.id = `s${i}`;
        insert.style.backgroundColor = null;
        insert.style.backgroundImage = null;
        this.assignSolutionEvents(insert, s);
        s.appendChild(insert);
        options.solution.appendChild(s);

      }
    },


    assignPuzzleEvents: function(insert: HTMLElement, placeholder: HTMLElement) {
      insert.draggable = true;

      let dragStart = (ev: DragEvent) => {
        let id = ev.target['id'];

        ev.dataTransfer.setData('text', `${id}`);
        insert.classList.remove('fail');
        insert.classList.remove('success');
      };

      let dragOver = (ev: DragEvent) => {
        ev.preventDefault();
      };

      insert.addEventListener('dragstart', dragStart);
      insert.addEventListener('dragover', dragOver);
    },


    assignSolutionEvents: function(insert: HTMLElement, placeholder: HTMLElement) {

      insert.draggable = false;

      let resetInsert = () => {
        let orderId = insert.dataset['orderId'];

        if (orderId) {
          let obj = document.getElementById(orderId);
          obj.style.backgroundColor = insert.style.backgroundColor;
          obj.style.backgroundImage = insert.style.backgroundImage;
          insert.style.backgroundColor = null;
          insert.style.backgroundImage = null;
          insert.classList.remove('fail');
          insert.classList.remove('success');
          delete insert.dataset['orderId'];
        }
      };

      let drop = (ev: DragEvent) => {
        let id = ev.dataTransfer.getData('text')
          , obj = document.getElementById(id)
          , ph = obj.parentElement
          , orderId = insert.dataset['orderId']
        ;

        if (!orderId) {
          insert.dataset['orderId'] = id;
        }
        else {
          resetInsert();
          insert.dataset['orderId'] = id;
        }

        insert.style.backgroundColor =
          window.getComputedStyle(obj, null).getPropertyValue('background-color')
        ;

        // For easter eggs
        insert.style.backgroundImage =
          window.getComputedStyle(obj, null).getPropertyValue('background-image')
        ;

        if (ph.dataset['defaultOrder'] == placeholder.dataset['defaultOrder']) {
          insert.classList.add('success');
        }
        else {
          insert.classList.add('fail');
        }

        this.isPuzzleReady = false;
        obj.style.backgroundColor = null;
        obj.style.backgroundImage = null;

      };

      let dragover = (ev: DragEvent) => {
        ev.preventDefault();
      };

      insert.addEventListener('drop', drop);
      insert.addEventListener('dragover', dragover);
      insert.addEventListener('dblclick', resetInsert);
    },


    reorderPuzzle: function() {
      let puzzle = this.$refs['puzzle'] as HTMLElement
        , pieces = this.toArray(puzzle.childNodes) as HTMLElement[]
        , availableOrders = this.toNumberedArray(pieces.length)
        , newOrder = this.uniqueOrder(availableOrders)
      ;

      pieces.forEach((el, i) => {
        el.style.order = `${newOrder[i] + 1}`;
      });

    },


    randomizePuzzle: function(speed = 50, count = 1) {

      if (count == 1) {
        this.reorderPuzzle();
      }
      else {
        this.reorderPuzzle();
        this.randomizeCount = 1;
        let interval = setInterval(() => {
          this.reorderPuzzle();
          if (++this.randomizeCount == count) {
            clearInterval(interval);
            return;
          }
        }, speed);
      }
    },


    beginLevel: function() {
      let btn = this.$refs['startbtn'] as HTMLButtonElement
        , randombtn = this.$refs['randomizebtn'] as HTMLButtonElement
        , pieces = this.toArray((this.$refs['puzzle'] as HTMLElement).childNodes) as HTMLElement[]
      ;

      pieces.forEach(el => {
        (el.childNodes[0] as HTMLElement).classList.remove('obfuscated');
      });

      randombtn.disabled = true;
      btn.disabled = true;
      this.countdown = this.countdownStart;
      let countDownInterval = setInterval(() => {
        if (this.countdown > 1) {
          --this.countdown;
        }
        else {
          clearInterval(countDownInterval);
          this.randomizePuzzle(this.shuffleSpeed, this.shuffleAmount);
          this.countdown = 0;
          randombtn.disabled = false;
          btn.disabled = false;
        }
      }, 1000);
    },


    pickColors(count: number, palette?: string) {
      let saveList = [] as string[]
        , colorList =
            (palette && palette in this.colorTable)
              ? this.colorTable[palette].slice(0)
              : this.colorTable['easy'].slice(0)
      ;

      for (let i = 0; i < count; i++) {
        let random = Math.floor(Math.random() * colorList.length)
          , color = colorList[random]
        ;
        saveList.push(color);
        colorList.splice(random, 1);
      }
      return saveList;
    },


    toArray: function(list: NodeList) {
      return Array.prototype.slice.call(list);
    },


    toNumberedArray: function(count: number) {
      let list = [];
      for (let i = 0; i < count; i++) {
        list.push(i);
      }
      return list;
    },


    randomizeNums: function(list: number[]) {
      let newList = [] as number[];
      for (let nums of list) {
        let random = Math.floor(Math.random() * list.length);
        newList.push(list[nums]);
        list.splice(random, 1);
      }
      return newList;
    },


    uniqueOrder: function(numbers: number[]) {
      let order = []
        , numList = numbers.slice()
      ;

      while (numList.length) {
        let random = Math.floor(Math.random() * numList.length);

        // Force unique order
        if (order.length == numList[random]) {

          // Prevent same last number
          if (numList.length == 1) {
            return this.uniqueOrder(numbers);
          }
          continue;
        }
        order.push(numList[random]);
        numList.splice(random, 1);
      }
      return order;
    }
  }
} as Vue.ComponentOptions<IApp>);