interface IApp extends Vue {

  puzzle: MemoryPuzzle;
  stages: number;
  stage: number;
  levels: number;
  level: number;
  pieces: IPuzzlePiece[];
  answers: IPuzzleAnswer[];

  btnStart: HTMLButtonElement;
  btnSetup: HTMLButtonElement;

  countdown: number;
  shuffleSpeed: number;
  shuffleAmount: number;
  isBoardSetup: boolean;
  isBoardActive: boolean;
  isPuzzleRunning: boolean;
  isLoaded: boolean;
  puzzlePieces: {order: number, draggable: boolean}[];
  onPuzzleSuccess: () => void;
  setPieces: () => void;

  toArray: (list: NodeList) => any[];
  toNumberedArray: (count: number) => number[];

  totalAccuracy: number;
  levelAccuracy: number;

}



let app = new Vue({

  el: '#entry',




  data: {

    isBoardSetup: false,
    isPuzzleRunning: false,
    isBoardActive: false,
    isLoaded: false,

    levels: 0,
    stages: 0,

    level: 0,
    stage: 0,

    countdown: 0,
    countdownStart: 0,
    shuffleSpeed: 100,
    shuffleAmount: 10,

    totalAccuracy: 0,
    levelAccuracy: 0,

    pieces: [],
    answers: []

  },

  created: function() {
    this.puzzle = new MemoryPuzzle(this);
    this.stages = this.puzzle.levels.stage.length;
    this.levels = this.puzzle.levels.stage[0].length;
    this.setPieces();
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


    onDragStart: function(ev: DragEvent, index: number) {
      this.puzzle.onDragStart(ev, index);
    },

    setLevel: function(ev: MouseEvent) {
      let obj = ev.target as HTMLSelectElement;
      this.level = obj.selectedIndex;
      this.puzzle.level = this.level;
      this.setPieces();
      this.isBoardActive = false;
    },

    // Resets level to 0 for next stage
    setStage: function(ev: MouseEvent) {
      let obj = ev.target as HTMLSelectElement
        , lvlObj = (this.$refs['levelSelect'] as HTMLSelectElement)
      ;
      this.stage = obj.selectedIndex;
      this.puzzle.stage = obj.selectedIndex;
      this.levels = this.puzzle.levels.stage[obj.selectedIndex].length;
      this.level = 0;
      lvlObj.selectedIndex = this.level;
      this.setPieces();
    },

    setupBoard: function(ev: MouseEvent) {
      if (this.puzzle.setupBoard()) {
        this.setPieces();
        this.isBoardSetup = true;
      }
    },


    beginLevel: function() {
      this.isPuzzleRunning = true;
      this.isBoardSetup = false;
      this.puzzle.beginLevel();
    },


    setPieces: function() {
      this.pieces = this.puzzle.pieces;
      this.answers = this.puzzle.answers;
      this.isBoardSetup = false;
      this.isBoardActive = false;
    },
    onPuzzleSuccess: function() {
      this.isPuzzleRunning = false;
    },

    toArray(nodes: NodeList) {
      return Array.prototype.slice.call(nodes);
    }
  }
} as Vue.ComponentOptions<IApp>);