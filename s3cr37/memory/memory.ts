

interface IApp extends Vue {

  easyColors: string[];
  colorTable: {
    red: string[];
    orange: string[];
    yellow: string[];
    green: string[];
    blue: string[];
    purple: string[];
    grayscale: string[];
  }
  countdown: number;
  level: number;
  randomizeCount: number;
  isRandomized: boolean;

  toArray: (list: NodeList) => any[];
  toNumberedArray: (count: number) => number[];
  pickColors: (count: number) => string[];
  reorderPuzzle: () => void;
  randomizeNums: (list: number[]) => number[];
  setupTable: (count: number) => void;
  randomizePuzzle: (speed?: number, count?: number) => void;
  uniqueOrder: (numbers: number[]) => number[];

}


let app = new Vue({


  el: '#entry',


  data: {
    easyColors: [
      'white', 'black', 'orange',
      'red', 'green', 'blue', 'deepskyblue',
      'deeppink', 'purple', 'greenyellow',
      'yellow', 'slategray', 'brown', 'cyan'
    ],

    colorTable: {
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
      ]
    },

    isRandomized: false,

    countdown: 0,

    level: 0,

    randomizeCount: 0
  },

  mounted: function() {

    new PuzzleLevels(this)


  },


  methods: {

    setLevel: function(ev: MouseEvent) {
      let obj = ev.target as HTMLSelectElement;
      this.level = obj.selectedIndex;
    },


    beginLevel: function() {

    },


    setupTable: function(count: number) {
        let placeholder = document.createElement('div')
        , insert = document.createElement('div')
        , puzzle = this.$refs['puzzle'] as HTMLElement
        , solution = this.$refs['solution'] as HTMLElement
        , puzzleCount = count
      ;

      placeholder.classList.add('piece-placeholder')

      this.isRandomized = true;

      let assignEvents = (insert: HTMLElement, placeholder: HTMLElement) => {

        insert.draggable = true;

        let dragStart = (ev: DragEvent) => {
          ev.dataTransfer.setData('text', (ev.target as HTMLElement).id);
        };

        let dragOver = (ev: DragEvent) => {
          ev.preventDefault();
        }

        let drop = (ev: DragEvent) => {
          let id = ev.dataTransfer.getData('text')
            , obj = document.getElementById(id)
            , ph = obj.parentElement
            , insertHasColor = false
            , insertColor = null
          ;


          // Prevent drag toggling on same row
          if (
              !obj.style.backgroundColor
              || obj.id.substr(0, 1) == insert.id.substr(0, 1)
            )
            return
          ;

          insert.style.backgroundColor =
            window.getComputedStyle(obj, null).getPropertyValue('background-color')
          ;

          if (ph.dataset['defaultOrder'] == placeholder.dataset['defaultOrder']) {
            insert.classList.add('success');
          }
          else {
            insert.classList.add('fail');
          }

          insert.removeEventListener('drop', drop);
          insert.removeEventListener('dragstart', dragStart);
          insert.removeEventListener('dragover', dragOver);
          this.isRandomized = false;
          insert.draggable = false;
          obj.style.backgroundColor = null
        }

        insert.addEventListener('dragstart', dragStart);
        insert.addEventListener('dragover', dragOver);
        insert.addEventListener('drop', drop);
      }

      let palette = this.pickColors(puzzleCount);
      console.log(palette);
      puzzle.innerHTML = '';
      solution.innerHTML = '';

      for (let i = 0; i < puzzleCount; i++) {

        let p = placeholder.cloneNode() as HTMLElement;
        p.style.order = `${i + 1}`
        p.dataset['defaultOrder'] = `${i + 1}`
        insert = insert.cloneNode() as HTMLDivElement;
        insert.style.backgroundColor = palette[i];
        insert.classList.add('insert');
        insert.classList.add('hidden');
        insert.id = `p${i}`
        assignEvents(insert, p);
        p.appendChild(insert);
        puzzle.appendChild(p);

        let s = placeholder.cloneNode() as HTMLElement;
        s.dataset['defaultOrder'] = `${i + 1}`
        insert = insert.cloneNode() as HTMLDivElement;
        insert.classList.remove('hidden');
        insert.id = `s${i}`;
        insert.style.backgroundColor = null;
        assignEvents(insert, s);
        s.appendChild(insert);
        solution.appendChild(s);

      }
    },


    reorderPuzzle: function() {
      let puzzle = this.$refs['puzzle'] as HTMLElement
        , pieces = this.toArray(puzzle.childNodes) as HTMLElement[]
        , availableOrders = this.toNumberedArray(pieces.length)
        , newOrder = this.uniqueOrder(availableOrders)
      ;

      pieces.forEach((el, i) => {
        el.style.order = `${newOrder[i] + 1}`
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
        }, speed)
      }
    },


    countDown: function() {
      let btn = this.$refs['startbtn'] as HTMLButtonElement
        , randombtn = this.$refs['randomizebtn'] as HTMLButtonElement
        , pieces = this.toArray((this.$refs['puzzle'] as HTMLElement).childNodes) as HTMLElement[]
      ;
      pieces.forEach(el => {
        (el.childNodes[0] as HTMLElement).classList.remove('hidden');
      })

      randombtn.disabled = true;
      btn.disabled = true;
      this.countdown = 7;
      let countDownInterval = setInterval(() => {
        if (this.countdown > 1) {
          --this.countdown;
        }
        else {
          clearInterval(countDownInterval);
          this.randomizePuzzle(130, 20);
          this.countdown = 0;
          randombtn.disabled = false;
          btn.disabled = false;
        }
      }, 1000);
    },


    pickColors(count: number) {
      let saveList = [] as string[]
        , colorList = this.easyColors
      ;

      while (count) {
        let color = colorList[Math.floor(Math.random() * colorList.length)];
        if (~saveList.indexOf(color)) continue;
        saveList.push(color);
        --count;
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
        let random = Math.floor(Math.random() * list.length)
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
} as Vue.ComponentOptions<IApp>)