



let vmInviter = new Vue({
  el: '#Container',

  data: {
    inviteCode: ' ',
    days: '1',
    uses: '1',
    invites: []
  },


  attached: function() {
    this.checkServerStatus(0, null, true);
  },



  computed: {
    hours: function() {
      let days = parseInt(this.days);
      return (days == 0)
        ? (365 * 10) * 24
        : days * 24;
    }
  },



  filters: {
    time: function(time: string) {
      let t = parseFloat(time);

      if (t == 0) {
        return 'Expired';
      }

      if (t <= 24) {
        return t.toFixed(0) + ' Hours';
      }

      if (t / 24 <= 30) {
        return (t / 24).toFixed(0) + ' Days';
      }

      if (t / 24 / 30 <= 13) {
        return 'Long';
      }

      return 'Unlimited';

    },

    toClass: function(time: string) {
      if (~time.indexOf('Expired')) return 'expired';
      if (~time.indexOf('Long')) return 'long';
      if (~time.indexOf('Unlimited')) return 'unlimited';
      return '';
    }
  },



  methods: {
    generate: function() {
      this.$els.invitebox.classList.remove('invalid');
      this.$els.inviteerror.classList.remove('active');

      Web.GET('/internal/invite', {
        fields: {
          hours: this.hours
        }
      }, (err, code, data: any) => {
        if (err) {
          console.error(err);
        }
        else {
          this.inviteCode = data.code;
        }
      });
    },


    save: function() {
      let input = this.$els.invitebox as HTMLInputElement
        , error = this.$els.inviteerror as HTMLElement
        , invites = this.invites as any[];

      if (!input.value.trim().length) {
        input.classList.add('invalid');
        error.innerText = 'Generate Invite';
        error.classList.add('active');
        return;
      }

      Web.POST('/internal/addinvite', {
        fields: {
          code: this.inviteCode,
          uses: this.uses
        }
      }, (err, code, data) => {
        if (err) {
          console.error(err.msg);
          return;
        }
        this.inviteCode = ' ';
        this.getInviteList();
      });
    },


    copy: function(e: MouseEvent) {
      window.getSelection().removeAllRanges();
      let obj = e.target as HTMLElement
        , range = document.createRange()
        , overlay = this.$els.overlay as HTMLElement;

      overlay.children[0].textContent = obj.textContent;
      overlay.classList.add('copy-toggle');
      setTimeout(() => {
        overlay.classList.remove('copy-toggle');
      }, 2000);

      range.selectNode(obj);
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();

    },


    rangeChanged: function(ev: KeyboardEvent) {
      let obj = ev.target as HTMLInputElement
        , event = document.createEvent('HTMLEvents');


      if (this.$els.invitebox.value.trim().length) {
        this.$els.invitebox.value = ' ';
      }

      event.initEvent('change', true, false);

      if (obj.value == '0')
        obj.blur();

      if (parseInt(obj.value) < 0) {
        obj.value = '1';
      }

      if (obj.classList.contains('days')) {
        if (obj.value == '0') {
          this.$els.uses.value = 0;
          this.$els.uses.dispatchEvent(event);
          return;
        }
      }

      if (obj.classList.contains('uses')) {
        let days = this.$els.days as HTMLInputElement;
        if (days.value == '0' && obj.value > '0') {
          days.value = '365';
          days.dispatchEvent(event);
        }
      }
    },


    getInviteList: function(delay?: number) {
      setTimeout(() => {
        Web.GET('/internal/listinvites', {}, (err, code, data: any[]) => {
          if (err) {
            console.log(err);
            return;
          }
          data = data.sort((a, b) => {
            return b.time_remaining - a.time_remaining;
          });
          this.invites = data;
        });
      }, delay || 0);

    },


    deleteInvite: function(code: string) {
      Web.POST('/internal/deleteinvite', {
        fields: {
          code
        }
      }, (err, code, data) => {
        if (err) {
          console.error(err);
          return;
        }
        this.getInviteList();
      });
    },


    refreshInviteList: function(ev: MouseEvent) {
      this.checkServerStatus(0, ev.target);
    },


    checkServerStatus: function(delay, loader: HTMLElement, firstLoad = false) {

      if (loader) {
        loader.classList.add('rotate');
      }

      let form = this.$els.form as HTMLElement
        , status = this.$els.serverstatus as HTMLElement;

      Web.GET('/internal/ping', {}, (err, code, data) => {
        if (loader) {
          loader.classList.remove('rotate');
        }
        if (err || code != 200) {
          form.classList.add('hide');
          if (status.classList.contains('hide'))
            status.classList.remove('hide');
          status.classList.add('active');
          return;
        }
        form.classList.remove('active');
        form.classList.remove('hide');
        form.classList.add('active');
        if (!firstLoad)
          status.classList.add('hide');
        this.getInviteList(delay || 0);
      });
    },

    refreshPage: function() {
      this.checkServerStatus(0, this.$els.loader);
    }
  }
});