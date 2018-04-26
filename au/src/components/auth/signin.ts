const scope = 'https://www.googleapis.com/auth/plus.me';

import {IRobot} from '../../shared/utilities/robot-check';
import {Web} from '../../shared/services/web-get';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Login} from '../../shared/services/auth-service';
import {Session} from '../../shared/models/session';

enum SignupStatus {
  NONE = 1,
  ROBOT = 2,
  INVITE = 4
}

enum InputStates {
  DEFAULT,
  VALID,
  INVALID,
  NICKDEFAULT,
  NICKVALID,
  NICKINVALID
}

@inject(Login, Web, Router, Session)
export class Signin {

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
  public elSSONickname: HTMLInputElement;
  public elNickInputResponse: HTMLInputElement;
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

  private _nickInputResponse = '';

  private _socialActive = false;

  private _signInResponse = null;

  private _isResponseActive = false;

  public inviteResponse = '';

  public authLibsLoaded = false;

  constructor(private _login:   Login,
              private _web:     Web,
              private _router:  Router,
              private _session: Session)
  {

    this._login.initAuthLibs(() => {
      this.authLibsLoaded = true;
    });

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

  get nickInputResponse() {
    return this._nickInputResponse;
  }

  get socialActive() {
    return this._socialActive;
  }

  get isResponseActive() {
    return !!this._signInResponse;
  }

  public validateNick(ev: KeyboardEvent) {
    let obj = ev.target as HTMLInputElement
      , validInput = obj.value.match(/^[a-zA-Z0-9]+$/g);

    if (!obj.value.length) {
      this._nickInputResponse = 'You need a Nickname to Sign Up';
      this.setInputState(this.elNickInputResponse, InputStates.NICKINVALID);
      this.setInputState(obj, InputStates.INVALID);
      return;
    }

    if (obj.value.length < 4 && obj.value.length) {
      this._nickInputResponse = 'Nickname too Short';
      this.setInputState(this.elNickInputResponse, InputStates.NICKINVALID);
      this.setInputState(obj, InputStates.INVALID);
      return;
    }

    if (!validInput) {
      this._nickInputResponse = 'Only 0-9, a-z, & A-Z are Allowed';
      this.setInputState(this.elNickInputResponse, InputStates.NICKINVALID);
      this.setInputState(obj, InputStates.INVALID);
      return;
    }

    Web.GET(`/internal/validatealias/${obj.value}`, {},
    (err, code, data) => {


      if (code == 200) {

        this._nickInputResponse = 'Nick Available!';
        this.setInputState(obj, InputStates.VALID);
        this.setInputState(this.elNickInputResponse, InputStates.NICKVALID);
        this._socialActive = true;
        return;

      }

      if (code == 409 || code == 400) {
        this._nickInputResponse = err;
        this.setInputState(obj, InputStates.INVALID);
        this.setInputState(this.elNickInputResponse, InputStates.NICKINVALID);
        return;
      }


      this._nickInputResponse = 'Server Error! Try Again Later!';
      this.setInputState(obj, InputStates.INVALID);
      this.setInputState(this.elNickInputResponse, InputStates.NICKINVALID);

    });

  }


  public checkConfirm(in1: HTMLInputElement, in2: HTMLInputElement, onblur = false) {

    if (in1.value.length == 0 && in2.value.length == 0) return;

    if (in1.value === in2.value) {
      this.setInputState(in1, InputStates.VALID);
      this.setInputState(in2, InputStates.VALID);
      return;
    }

    if (onblur == true && (!in1.value.length || in1.value !== in2.value)) {
      this.setInputState(in1, InputStates.INVALID);
      this.setInputState(in2, InputStates.INVALID);
      return;
    }

    this.setInputState(in1, InputStates.DEFAULT);
    this.setInputState(in2, InputStates.DEFAULT);

  }


  setInputState(el: HTMLInputElement, valid: InputStates) {

    switch (valid) {
      case InputStates.VALID:
        el.parentElement.classList.remove('icon-times-circle');
        el.parentElement.classList.add('icon-check-circle-o');
        el.parentElement.classList.add('valid');
        break;

      case InputStates.INVALID:
        el.parentElement.classList.remove('icon-check-circle-o');
        el.parentElement.classList.remove('valid');
        el.parentElement.classList.add('icon-times-circle');
        break;

      case InputStates.DEFAULT:
        el.parentElement.classList.remove('icon-times-circle');
        el.parentElement.classList.add('icon-check-circle-o');
        el.parentElement.classList.remove('valid');
        break;

      case InputStates.NICKVALID:
        el.classList.remove('invalid');
        el.classList.add('valid');
        break;

      case InputStates.NICKINVALID:
        el.classList.remove('valid');
        el.classList.add('invalid');
        break;

      case InputStates.NICKDEFAULT:
        el.classList.remove('valid');
        el.classList.remove('invalid');
        break;

      default:
        throw new Error('Invalid Input State');
    }

  }



  public beginSignUpProcess() {
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

          this.inviteResponse = '';

          // TODO - Add a message to UI on failure conditions
          if (!this.elInviteContent.value ||
              !this.elInviteContent.value.length ||
              !/^[A-Z0-9]+$/g.test(this.elInviteContent.value)) {

            this.inviteResponse = `invalid invite: <span>codes are case-sensitive</span>`;
            return;
          }

          Web.POST(`/internal/validateinvite/${this.elInviteContent.value}`,
          {}, (err, code, data) => {
            if (code == 200) {
              let obj = data;

              if (obj.expired) {
                this.inviteResponse = 'that <span>invite</span> has <span>expired</span>';
                return;
              }

              if (!obj.validated || !obj.valid) {
                this.inviteResponse = '<span>oops</span> did you <span>misspell</span> the invite?';
                return;
              }
              rs(true);
            }
          });
        });
      }

    });
  }


  public showSignup() {
    this.inviteContent.classList.add('hide');
    this.signUpContent.classList.remove('hide');
  }



  public signUp(type: string) {

    // Do not signup if users are messing around
    if (!this._socialActive ||
        !this.elSSONickname.value ||
        !this.elSSONickname.value.length) return;

    this._login.signUp(this.elSSONickname.value, type, (err, code, data) => {

      if (code == 200) {
        this._session.isFirstSignin = true;
        location.reload();
      }

    });

  }



  get signInResponse() {
    return this._signInResponse;
  }



  public signIn(type: string) {

    this._login.signIn(type, (err, code, data) => {
      if (err) {
        console.log(err, err.msg);
        this._signInResponse = err.msg;
        return;
      }
      if (code == 200) {
        window.location.reload();
      }
    });

  }



  public signOut() {
    this._login.signOut((err, code, data) => {
      if (code == 200) {
        this._router.navigate('signin');
        return;
      }
    });
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



  attached() {

    this._robotNodes = Array.prototype.slice.call(document.querySelectorAll('.node')) as HTMLElement[];

    // Track nick length
    this.elNickname.addEventListener('keyup', (ev) => {
      let obj = ev.target as HTMLInputElement;
      this._nickLength = obj.value.length;
    });

    this.elSSONickname.addEventListener('keyup', ev => {
      let obj = ev.target as HTMLInputElement;
      this._nickLength = obj.value.length;
      this._socialActive = false;
    });
  }

}
