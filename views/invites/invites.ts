import {Web} from '../../helpers/web';
import {computedFrom} from 'aurelia-framework';


export class Invites {

  minMsgLen  = 150; // Characters needed to submit message
  minNameLen = 4;  // Characters needed to submit name

  elMsg: HTMLInputElement;
  elName: HTMLInputElement;

  constructor() {

  }


  get msgLen() {
    return this.elMsg.value.length;
  }

  @computedFrom('minMsgLen', 'msgLen')
  get msgLenDiff() {
    return this.minMsgLen - this.elMsg.value.length;
  }

  get nameLen() {
    return this.elName.value.length;
  }

  @computedFrom('minNameLen', 'nameLen')
  get nameLenDiff() {
    return this.minNameLen - this.nameLen;
  }



  submit() {
    Web.POST('/internal/invite', {
      fields: {
        name: this.elName.value,
        message: this.elMsg.value
      }
    }, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }


    });
  }
}