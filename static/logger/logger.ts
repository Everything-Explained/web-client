/// <reference path="../typings/globalLib.d.ts" />



declare var $: any;


let knownIPs = {
  M$BOT: ['207.46.13.7', '207.46.13.210'],
  CHINABOT: ['23.99.122.165'],
  SHADOWSRV: ['184.105.139.68',
              '184.105.247.196',
              '216.218.206.66',
              '216.218.206.67',
              '74.82.47.5'],
  AEDAEUM: ['107.185.40.53', '127.0.0.1'],
  MISCBOT: ['137.116.71.170'],
  BANNERGRAB: ['212.92.127.214',
               '139.162.13.205',
               '208.109.249.220']
};


let vmLogger = new Vue({
  el: '#MainContent',


  data: {
    multiplier: 1,
    userLength: 100,
    logFile: '',
    logLength: 0,
    renderTime: '0ms',
    requestTime: '0ms',
    modalDataActive: false,
    logLines: [],
    modal: MiniModal,
    initialized: false,
    isLogPolling: false,
    isForcedStopPolling: false,
    isVueReady: false,
    logPollingInterval: 0,
    lastETag: null,
    log: {
      method: null,
      uid: null,
      rawMethod: null,
      time: null,
      fields: {
        filename: null,
        length: null,
      },
      browser: null,
      url: null,
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
      return (this.isLogPolling)
                ? 'Stop Polling'
                : 'Poll Log';
    }
  },




  attached: function() {
    let select = this.$els.select as HTMLSelectElement;

    // Setup log file and selected index
    this.logFile = select.options[select.selectedIndex].textContent;

    this.getLog();
  },




  ready: function() {
    this.modal = new MiniModal();
    this.isVueReady = true;
  },


  filters: {
    isStack: function(val: any) {
      if (val.stack) {
        return val.stack;
      } else {
        return val;
      }
    },
    date: function(val: string) {
      return val.split(' ')[0];
    },
    time: function(val: string) {
      return val.split(' ')[1];
    }

  },




  methods: {
    getLog: function() {
      performance.clearMeasures();
      performance.mark('RenderLog');
      performance.mark('AjaxDelay');
      Web.GET(`/protected/logger/${this.logFile}`, {
        fields: {
          length: this.reqLength
        }
      }, (err, code, data, h) => {
        this.lastETag = h.ETag;
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
            if (entry.err instanceof Error) {
              let newStack =
                entry.err.stack.split('\n').filter((v, i) => {
                  if (i == 0) return true;
                  return ~v.indexOf('node_modules')
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
          }

          d.time = [time.toLocaleDateString(), time.toLocaleTimeString()].join(' ');
          d.uid = entry.uid;
          d.url = decodeURIComponent(entry.rawMethod.split(' ', 2)[1].trim());
          d.identity = this.checkForBots(entry.identity);
          d.rawMethod = entry.rawMethod;
          d.fields = entry.data || null;
          d.err = entry.err || null;
          d.body = null;
          d.browser = (entry.browser) ? this.filterBrowser(entry.browser) : null;
          d.msg = (decodeURIComponent(d.msg) == d.url) ? 'ACCEPTED REQUEST' : d.msg.trim();
          d.reqLink = entry.reqLink;
          d.country = entry.country;
          sanitized.push(d);
        }

        this.logLines = this.filterDuplicates(sanitized);
        this.logLength = sanitized.length;

        // this.filterDuplicates(sanitized);

      });
    },


    filterDuplicates: function(data: IData[]) {
      let filtered: IData[] = [];

      for (let d of data) {
        d.returnCount = 0;
        d.reqCount = 0;

        let isFiltered = false;
        for (let l = 0; l < filtered.length; l++) {
          let flog = filtered[l];


          if (flog.url === d.url &&
              flog.identity === d.identity &&
              flog.method === d.method) {

            // Filter Default Pairs
            if (flog.reqLink === d.reqLink && flog.msg !== d.msg) {
              d.reqCount = flog.reqCount;
              filtered[l] = d;
              isFiltered = true;
              break;
            }

            // Combine identical requests
            if (flog.msg === d.msg &&
                flog.dataString === d.dataString) {
              flog.reqCount += 1;
              isFiltered = true;
              break;
            }

          }

        }
        if (!isFiltered) {
          ++d.reqCount;
          filtered.push(d);
        }
      }

      return filtered;

      // return data.filter((v) => { v.reqCount = 0; return true;})

    },


    getAPIReference: function(msg: string, entry: IData, saveObj: IData) {
      let req = '/?';
      if ((~msg.indexOf('/internal') || ~msg.indexOf('/protected')) && msg.match(/\/(internal|protected)\/.+\s/)) {
        msg = msg.split(' ').filter(v => {
                if (~v.indexOf('internal') || ~v.indexOf('protected')) return false;
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
        saveObj.method = entry.method;
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


    filterBrowser: function(browser: string) {
      if (~browser.indexOf('UNKNOWN')) {
        return browser.split(': ')[1].replace(/\[|\]/g, '');
      }
      return browser;
    },


    deleteLog: function() {
      Web.DELETE(`/protected/logger/${this.logFile}`, {}, (err, code, data) => {
        if (err) {
          console.error(err.message);
          return;
        }
        this.$els.select.options[this.$els.select.selectedIndex].remove();
        this.onLogChange();
      });
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
        Web.HEAD(`/protected/logger/${this.logFile}`, {
          fields: {
            length: this.reqLength
          }
        }, (err, code, data, headers) => {
          if (this.lastETag !== headers.ETag) {
            this.getLog();
          }
        });
      }, 1700);
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
      if (e.buttons == 0) {
        this.log = data;
        setTimeout(() => {
          this.modal.show('LogDataModal');
        }, 0);
      }
    },


    checkForBots: function(identity: string) {
      for (let b in knownIPs) {
        for (let ip of knownIPs[b]) {
          if (ip == identity) {
            return b;
          }
        }
      }
      return identity;
    },


    getModalClass: function(val: string) {

      if (~val.indexOf('error')) {
        return 'error';
      }

      if (~val.indexOf('warn')) {
        return 'warn';
      }

      if (~val.indexOf('internal')) {
        return 'internal';
      }

      return val;
    },


    toggleModalData: function() {
      window.getSelection().removeAllRanges();
      this.modalDataActive = !this.modalDataActive;
    }

  }

});




vmLogger.$watch('logLines', function() {

  // After log is populated, scroll to bottom
  let contentObj = this.$els.content as HTMLElement;
  contentObj.scrollTop = contentObj.scrollHeight;

  if (this.isForcedStopPolling) {
    this.startLogPolling();
  }

  // Mark the performance after all operations are completed
  performance.mark('EndRenderLog');

  this.renderTime = this.measurePerformance('RenderLog', 'EndRenderLog');
});


