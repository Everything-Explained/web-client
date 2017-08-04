

import {bindable, inject} from 'aurelia-framework';
import {MessageScale, MessageType} from '../../../views/chat/message';
import {ClientIO} from '../../../services/clientio';
import {CommanderData, Chat} from '../../../views/chat/chat';
import {Port} from '../../../views/chat/port';
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


  commandHandler(e: KeyboardEvent) {

    let obj      = this._body.childNodes[0] as HTMLInputElement
      , input    = (this._body.innerText + String.fromCharCode(e.which))
      , rawInput = input
    ;

    // if (e.which === Keys.ENTER) {

    //   if (this.activeCompletion) {
    //     this._clearSuggestion('/' + this.activeCompletion);
    //     this.placeCaret(false, this._body);
    //     return false;
    //   }


      // if (input[0] === '/') {

      //   let inputSplit = input.substr(1).split(' ')
      //     , usrCmd     = inputSplit[0]
      //     , msg        = inputSplit.slice(1).join(' ')
      //   ;

      //   console.info('Executing Command::"' + usrCmd + '"', inputSplit);
      //   if (this._commands.exec(usrCmd, msg)) {
      //     this._addCommmandToHistory(
      //       (!msg) ? usrCmd : usrCmd + ' ' + msg
      //     );
      //   }

      // } else {

      //   if (!input) return false;

      //   this._sock.sendMsg('main', {
      //     alias: this.chatData.chatView.alias,
      //     type: MessageType.NORMAL,
      //     message: input,
      //     realTimeFixed: Date.now(),
      //     avatar: this._chatView.avatar
      //   });

      // }

      // Cleanup input
    //   this._body.textContent = '';
    //   this._body.appendChild(this._ffFix);
    //   return false;
    // }



    // if (input[0] === '/' && input.length > 1) {
      // No commands have spaces
      // TODO - don't block spell correction
    //   if (/\s/g.test(rawInput)  ||
    //      input.indexOf(' ') > -1) return true;

    //   console.log('Executing Suggestion');
    //   this._showSuggestion(rawInput.substr(1));
    // }

    // if (this._correctSpelling(rawInput)) {
    //   return false;
    // }

  }



  private _correctSpelling(input: string, trim = false) {

    let storeInput = input
      , res = null;

    input =
      input
        .replace(/\steh|\shte/g, ' the')
        .replace(/\sint he|\sint the/g, ' in the')
        .replace(/^int he|int the/, 'in the')
        .replace(/\sadn/g, ' and')
        .replace(/\ssays ometh/g, ' say someth')
        .replace(/\syoru/g, ' your')
        .replace(/\shwo/g, ' how')
        .replace(/hwo\s/g, 'how ')
        .replace(/^hre\s/, 'here ')
        .replace(/\shre\s/g, ' here ')
        .replace(/\si\s/g, ' I ')
        .replace(/\si\'ll/g, ' I\'ll')
        .replace(/\si\'d/g, ' I\'d')
        .replace(/\si\'ve/g, ' I\'ve')
        .replace(/\su\s/g, ' you ')
        .replace(/\sr\s/g, ' are ')
        .replace(/\sheres\s/g, ' here\'s ')
        .replace(/^heres\s/g, 'here\'s ')
        .replace(/\sdont\s/g, ' don\'t ')
        .replace(/^dont\s/g, 'don\'t ')
        .replace(/\stheres\s/g, ' there\'s ')
        .replace(/^theres\s/g, 'there\'s ')
        .replace(/^ones\s/, 'one\'s ')
        .replace(/\sones\s/g, ' one\'s ')
        .replace(/\sgod\s/g, ' God ');

    // Capitalize first letter
    input =
      (/^[a-z].*\s/.test(input)) ?
        input[0].toUpperCase() + input.substr(1) :
        input;

    // Capitalize first letter of a sentence after a period
    let matches = /\.\s[a-z]/.exec(input);
    if (matches) {
      input = input.replace(matches[0], matches[0].substr(0, 2) + matches[0].substr(2).toUpperCase());
    }

    if (input != storeInput) {
      if (trim) input = input.trim().replace(/&nbsp;$/, '');

      console.log(`"${input.replace(' ', '&nbsp;')}"`);
      this._body.innerHTML = input.replace(/\s/g, '&nbsp;').trim();
      InputHandler.alignCaret(false, this._body);
    }

    return input != storeInput;
  }


  /**
   * Add a command to the command history array.
   *
   * @param cmd The command to add.
   */
  private _addCommmandToHistory(cmd: string) {

    // Limit command history to 20 commands
    if (this._cmdHistory.length + 1 > 20) {
      this._cmdHistory.shift();
    }

    if (this._cmdHistory[this._cmdHistory.length - 1] === cmd) {
      return;
    }

    this._cmdHistory.push(cmd);
    this._cmdHistoryPos = null;
  }


  /**
   * Cycle next or previous command stored
   * in the command history array.
   *
   * @param up Set to True to cycle to the previous commmand.
   */
  //
  // TODO - When a command is cycled and executed,
  //        the position must not decrement (FUTURE)
  //
  private _showCommandHistory(up: boolean) {

    if (!this._cmdHistory.length) return;

    this._cmdHistoryPos =
      (this._cmdHistoryPos == null) ?
        this._cmdHistory.length : this._cmdHistoryPos;

    // Previous Command
    if (up) {

      if (this._cmdHistoryPos == 0) {
        this._body.textContent = `/${this._cmdHistory[0]}`;
      }

      else {
        this._body.textContent =
            `/${this._cmdHistory[--this._cmdHistoryPos]}`;
      }
    }

    // Next Command
    if (!up) {
      if (this._cmdHistoryPos >= this._cmdHistory.length - 1) {
        this._body.textContent = '';
        this._cmdHistoryPos = null;
      }

      else {
        this._body.textContent =
          `/${this._cmdHistory[++this._cmdHistoryPos]}`;
      }
    }

    InputHandler.alignCaret(false, this._body);
  }


}
