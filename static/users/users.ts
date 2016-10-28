interface UserData {
  alias: string;
  email: string;
  email_verified: boolean;
  facebook_id: string;
  google_id: string;
  picture: string;
  access_level: number;
}

declare var Materialize: any;
declare var userData: UserData[];

for (let user of userData) {
  if (user.facebook_id) {
    user.picture = user.picture + '?width=32';
    continue;
  }

  if (user.google_id) {
    user.picture = user.picture + '?sz=32';
    continue;
  }
}

let vmUsers = new Vue({

  el: '#Container',

  data: {
    users: userData
  },

  filters: {
    normalize: (text: string) => {
      return text.toLowerCase();
    },
    level: (level: number) => {
      switch (level) {
        case 1: return 'Guest';
        case 2: return 'User';
        case 4: return 'MOD';
        case 8: return 'ADMIN';
      }
    }
  },


  methods: {
    deleteUser: function (user: UserData) {
      Web.POST('/internal/deleteuser', {
        fields: {
          alias: user.alias
        }
      }, (err, code, data) => {
        console.log(err, code, data);

      });
    },

    getLevel: function(level: number) {

      switch (level) {
        case 1: return 'guest';
        case 2: return 'user';
        case 4: return 'moderator';
        case 8: return 'admin';
      }

    }
  }


});

console.log(userData);