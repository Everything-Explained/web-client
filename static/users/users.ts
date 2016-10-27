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
    toLevelName: (level: number) => {

    }
  }


});

console.log(userData);