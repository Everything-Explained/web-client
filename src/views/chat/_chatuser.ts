import { Typing } from './components/userlist/_userlist';



export default class ChatUser {

  alias: string;
  
  idle = false;
  away = false;


  private _isTyping = false;
  private _isTypingPaused = false;


  get isTyping() {
    return this._isTyping;
  }

  get isTypingPaused() {
    return this._isTypingPaused;
  }


  set typingState(val: Typing) {
    if (val == 'typing-started') {
      this._isTyping = true;
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




  constructor(alias: string) {
    this.alias = alias;
  }





}