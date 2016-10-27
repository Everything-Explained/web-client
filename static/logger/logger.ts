/// <reference path="../typings/globalLib.d.ts" />



declare var $: any;


let vmLogger = new Vue({
  el: '#MainContent',


  data: {
    multiplier: 1,
    userLength: 100,
    logFile: '',
    logLength: 0,
    renderTime: '0ms',
    requestTime: '0ms',
    logLines: [],
    initialized: false,
    isLogPolling: false,
    isForcedStopPolling: false,
    isVueReady: false,
    logPollingInterval: 0,
    logEntryData: {
      method: null,
      uid: null,
      rawMethod: null,
      time: null,
      fields: {
        filename: null,
        length: null,
      },
      err: null,
      body: null,
      msgLabelClass: null,
      msgValueClass: null,
      modalClass: null,
      msg: null
    }
  },




  computed: {
    reqLength: function() {
      return this.multiplier * this.userLength;
    },

    pollingText: function() {
      return+
        (this.isLogPolling)
          ? 'Stop Polling'
          : 'Poll Log';
    }
  },




  attached: function() {
    let select = this.$els.select as HTMLSelectElement;

    // Setup log file and selected index
    this.logFile = select.options[select.selectedIndex].textContent;

    this.initSelect();
    $('.modal-trigger').leanModal({
      in_duration: 230,
      out_duration: 170
    });
    this.getLog();
  },




  ready: function() {
    this.isVueReady = true;
  },




  methods: {
    getLog: function() {
      performance.clearMeasures();
      performance.mark('RenderLog');
      performance.mark('AjaxDelay');
      Web.GET('/internal/logger', {
        fields: {
          length: this.reqLength,
          filename: this.logFile
        }
      }, (err, code, data) => {
        performance.mark('EndAjaxDelay');
        this.requestTime = this.measurePerformance('AjaxDelay', 'EndAjaxDelay');

        let logLines = data as IData[]
          , sanitized = [] as IData[];

        for (let entry of logLines) {
          let d: IData = {}
            , time = new Date(entry.time)
            , msg =
                (entry.req_type)
                  ? `${entry.req_type} ${entry.msg}`
                  : entry.msg
            , req = null;

          entry.classes = '';
          entry.method = `${msg.split(' ', 2)[0]}`.trim();
          entry.rawMethod = [entry.method, msg.split(' ', 2)[1]].join(' ');
          msg = msg.replace(/POST|GET|DELETE/g, '');

          // Set msg and and method data
          this.getAPIReference(msg, entry, d);

          // Set all classes for entry log level
          this.setEntryLevel(entry, d);

          if (entry.err) {
            let newStack =
              entry.err.stack.split('\n').filter((v, i) => {
                if (i == 0) return true;
                return+
                  ~v.indexOf('node_modules')
                    ? false
                  : !~v.indexOf('\\')
                    ? false
                  : true;
              })
              .map((v) => {
                if (!~v.indexOf('.js')) return v;

                let parts = v.split('\\');
                return `    (@) /${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
              })
              .join('\n');

            entry.err.stack = newStack;
          }

          d.time = [time.toLocaleDateString(), time.toLocaleTimeString()].join(' ');
          d.uid = entry.uid;
          d.identity = entry.identity;
          d.rawMethod = entry.rawMethod;
          d.fields = entry.data || null;
          d.err = entry.err || null;
          d.body = null;
          d.msg = d.msg.trim();
          sanitized.push(d);
        }

        this.logLines = sanitized;
        this.logLength = sanitized.length;

      });
    },

    getAPIReference: function(msg: string, entry: IData, saveObj: IData) {
      let req = '/?';
      if (~msg.indexOf('/internal') && msg.match(/\/internal\/.+\s/)) {
        msg = msg.split(' ').filter(v => {
                if (~v.indexOf('internal')) return false;
                return true;
              }).join(' ');

        if (entry.data) {
          for (let key in entry.data) {
            req += `${key}=${entry.data[key]},`;
          }
        }
        req = req.substr(0, req.length - 1);

        saveObj.classes = 'internal';
        saveObj.dataString = (req.length > 2) ? `${req.replace(/\&$/, '')}` : null;
        saveObj.msg = msg;
        saveObj.method = 'RTN';
        return;
      } else {
        msg = msg.trim();
        if (~msg.indexOf('/') && ~msg.indexOf(' ')) {
          msg = msg.substr(msg.indexOf(' ') + 1);
        }
      }
      saveObj.dataString = null;
      saveObj.msg = msg;
      saveObj.method = entry.method;

    },


    setEntryLevel: function(entry: IData, save: IData) {

      let setData = (type: string) => {
        save.classes =
          (save.classes)
            ? `${save.classes} ${type}`
            : `${type}`;
        save.msgLabelClass = `${type}-label`;
        save.msgValueClass = `${type}-value`;
        save.modalClass = `${type}`;
      };

      switch (entry.level) {
        case 30: setData('success'); break;
        case 40: setData('warn'); break;
        case 50: setData('error'); break;
        default:
          throw new Error(`Oops, log level "${entry.level}" has no code paths.`);
      }
    },


    deleteLog: function() {
      Web.DELETE(`/internal/logger/${this.logFile}`, {}, (err, code, data) => {
        if (err) {
          console.error(err.message);
          return;
        }
        this.$els.select.options[this.$els.select.selectedIndex].remove();
        this.initSelect();
        this.onLogChange();
      });
    },


    initSelect: function() {
      $('select').material_select();
    },


    stopLogPolling: function(force = false) {
      clearInterval(this.logPollingInterval);
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
        if (vmLogger.$data.isLogPolling)
          this.stopLogPolling(true);

        // Get new file
        this.getLog();

      }
    },


    measurePerformance: function (start: string, end: string) {

      // Create random unique name
      let rng = ((Math.random() * 1337) + 1).toFixed(3);
      performance.measure(rng, start, end);

      let timing = (performance.getEntriesByName(rng)[0].duration);

      // Benchmarks should never be over a minute
      return+
        (timing > 1000)
          ? (timing /= 1000).toFixed(2) + 's'
          : timing.toFixed(0) + 'ms';


    },


    showLogEntry: function(data: IData, e: MouseEvent) {
      if (e.buttons == 1) {
        this.logEntryData = data;
        $('#modal1').openModal();
      }


    }

  }

});




vmLogger.$watch('logLines', function() {

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

  this.renderTime = this.measurePerformance('RenderLog', 'EndRenderLog');
});


