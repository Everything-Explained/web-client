import {Web} from '../../helpers/web';
import {computedFrom} from 'aurelia-framework';


export class Invites {

  public minMsgLen  = 200; // Characters needed to submit message
  public minNameLen = 4;  // Characters needed to submit name
  public nameLen = 0;
  public msgLen = 0;
  public msgLimits = {
    hours: 0,
    minutes: 0
  };

  public isAttached = false;

  public isLoading = true;
  private _isMsgSent = false;
  private _isMsgFailed = false;
  private _isMsgLimited = false;

  public isEmailValid = false;

  public elMsg: HTMLInputElement;
  public elName: HTMLInputElement;
  public elEmail: HTMLInputElement;

  public exEmail = new RegExp('/^.+@.+\..+$/');

  constructor() {
    Web.GET('/internal/canrequestinvite', {}, (err, code, data) => {
      if (code == 202) {
        this.isLoading = false;
        this.isMsgLimited = true;
        this.msgLimits = data;
      }
      this.isLoading = false;
    });
  }

  set isMsgSent(val) {
    if (val) this.isLoading = false;
    this._isMsgSent = val;
  }
  get isMsgSent() { return this._isMsgSent; }


  set isMsgFailed(val) {
    if (val) this.isLoading = false;
    this._isMsgFailed = val;
  }
  get isMsgFailed() { return this._isMsgFailed; }


  set isMsgLimited(val) {
    if (val) this.isLoading = false;
    this._isMsgLimited = val;
  }
  get isMsgLimited() {
    return this._isMsgLimited;
  }



  get email() {
    return this.elEmail.value;
  }

  get name() {
    return this.elName.value;
  }

  get message() {
    return this.elMsg.value;
  }

  @computedFrom('isLoading', 'isMsgSent', 'isMsgFailed', 'isMsgLimited')
  get msgStatusActive() {
    let val = this.isLoading ||
              this.isMsgSent ||
              this.isMsgFailed ||
              this.isMsgLimited;
    return val;
  }



  // Event Driven
  setMsgLen() {
    this.msgLen = this.message.length;
  }

  @computedFrom('minMsgLen', 'msgLen')
  get msgLenDiff() {
    let diff = this.minMsgLen - this.msgLen;
    return diff < 0 ? 0 : diff;
  }

  // Event Driven
  setNameLen() {
    this.nameLen = this.name.length;
  }

  @computedFrom('minNameLen', 'nameLen')
  get nameLenDiff() {
    let diff = this.minNameLen - this.nameLen;
    return diff < 0 ? 0 : diff;
  }




  validateEmail() {
    this.isEmailValid = /^.+@.+\..+$/.test(this.email);
    return true;
  }


  async submit() {
    this.isLoading = true;
    let resp = null;

    try {
      resp = await this._requestInvite();
    }
    catch (err) { console.warn(err); }

    if (!resp) {
      this.isMsgFailed = true; return;
    }

    if (resp.code == 202) {
      this.isMsgLimited = true;
      this.msgLimits = resp.data;
    }
    else {
      this.isMsgSent = true;
    }

  }

  private _requestInvite() {

    interface ITimeLimit {
      hours: number;
      minutes: number;
    }

    return new Promise<{code: number, data: ITimeLimit }>((rs, rj) => {
      Web.POST('/internal/requestinvite',  {
        fields: {
          alias: this.name,
          email: this.email,
          message: this.message
        }
      }, (err, code, data) => {
        if (err) {
          rj(err);
          return;
        }
        rs({code, data});
      });
    });
  }

  public attached() {
    setTimeout(() => {
      this.isAttached = true;
    }, 50);
  }
}