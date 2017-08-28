

interface IApp extends Vue {
  colors: string[];
  randomizeCount: number;
  toArray: (list: NodeList) => any[];
  toNumberedArray: (count: number) => number[];
  pickColors: (count: number) => string[];
  reorderPuzzle: () => void;
}


let app = new Vue({


  el: '#entry',


  data: {
    colors: [
      'pink', 'red', 'orange',
      'purple', 'blue', 'green',
      'black', 'white', 'teal',
      'gold', 'cyan', 'crimson',
      'grey', 'yellow', 'lime',
      'hotpink', 'blueviolet'
    ],

    randomizeCount: 0
  },

  mounted: function() {


  },


  methods: {

    test: function() {
      // console.log(this.$refs['puzzle']);
    },


    randomizeTable: function() {
        let placeholder = document.createElement('div')
        , insert = document.createElement('div')
        , puzzle = this.$refs['puzzle'] as HTMLElement
        , solution = this.$refs['solution'] as HTMLElement
        , puzzleCount = 4
      ;


      placeholder.classList.add('piece-placeholder')


      let assignEvents = (insert: HTMLElement) => {

        insert.draggable = true;

        insert.addEventListener('dragstart', (ev) => {
          console.log(ev.target);
          ev.dataTransfer.setData('text', (ev.target as HTMLElement).id);
        });


        insert.addEventListener('dragover', (ev) => {
          ev.preventDefault();
        })

        insert.addEventListener('drop', (ev) => {
          let id = ev.dataTransfer.getData('text')
            , obj = document.getElementById(id)
            , insertHasColor = false
            , insertColor = null
          ;


          // Prevent drag toggling on same row
          // if (
          //     !obj.style.backgroundColor
          //     || obj.id.substr(0, 1) == insert.id.substr(0, 1)
          //    )
          //   return
          // ;

          if (insert.style.backgroundColor) {
            insertColor = insert.style.backgroundColor;
          }

          insert.style.backgroundColor =
            window.getComputedStyle(obj, null).getPropertyValue('background-color')
          ;


          if (insertColor)
            obj.style.backgroundColor = insertColor
          ;
          else
            obj.style.backgroundColor = null
          ;
        })
      }

      let palette = this.pickColors(puzzleCount);
      puzzle.innerHTML = '';
      solution.innerHTML = '';

      for (let i = 0; i < puzzleCount; i++) {

        let p = placeholder.cloneNode() as HTMLElement;
        p.style.order = `${i + 1}`
        p.dataset['defaultOrder'] = `${i + 1}`
        insert = insert.cloneNode() as HTMLDivElement;
        insert.style.backgroundColor = palette[i];
        insert.classList.add('insert');
        insert.id = `p${i}`
        assignEvents(insert);
        p.appendChild(insert);
        puzzle.appendChild(p);

        let s = placeholder.cloneNode() as HTMLElement;
        insert = insert.cloneNode() as HTMLDivElement;
        insert.id = `s${i}`;
        insert.style.backgroundColor = null;
        assignEvents(insert);
        s.appendChild(insert);
        solution.appendChild(s);

      }
    },


    reorderPuzzle: function() {
      let puzzle = this.$refs['puzzle'] as HTMLElement
        , pieces = this.toArray(puzzle.childNodes) as HTMLElement[]
        , availableOrders = this.toNumberedArray(pieces.length);
      ;

      pieces.forEach((el, i) => {
        if (i == pieces.length - 1) {
          el.style.order = `${availableOrders[0] + 1}`
          return;
        }

        let currentOrder = parseInt(el.style.order) - 1
          , defaultOrder = parseInt(el.dataset['defaultOrder'])
          , order        = defaultOrder
        ;


        while(order == defaultOrder) {
          let random = (Math.floor(Math.random() * availableOrders.length))
          order = availableOrders[random];
        }
        availableOrders.splice(availableOrders.indexOf(order), 1);
        // el.dataset['order'] = `${order}`
        el.style.order = `${order + 1}`
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


    pickColors(count: number) {
      let saveList = [] as string[];

      while (count) {
        let color = this.colors[Math.floor(Math.random() * this.colors.length)];
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
    }
  }
} as Vue.ComponentOptions<IApp>)