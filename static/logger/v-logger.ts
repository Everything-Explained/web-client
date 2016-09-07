import {Web} from '../libs/web';

interface IData {
  level?: number;
  country?: string;
  identity?: string;
  req_type?: string;
  method?: string;
  rawMethod?: string;
  msg?: string;
  time?: string;
  uid?: string;
  rawTime?: string;
  classes?: string;
  data?: any;
  dataString?: string;
  msgLabelClass?: string;
  msgValueClass?: string;
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
      body: null,
      msgLabelClass: null,
      msgValueClass: null,
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
            , req = null;

          entry.classes = '';
          entry.method = `${msg.split(' ', 2)[0]}`.trim();
          entry.rawMethod = [entry.method, msg.split(' ', 2)[1]].join(' ');
          msg = msg.replace(/POST|GET|DELETE/g, '');

          [req, msg] = this.getAPIReference(msg, entry);

          this.setEntryLevel(entry);
          d.msgLabelClass = entry.msgLabelClass;
          d.msgValueClass = entry.msgValueClass;

          d.classes = entry.classes;
          d.time = [time.toLocaleDateString(), time.toLocaleTimeString()].join(' ');
          d.uid = entry.uid;
          d.identity = entry.identity;
          d.method = entry.method;
          d.rawMethod = entry.rawMethod;
          d.dataString = req;
          if (entry.data) d.data = entry.data;
          d.msg = msg.trim();
          sanitized.push(d);
        }

        this.logLines = sanitized;
        this.logLength = sanitized.length;

      })
    },

    getAPIReference: function(msg: string, entry: IData) {
      let req = '/?'
      if (~msg.indexOf('/internal') && msg.match(/\/internal\/.+\s/)) {
        msg = msg.split(' ').filter(v => {
                if (~v.indexOf('internal')) return false;
                return true;
              }).join(' ');

        if (entry.data) {
          for (let key in entry.data) {
            req += `${key}=${entry.data[key]}`;
          }
        }

        entry.classes = 'internal';
        req = (req.length > 2) ? `${req.replace(/\&$/, '')} ` : null;
        return [req, msg]
      } else {
        msg = msg.trim();
        if (~msg.indexOf('/') && ~msg.indexOf(' ')) {
          msg = msg.substr(msg.indexOf(' ') + 1);
        }
      }
      return [null, msg];

    },


    setEntryLevel: function(entry: IData) {

      let setData = (type: string) => {
        entry.classes += ` ${type}`;
        entry.msgLabelClass = `${type}-label`;
        entry.msgValueClass = `${type}-value`;
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
      W.DELETE(`/internal/logger/${this.logFile}`, {}, (err, code, data) => {
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
    },


    showLogEntry: function(data: IData) {
      let d = {
        time: data.time,
        uid: data.uid,
        rawMethod: data.rawMethod,
        fields: (data.data) ? data.data : null,
        body: null,
        msg: data.msg,
        msgLabelClass: data.msgLabelClass,
        msgValueClass: data.msgValueClass
      }
      this.logEntryData = d;
      $('#modal1').openModal();

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


