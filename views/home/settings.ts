import {Login} from '../../app-login';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Login, Router)
export class Settings {
  constructor(private _login: Login, private _router: Router) {}

  logOut() {
    this._login.signOut((err, code, data) => {
      if (code == 200) {
        this._router.navigate('signin');
        return;
      }
    });
  }

  attached() {
    let obj = document.querySelector('#Settings') as HTMLElement;
    window.session = JSON.parse(obj.dataset['session']);
  }
}