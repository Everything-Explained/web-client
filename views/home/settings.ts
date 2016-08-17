import {Login} from '../../app-login';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Session} from '../../app-session';

@inject(Login, Router, Session)
export class Settings {
  constructor(private _login: Login, private _router: Router, private _session: Session) {}

  logOut() {
    this._login.signOut((err, code, data) => {
      if (code == 200) {
        window.location.reload();
        return;
      }
    });
  }

  attached() {
    let obj = document.querySelector('#Settings') as HTMLElement;
    if (!obj) return;
    window.session = JSON.parse(obj.dataset['session']);
  }

  getViewStrategy() {
    return 'views/home/settings';
  }
}