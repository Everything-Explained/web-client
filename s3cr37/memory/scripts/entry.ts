interface IApp extends Vue {

  puzzle: MemoryPuzzle;
  stages: number;
  levels: number;

  btnStart: HTMLButtonElement;
  btnSetup: HTMLButtonElement;

  countdown: number;
  shuffleSpeed: number;
  shuffleAmount: number;
  isBoardSetup: boolean;
  isPuzzleRunning: boolean;
  isLoaded: boolean;
  puzzlePieces: {order: number, draggable: boolean}[];
  onPuzzleSuccess: () => void;

  toArray: (list: NodeList) => any[];
  toNumberedArray: (count: number) => number[];



}



let app = new Vue({

  el: '#entry',




  data: {

    isBoardSetup: false,
    isPuzzleRunning: false,
    isLoaded: false,

    levels: 0,
    stages: 0,

    countdown: 0,
    countdownStart: 0,
    shuffleSpeed: 100,
    shuffleAmount: 10,

    puzzle: MemoryPuzzle,
    puzzlePieces: [],

  },

  created: function() {
    this.puzzle = new MemoryPuzzle(this);
    this.stages = this.puzzle.levels.stage.length;
    this.levels = this.puzzle.levels.stage[0].length;
    this.puzzle.on('success', () => this.onPuzzleSuccess());
  },


  mounted: function() {

    setTimeout(() => {
      this.isLoaded = true;
    }, 30);

  },




  methods: {

    preventDefault: function(ev: DragEvent) {
      ev.preventDefault();
    },



    setLevel: function(ev: MouseEvent) {
      let obj = ev.target as HTMLSelectElement;
      this.puzzle.level = obj.selectedIndex;
    },

    setStage: function(ev: MouseEvent) {
      let obj = ev.target as HTMLSelectElement;
      this.puzzle.stage = obj.selectedIndex;
      this.levels = this.puzzle.levels.stage[obj.selectedIndex].length;
    },

    setupBoard: function(ev: MouseEvent) {
      if (this.puzzle.setupBoard()) {
        this.isBoardSetup = true;
      }
    },


    beginLevel: function() {
      this.isPuzzleRunning = true;
      this.isBoardSetup = false;
      this.puzzle.beginLevel();

    },

    onPuzzleSuccess: function() {
      this.isPuzzleRunning = false;
    },

    toArray(nodes: NodeList) {
      return Array.prototype.slice.call(nodes);
    }
  }
} as Vue.ComponentOptions<IApp>);