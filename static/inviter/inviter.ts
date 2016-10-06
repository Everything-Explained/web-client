
declare var Materialize: any;


let vmInviter = new Vue({
  el: '.invite-form',

  data: {
    inviteCode: null,
    days: 1,
    uses: 1
  },


  attached: function() {
  },

  computed: {
    hours: function() {
      return (this.days === 0)
        ? (365 * 10) * 24
        : this.days * 24;
    }
  },

  methods: {
    generate: function() {
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
          // Textbox label does not animate on change
          setTimeout(() => {
            Materialize.updateTextFields();
          }, 0);
        }
      });
    },

    save: function() {
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
        console.info('Saved!');
      });
    },

    rangeChanged: function(ev: KeyboardEvent) {
      let obj = ev.target as HTMLInputElement;

      if (obj.value == '0')
        obj.blur();
    }
  }
});