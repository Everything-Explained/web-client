import {Login} from '../../app-login';
import {inject} from 'aurelia-framework';
import {Session} from '../../app-session';

@inject(Login, Session)
export class Settings {
  constructor(private _login: Login, private _session: Session) {

  }

  logOut() {
    this._login.signOut((err, code, data) => {
      if (code == 200) {
        window.location.reload();
        return;
      }
      console.log(data);
    });
  }

  attached() {
    let obj = document.querySelector('#Settings') as HTMLElement;
    if (!obj) return;
    this._login.initAuthLibs(() => {

    });
  }
}