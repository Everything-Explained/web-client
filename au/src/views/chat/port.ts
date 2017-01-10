
import {Message, MessageScale, MessageType} from '../chat/message';
import {Chat} from './chat';

export class Port {

  private _oContainer: HTMLElement;
  private _oPort: HTMLElement;
  private _oTray: HTMLElement;
  private _scale: string;

  public name: string;
  private _isActive = false;
  private _view: Message[];
  private _chatView: Chat;
  private _scrollObj: IOptiscrollInstance;

  constructor(name: string, chatview: Chat, scale = 'medium') {

    this._scale = scale;
    this._view = [];
    this.name = name;
    this._chatView = chatview;

  }

  set messages(msgs: Message[]) {
    if (this._view.length > 0) {
      throw new Error('You need to transfer existing messages before overwriting');
    }

    msgs.forEach(m => m.scale = this._scale);

    this._view = msgs;

    this.scrollPort();
  }

  get messages() {
    return this._view.slice(0);
  }

  get container() {
    return this._oContainer;
  }


  set portContainer(obj: HTMLElement) {
    this._oContainer = obj;
    this._oPort = <HTMLElement> obj.children[0];
    this._oTray = <HTMLElement> this._oPort.children[0];

    if (this.name == 'main') {
      this._scrollObj = new Optiscroll(this._oPort, {
        autoUpdate: false
      });
    }
  }


  set messageScale(val: MessageScale) {

    switch (val) {
      case MessageScale.LARGE: this._scale = 'large'; break;
      case MessageScale.MEDIUM: this._scale = 'medium'; break;
      case MessageScale.SMALL: this._scale = 'small'; break;

      default: throw new Error('Invalid Message Scale');
    }

    for (let msg of this._view)
      msg.scale = this._scale;

    // this._chatView.addMessage(`${this.name} port scale set to ${val}`, MessageType.CLIENT);
  }

  set active(val: boolean) {
    if (val) {
      this._oPort.classList.add('active');
    } else {
      this._oPort.classList.remove('active');
    }
    this._isActive = val;
  }

  hide(){
    this._oContainer.style.display = 'none';
  }

  show() {
    this._oContainer.style.display = 'flex';
  }

  addMessage(msg: Message) {

    // Set message scale and add
    msg.scale = this._scale;
    this._view.push(msg);

    if (this._oContainer)
      this.scrollPort();

  }

  adjustPortFlex() {
    if (this._view.length > 0) {
      this._oContainer.style.flex = '3 0';
    } else {
      this._oContainer.style.flex = '1 0';
    }
  }

  scrollPort() {

    setTimeout(() => {
      this._scrollObj.scrollTo(false, 'bottom', 300);
    }, 30);


  }

  clear(flexPort = true) {
    this._view = [];
    if (flexPort) this.adjustPortFlex();
  }

  // Clears the port and returns the messages
  transferMessages() {
    let messages = this.messages;
    return messages;
  }

}