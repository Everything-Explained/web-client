import { TypingState } from './components/cmdinput/_commander';



export default class ChatUser {

  idle      = false;
  away      = false;
  muted     = false;
  obfuscate = false;


  private _alias: string;
  private _avatar: string;
  private _id: string;

  private _isTyping = false;
  private _isTypingPaused = false;

  get id() {
    return this._id;
  }

  get isTyping() {
    return this._isTyping;
  }

  get isTypingPaused() {
    return this._isTypingPaused;
  }

  get alias() {
    return this._alias;
  }

  get avatar() {
    return this._avatar;
  }


  set typingState(val: TypingState) {
    if (val == 'typing-started') {
      this._isTyping = true;
      this._isTypingPaused = false;
    }
    else if (val == 'typing-stopped') {
      this._isTyping = false;
      this._isTypingPaused = false;
    }
    else if (val == 'typing-paused') {
      this._isTyping = false;
      this._isTypingPaused = true;
    }
  }




  constructor(alias: string, avatar: string, id: string) {
    this._alias = alias;
    this._avatar = avatar;
    this._id = id;
  }





}