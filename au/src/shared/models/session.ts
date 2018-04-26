

export class Session {

  private _isFirstSignin = false;

  constructor() {
  }

  get session() {
    return window.session;
  }

  get authed() {
    return window.session.authed;
  }

  set authed(val: boolean) {
    window.session.authed = val;
  }

  get alias() {
    return window.session.alias;
  }

  get email() {
    return window.session.email;
  }

  get isFirstSignin() {
    return this._isFirstSignin;
  }

  set isFirstSignin(val: boolean) {
    this._isFirstSignin = val;
  }

}