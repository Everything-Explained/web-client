const client_id = '15334727358-lehq7huis9fm49iee7i03l15sj6g8r68.apps.googleusercontent.com';
const apiKey = 'AIzaSyAJTuseZ8KbSzREwbs4lcTu4icoMIKhYQY';
const scope = 'https://www.googleapis.com/auth/plus.me';

import {IRobot} from '../../helpers/robot-check';

export class Signin {

  private _auth2: gapi.auth2.GoogleAuth;
  private _robotNodes: HTMLElement[];
  private _robotError: HTMLElement;
  private _robot: IRobot;


  // *** *** *** FROM VIEW *** *** ***
  public signInContent: HTMLElement;
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

  public robotButtonText = 'Start!';

  private _nickLength = 0;

  constructor(private _el) {
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
      });
  }

  public showRobot() {
    this.signInContent.classList.add('hide');
    this.robotContent.classList.remove('hide');

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
      setTimeout(function() {
        rs(true);
      }, 1000);
    });
  }


  public selectSignUp(type: string) {
    if (type === 'sso' && !this.buttonSSO.classList.contains('selected')) {
      this.buttonDB.classList.remove('selected');
      this.buttonSSO.classList.add('selected');
      return;
    }

    if (type === 'db' && !this.buttonDB.classList.contains('selected')) {
      this.buttonSSO.classList.remove('selected');
      this.buttonDB.classList.add('selected');
      return;
    }
  }

  public test2() {
    gapi.auth.authorize({ client_id, scope, immediate: true}, (result) => {
      console.log('hello there');
      console.log(result);
    });
  }

  signIn() {
    // this._auth2.signIn()
    //   .then((d) => {
    //     console.log(d.getAuthResponse());
    //   });
    // auth2.attachClickHandler(el, {}, (user) => {
    //   console.log(user.getBasicProfile().getId());
    // },
    // (error) => {
    //   console.log(error);
    // });
  }


  attached() {
    // gapi.load('auth2', () => {
    //   this._auth2 = gapi.auth2.init({
    //     client_id
    //   });
    //   // this.attachSignin(document.getElementById('test'), auth2);
    // });

    this._robotNodes = Array.prototype.slice.call(document.querySelectorAll('.node')) as HTMLElement[];

    // Track nick length
    this.elNickname.addEventListener('keyup', (ev) => {
      let obj = ev.target as HTMLInputElement;
      this._nickLength = obj.value.length;
    });


  }

}
