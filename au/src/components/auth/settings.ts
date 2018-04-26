import {Login} from '../../shared/services/auth-service';
import {inject} from 'aurelia-framework';
import {Session} from '../../shared/models/session';

@inject(Login, Session)
export class Settings {
  constructor(private _login: Login, private _session: Session) {

  }

  logOut() {
    this._login.signOut((err, code, data) => {
      if (code == 200) {
        return;
      }
      console.error(data);
    });
  }

  attached() {
    let obj = document.querySelector('#Settings') as HTMLElement;
    if (!obj) return;
    this._login.initAuthLibs(() => {

    });
  }
}