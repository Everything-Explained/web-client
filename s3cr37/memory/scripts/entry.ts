interface IApp extends Vue {

  puzzle: MemoryPuzzle;
  stats: Stats;


  btnStart: HTMLButtonElement;
  btnSetup: HTMLButtonElement;

  isLoaded: boolean;
  puzzlePieces: {order: number, draggable: boolean}[];
  onPuzzleSuccess: () => void;




}



let app = new Vue({

  el: '#entry',




  data: {

    isLoaded: false,
    version: 'v1.0',

    stage: 0,
    totalTries: 0,
    currentTries: 0,

    puzzle: new MemoryPuzzle(this),
    stats: Stats,

    pieces: [],
    answers: [],

    test: {}

  },

  created: function() {
    this.stats = this.puzzle.stats;
  },


  mounted: function() {

    setTimeout(() => {
      this.isLoaded = true;
    }, 30);

  },


  computed: {
    levelAccFluxStr: function() {
      let acc = Math.abs(this.stats.levelAccFlux).toFixed(2);
      return (acc == '0.00') ? '' : `${acc}%`;
    },
    levelAccMod: function() {
      if (this.stats.levelAccFlux == 0) return '';
      return (this.stats.levelAccFlux < 0) ? '-' : '+';
    },

    totalAccFluxStr: function() {
      let acc = Math.abs(this.stats.totalAccFlux).toFixed(2);
      return (acc == '0.00') ? '' : `${acc}%`;
    },

    totalAccMod: function() {
      if (this.stats.totalAccFlux == 0) return '';
      return (this.stats.totalAccFlux < 0) ? '-' : '+';
    }

  },

  methods: {

    preventDefault: function(ev: DragEvent) {
      ev.preventDefault();
    },

  }
} as Vue.ComponentOptions<IApp>);