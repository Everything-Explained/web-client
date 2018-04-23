

import {bindable, inject} from 'aurelia-framework';
import {MessageScale, MessageType} from '../../../components/chat/message';
import {ClientIO} from '../../../services/clientio';
import {CommanderData, Chat} from '../../../components/chat/chat';
import {Port} from '../../../components/chat/port';
import {ChatCommands} from '../commands';
import {InputHandler} from './input-handler';



enum Keys {

  // Control
  BACKSPACE = 8,
  TAB = 9,
  ENTER = 13,
  SHIFT = 16,
  CTRL = 17,
  ALT = 18,
  ESC = 27,
  DELETE = 46,

  // Direction
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,

  CONSOLE = 192
}




interface ICommand {
  alias: string[];
  execute: (...args: any[]) => void;
  isAdmin: boolean;
}





@inject(Element)
export class ChatCommander {

  @bindable chatData: CommanderData;
  @bindable pickleData: string;

  private _sock: ClientIO;
  private _commands: ChatCommands;
  private _cmdHistory = [];
  private _cmdHistoryPos = null;
  private _chatView: Chat;
  public inputObj: HTMLElement;
  private _inputHandler: InputHandler;


  constructor(private _body: HTMLElement) {
  }

  /** AURELIA: DOMReady */
  attached() {
    this.inputObj = this._body.children[0] as HTMLElement;
    this._inputHandler = new InputHandler(this._body, this._sock, this._chatView, this._commands);

    // Will not focus on input unless delayed
    setTimeout(() => {
      this.inputObj.focus();
      InputHandler.alignCaret(true, this.inputObj);
    }, 30);
  }


  /** AURELIA: On VM binding */
  bind() {
    this._sock = this.chatData.sock;
    this._chatView = this.chatData.chatView;
    this._commands = new ChatCommands(this._sock, this._chatView);
  }
}