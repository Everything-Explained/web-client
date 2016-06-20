const client_id = '15334727358-lehq7huis9fm49iee7i03l15sj6g8r68.apps.googleusercontent.com';
const apiKey = 'AIzaSyAJTuseZ8KbSzREwbs4lcTu4icoMIKhYQY';
const scope = 'https://www.googleapis.com/auth/plus.me';

import {IRobot} from '../../helpers/robot-check';
import {inject} from 'aurelia-framework';
import {Login} from '../../app-login';
import * as http from 'nanoajax';

enum SignupStatus {
  NONE = 1,
  ROBOT = 2,
  INVITE = 4
}

@inject(Login)
export class Signin {

  private _auth2: gapi.auth2.GoogleAuth;
  private _robotNodes: HTMLElement[];
  private _robotError: HTMLElement;
  private _robot: IRobot;


  // *** *** *** FROM VIEW *** *** ***
  public signInContent: HTMLElement;
  public signUpContent: HTMLElement;
  public robotContent: HTMLElement;
  public inviteContent: HTMLElement;
  public buttonRobot: HTMLElement;
  public buttonSSO: HTMLElement;
  public buttonDB: HTMLElement;
  public elNickname: HTMLInputElement;
  public elPassword: HTMLInputElement;
  public elCPassword: HTMLInputElement;
  public elEmail: HTMLInputElement;
  public elCEmail: HTMLInputElement;
  public elSSO: HTMLElement;
  public elDB: HTMLElement;
  public elInviteButton: HTMLElement;
  public elInviteContent: HTMLInputElement;

  public robotButtonText = 'Start!';

  private _nickLength = 0;

  private _signupState = SignupStatus.NONE;

  constructor(private _login: Login) {
  }

    public test() {



    // gapi.client.setApiKey(apiKey);

    // this.test2();

  }

  get isRobotError() {
    let val = false;
    if (this._robot) val = this._robot.inError;
    return val;
  }

  public saveNickLength(ev: KeyboardEvent) {
    let obj =  ev.target as HTMLInputElement;
    this._nickLength = obj.value.length;
  }

  get nickLength() {

    return this._nickLength;

  }

  public isNickValid(ev: KeyboardEvent) {
    let obj = ev.target as HTMLInputElement
      , validInput = obj.value.match(/^[a-zA-Z0-9]+$/g);

    if (obj.value.length < 4)
      return this.setInputState(obj, null);

    if (!validInput) {
      return this.setInputState(obj, 'invalid');
    }

    this.setInputState(obj, 'valid');

  }

  public checkConfirm(in1: HTMLInputElement, in2: HTMLInputElement, onblur = false) {

    if (in1.value.length == 0 && in2.value.length == 0) return;

    if (in1.value === in2.value) {
      this.setInputState(in1, 'valid');
      this.setInputState(in2, 'valid');
      return;
    }

    if (onblur == true && (!in1.value.length || in1.value !== in2.value)) {
      this.setInputState(in1, 'invalid');
      this.setInputState(in2, 'invalid');
      return;
    }

    this.setInputState(in1, null);
    this.setInputState(in2, null);

  }


  setInputState(el: HTMLInputElement, valid: string) {

    switch (valid) {
      case 'valid':
        el.parentElement.classList.remove('icon-times-circle');
        el.parentElement.classList.add('icon-check-circle-o');
        el.parentElement.classList.add('valid-input');
        break;

      case 'invalid':
        el.parentElement.classList.remove('icon-check-circle-o');
        el.parentElement.classList.remove('valid-input');
        el.parentElement.classList.add('icon-times-circle');
        break;

      default:
        el.parentElement.classList.remove('icon-times-circle');
        el.parentElement.classList.add('icon-check-circle-o');
        el.parentElement.classList.remove('valid-input');
        break;
    }

  }


  public signUp() {
    Promise.resolve(null)
      // *** ROBOT TEST ***
      .then<any>(() => {
        return this.showRobot();
      })
      // *** ENTER INVITE ***
      .then<any>(() => {
        return this.askForInvite();
      })
      .then<any>(() => {
        return this.showSignup();
      });
  }

  public showRobot() {
    this.signInContent.classList.add('hide');
    this.robotContent.classList.remove('hide');
    if (!(this._signupState & SignupStatus.ROBOT)) {
      this._signupState |= SignupStatus.ROBOT;
    }

    return new Promise((rs, rj) => {
      this._robot = new IRobot(this._robotNodes, res => {
        if (res) {
          rs(true);
        } else {
          this.robotButtonText = 'Try Again!';
        }
      });
    });
  }

  public startRobotTest() {
    if (this._robot.started) {
      this._robot.restart();
    } else {
      this._robot.start(700, 300);
    }
  }

  public askForInvite() {
    this.robotContent.classList.add('hide');
    this.inviteContent.classList.remove('hide');

    return new Promise((rs, rj) => {

      if (! (this._signupState & SignupStatus.INVITE)) {
        this._signupState |= SignupStatus.INVITE;
        this.elInviteButton.addEventListener('click', () => {

          http.ajax({
            method: 'POST',
            url: '/internal/validinvite',
            body: 'asdf',
            headers: {
              'Content-Type': 'text/plain'
            }
          }, (code, res, req) => {
            console.log(code, res);
          });
        });
      }

    });
  }

  public showSignup() {
    this.inviteContent.classList.add('hide');
    this.signUpContent.classList.remove('hide');
  }

  public SignUp(type: string) {

    if (type === 'google') {
      this._auth2.signIn()
        .then(d => {
          console.log(d.getAuthResponse());
        })
        .catch(err => {
          console.error(err);
        });

      return;
    }

    if (type === 'facebook') {
      return;
    }

  }

  public SignIn(type: string) {

    if (type === 'google') {
      this._login.signIn('google');
      return;
    }

    if (type === 'facebook') {
      FB.getLoginStatus(res => {
        if (res.status == 'connected') {
          console.log(res.authResponse.accessToken);
        }

        if (res.status === 'not_authorized') {
          FB.login(res => {
            console.dir(res.authResponse.accessToken);
          }, {
            scope: 'email,public_profile',
            return_scopes: true
          });
        }
      });
      return;
    }



  }

  public selectSignUp(type: string) {
    if (type === 'sso' && !this.buttonSSO.classList.contains('selected')) {
      this.buttonDB.classList.remove('selected');
      this.buttonSSO.classList.add('selected');
      this.elSSO.classList.remove('hide');
      this.elDB.classList.add('hide');
      return;
    }

    if (type === 'db' && !this.buttonDB.classList.contains('selected')) {
      this.buttonSSO.classList.remove('selected');
      this.buttonDB.classList.add('selected');
      this.elDB.classList.remove('hide');
      this.elSSO.classList.add('hide');
      return;
    }
  }

  public test2() {
    gapi.auth.authorize({ client_id, scope, immediate: true}, (result) => {
      console.log('hello there');
      console.log(result);
    });
  }


  attached() {

    // INIT Google Signon
    gapi.load('auth2', () => {
      this._auth2 = gapi.auth2.init({
        client_id
      });
    });

    this._robotNodes = Array.prototype.slice.call(document.querySelectorAll('.node')) as HTMLElement[];

    // Track nick length
    this.elNickname.addEventListener('keyup', (ev) => {
      let obj = ev.target as HTMLInputElement;
      this._nickLength = obj.value.length;
    });


  }

}
