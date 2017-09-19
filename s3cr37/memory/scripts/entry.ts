interface IApp extends Vue {

  puzzle: MemoryPuzzle;
  stages: number;
  stage: number;
  levels: number;
  level: number;
  totalTries: number;
  currentTries: number;
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
  refreshPieces: () => void;
  readyBoard: () => void;

  toNumberedArray: (count: number) => number[];

  totalAccuracy: number;
  totalAccFlux: number;
  levelAccuracy: number;
  levelAccFlux: number;


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
    totalTries: 0,
    currentTries: 0,

    countdown: 0,
    countdownStart: 0,
    shuffleSpeed: 100,
    shuffleAmount: 10,

    totalAccuracy: 0,
    totalAccFlux: 0,
    levelAccuracy: 0,
    levelAccFlux: 0,

    pieces: [],
    answers: []

  },

  created: function() {
    this.puzzle = new MemoryPuzzle(this);
    this.stages = this.puzzle.levels.stage.length;
    this.levels = this.puzzle.levels.stage[0].length;
    this.refreshPieces();
  },


  mounted: function() {

    setTimeout(() => {
      this.isLoaded = true;
    }, 30);

  },


  computed: {
    levelAccFluxStr: function() {
      let acc = Math.abs(this.levelAccFlux).toFixed(2);
      return `${acc}%`;
    },
    levelAccMod: function() {
      if (this.levelAccFlux == 0) return '';
      return (this.levelAccFlux < 0) ? '-' : '+';
    },

    totalAccFluxStr: function() {
      let acc = Math.abs(this.totalAccFlux).toFixed(2);
      return `${acc}%`;
    },

    totalAccMod: function() {
      if (this.totalAccFlux == 0) return '';
      return (this.totalAccFlux < 0) ? '-' : '+';
    }

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
      this.puzzle.level = obj.selectedIndex;
      this.refreshPieces();
    },

    setStage: function(ev: MouseEvent) {
      let obj = ev.target as HTMLSelectElement
        , lvlObj = (this.$refs['levelSelect'] as HTMLSelectElement)
      ;
      this.puzzle.stage = obj.selectedIndex;
      lvlObj.selectedIndex = this.level;
    },

    readyBoard: function(ev: MouseEvent) {
      this.puzzle.readyBoard();
      this.refreshPieces();
    },

    oops: function() {
      this.isPuzzleRunning = false;
      this.readyBoard();
      this.puzzle.clearTemp();
    },


    refreshPieces: function() {
      this.pieces = this.puzzle.pieces;
      this.answers = this.puzzle.answers;
    },

    onPuzzleSuccess: function() {
      this.isPuzzleRunning = false;
    },

  }
} as Vue.ComponentOptions<IApp>);