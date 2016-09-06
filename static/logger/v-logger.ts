import {Web} from '../libs/web';

interface IData {
  level?: number;
  country?: string;
  identity?: string;
  req_type?: string;
  method?: string;
  msg?: string;
  time?: string;
  uid?: string;
  rawTime?: string;
  classes?: string;
  data?: Object;
}

declare var W: typeof Web;
declare var $: any;



let vm = new Vue({
  el: '#MainContent',


  data: {
    multiplier: 1,
    userLength: 100,
    logFile: '',
    logLength: 0,
    renderTime: '0ms',
    logLines: [],
    initialized: false,
    isLogPolling: false,
    isForcedStopPolling: false,
    logPollingInterval: 0
  },

  computed: {
    reqLength: function() {
      return this.multiplier * this.userLength;
    },

    pollingText: function() {
      return+
        (this.isLogPolling)
          ? "Stop Polling"
          : "Poll Log";
    }
  },

  attached: function() {
    let select = this.$els.select as HTMLSelectElement;

    // Setup log file and selected index
    this.logFile = select.options[select.selectedIndex].textContent;

    this.initSelect();
    $('.modal-trigger').leanModal({
      in_duration: 230,
      out_duration: 170,
      starting_top: '5%',
      ending_top: '20%'
    });
    this.getLog();
  },

  methods: {
    getLog: function() {
      performance.clearMeasures();
      performance.mark('RenderLog');
      W.GET('/internal/logger', {
        fields: {
          length: this.reqLength,
          filename: this.logFile
        }
      }, (err, code, data) => {
        let logLines = JSON.parse(data) as IData[]
          , sanitized = [] as IData[];

        for (let entry of logLines) {
          let d: IData = {}
            , time = new Date(entry.time)
            , msg =
                (entry.req_type)
                  ? `${entry.req_type} ${entry.msg}`
                  : entry.msg
            , req = '/?'

          entry.classes = '';
          entry.method = `${msg.split(' ', 2)[0]}`;
          msg = msg.replace(/POST|GET|DELETE/g, '')

          if (~msg.indexOf('/internal') && msg.match(/\/internal\/.+\s/)) {
            msg = msg.split(' ').filter(v => {
                    if (~v.indexOf('internal')) return false;
                    return true;
                  }).join(' ');


            if (entry.data) {
              for (let d in entry.data) {
                req += `${d}=${entry.data[d]}`;
              }
            }
            entry.method = 'RTN'
            entry.classes = 'internal ';
            entry.data = (req.length > 2) ? ` ${req.replace(/\&$/, '')} ` : '';
          }

          if (entry.level == 30) {
            entry.classes += 'info'
          }
          else if (entry.level == 40) {
            entry.classes += 'warn'
          }
          else if (entry.level == 50) {
            entry.classes += 'error';
          }

          d.classes = entry.classes;
          d.time = time.toLocaleDateString() + time.toLocaleTimeString();
          d.uid = entry.uid;
          d.identity = entry.identity;
          d.method = entry.method
          if (entry.data) d.data = req;
          d.msg = msg.trim();
          sanitized.push(d);
        }

        this.logLines = sanitized;
        this.logLength = sanitized.length;

      })
    },

    deleteLog: function() {
      W.DELETE(`/internal/logger/${this.logFile}`, {}, (err, code, data) => {
        if (err) {
          console.error(err.message);
          return;
        }
        this.$els.select.options[this.$els.select.selectedIndex].remove();
        this.initSelect();
        this.logLines = [];
      });
    },

    initSelect: function() {
      $('select').material_select();
    },

    stopLogPolling: function(force = false) {
      clearInterval(this.logPollingInterval)
      this.isLogPolling = false;
      this.isForcedStopPolling = force;
    },

    startLogPolling: function() {
      this.isLogPolling = true;
      this.isForcedStopPolling = false;
      this.logPollingInterval = setInterval(() => {
        this.getLog();
      }, 1500);
    },


    toggleLogPolling: function() {
      // this.$els.poll
      if (this.isLogPolling) {
        this.stopLogPolling();
      }
      else {
        this.startLogPolling();
      }
    },

    onLogChange: function(buttonOnly = false) {
      let select = this.$els['select'] as HTMLSelectElement
        , btnDel = this.$els['btndelete'] as HTMLButtonElement;

      // Set the log file on file change
      this.logFile = select.options[select.selectedIndex].textContent;

      // Disable delete button on default files
      if (this.logFile.match(/(requests\.log|noumenae\.log)$/)) {
        btnDel.disabled = true;
      } else {
        btnDel.removeAttribute('disabled');
      }

      if (!buttonOnly) {

        // Force polling to stop when changing files
        if (vm.$data.isLogPolling)
          this.stopLogPolling(true);

        // Get new file
        this.getLog();

      }
    }



  }

});




vm.$watch('logLines', function() {

  // After log is populated, scroll to bottom
  let contentObj = this.$els.content as HTMLElement;
  contentObj.scrollTop = contentObj.scrollHeight;

  if (!this.isInitialized) {
    this.onLogChange();
    this.isInitialized = true;
  }

  if (this.isForcedStopPolling) {
    this.startLogPolling();
  }

  // Mark the performance after all operations are completed
  performance.mark('EndRenderLog');
  performance.measure('LogRenderTime', 'RenderLog', 'EndRenderLog');
  let timing = (performance.getEntriesByName('LogRenderTime')[0].duration).toFixed('0');
  this.renderTime = timing + 'ms';
});


