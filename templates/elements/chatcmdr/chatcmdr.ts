

import {bindable, inject} from 'aurelia-framework';
import {PageElement} from '../../../helpers/page';
import * as io from 'socketio';
import {IMessage, MessageScale, MessageType} from '../../../views/chat/message';
import {ClientIO} from '../../../services/clientio';
import {CommanderData, Chat, Ports} from '../../../views/chat/chat';
import {Port} from '../../../views/chat/port';



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

  public suggestion = '';
  public activeCompletion = null;

  private _sock: ClientIO;
  private _commands: ICommand[];
  private _cmdHistory = [];
  private _cmdHistoryPos = null;
  private _chatView: Chat;
  private _ports: Port[];

  // Are permissions elevated?
  private _isAdmin = true;

  private _suggestionElement = document.createElement('span');

  // This fixes FireFox bad habit of adding its own br tags which
  // screws with the display of the contenteditable div
  private _ffFix = document.createElement('br');

  private _isTyping = false;
  private _pausedTyping = false;
  private _pausedTypingTimeout = 0;
  private _pausedTypingSpeed = 2000;



  constructor(private _obj: HTMLElement) {
    console.log(this._obj);
  }


  bind() {
    this._sock = this.chatData.sock;
    this._chatView = this.chatData.chatView;
    this.initCommands();
  }

  catchContent(e: KeyboardEvent) {

    let input = this._obj.textContent;


    if (input.length > 1 && !this.activeCompletion) {
      this._obj.innerHTML = input.replace(' ', '&nbsp;');
      this._placeCaret(false, this._obj);
    }


  }


  keyHandler(e: KeyboardEvent) {

    let obj = <HTMLElement>e.target,
        input = this._obj.textContent;

    if (this._obj.textContent.length > 0 && this._obj.lastChild === this._ffFix) {
      this._obj.removeChild(this._ffFix);
    }

    // BACKSPACE
    if (Keys.BACKSPACE == e.which) {

      // Prevents space buffer from being removed
      if (input.length - 1 == 0) {
        console.log('APPENDING::BACKSPACE');
        this._obj.innerHTML = '';
        this._obj.appendChild(this._ffFix);
      }

      if (this.activeCompletion) {
        console.log('Active Completion BACKSPACE CLEAR');
        this._clearSuggestion();
      }

    }

    if (Keys.DELETE == e.which || Keys.BACKSPACE == e.which) {

      let selection = window.getSelection().toString();

      if (selection.trim() !== '') {

        if (selection.length == this._obj.textContent.length) {
          console.log('APPENDING::DELETE::', window.getSelection().toString(), '"');
          this._obj.innerHTML = '';
          this._obj.appendChild(this._ffFix);
          return false;
        }

      }

    }


    if (Keys.TAB == e.which) {

      // Auto-complete suggestion
      if (this.activeCompletion) {
        console.log('Active Completion TAB CLEAR');
        this._clearSuggestion('/' + this.activeCompletion);
        this._placeCaret(false, this._obj);
      }
      return false;

    }

    if (Keys.UP == e.which) {
      this._showCommandHistory(true);
      return false;
    }

    if (Keys.DOWN == e.which) {
      this._showCommandHistory(false);
      return false;
    }

    /*if(Keys.RIGHT == e.which) {
      console.log(`"${window.getSelection().toString()}"`)
      return false;
    }*/


    if (this._isTyping) {

      clearTimeout(this._pausedTypingTimeout);
      if (this._pausedTyping) {
        console.log('resumed-typing');
        this._sock.sendUserIsTyping(this._chatView.alias);
        this._pausedTyping = false;
      }

      this._pausedTypingTimeout = setTimeout(() => this.pollPausedTyping(), this._pausedTypingSpeed);

    }

    return true;

  }


  // TODO - Corrective typing logic when space is removed (RARE)
  commandHandler(e: KeyboardEvent) {

    let obj      = <HTMLElement> e.target
      , input    = (this._obj.childNodes[0].textContent + String.fromCharCode(e.which))
      , rawInput = input;

    // Remove NL, EOL, and BOL chars
    input = input.replace(/\s/g, ' ').trim();

    if (e.which === Keys.ENTER) {

      if (this.activeCompletion) {
        this._clearSuggestion('/' + this.activeCompletion);
        this._placeCaret(false, this._obj);
        return false;
      }

      if (rawInput.indexOf(' ') > 0) {
        this._correctSpelling(rawInput, true);
        return false;
      }


      if (input[0] === '/') {

        let inputSplit = input.substr(1).split(' ')
          , usrCmd     = inputSplit[0]
          , msg        = inputSplit.slice(1).join(' ');

        console.info('Executing Command::"' + usrCmd + '"', inputSplit);

        for (let cmd of this._commands) {
          if (cmd.alias.find(c => c === usrCmd)) {
            if (cmd.isAdmin && this._isAdmin) {
              cmd.execute(msg);
              this._addCommmandToHistory(usrCmd);
            }
            else if (!cmd.isAdmin) {
              cmd.execute(msg);
              this._addCommmandToHistory(
                (!msg) ? usrCmd : usrCmd + ' ' + msg
              );
            }
          }
        }

      } else {

        if (!input) return false;

        this._sock.sendMsg('main', {
          username: this.chatData.chatView.alias,
          type: MessageType.NORMAL,
          message: input,
          realTimeFixed: Date.now(),
          avatar: this._chatView.avatar
        });

      }

      // Cleanup input
      this._obj.textContent = '';
      this._obj.appendChild(this._ffFix);
      return false;
    }



    if (input[0] === '/' && input.length > 1) {
      // No commands have spaces
      // TODO - don't block spell correction
      if (/\s/g.test(rawInput)  ||
         input.indexOf(' ') > -1) return true;

      console.log('Executing Suggestion');
      this._showSuggestion(rawInput.substr(1));
    }

    if (this._correctSpelling(rawInput)) {
      return false;
    }


    return true;

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
      this._obj.innerHTML = input.replace(/\s/g, '&nbsp;').trim();
      this._placeCaret(false, this._obj);
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
        this._obj.textContent = `/${this._cmdHistory[0]}`;
      }

      else {
        this._obj.textContent =
            `/${this._cmdHistory[--this._cmdHistoryPos]}`;
      }
    }

    // Next Command
    if (!up) {
      if (this._cmdHistoryPos >= this._cmdHistory.length - 1) {
        this._obj.textContent = '';
        this._cmdHistoryPos = null;
      }

      else {
        this._obj.textContent =
          `/${this._cmdHistory[++this._cmdHistoryPos]}`;
      }
    }

    this._placeCaret(false, this._obj);
  }

  /**
   * Show command suggestions
   *
   * @param input An alias of the command being entered.
   */
  private _showSuggestion(input: string) {
    let suggestion = this._suggestionElement.textContent;

    for (let cmd of this._commands) {
      for (let a of cmd.alias) {
        if (a.indexOf(input.replace(suggestion, '')) == 0) {
          if (!this.activeCompletion) this._obj.appendChild(this._suggestionElement);
          this._suggestionElement.textContent = a.replace(input, '');
          this.activeCompletion = a;
          if (a == input) this._clearSuggestion();
          return;
        }
      }
    }

    console.log('SHOWSUGGESTION::CLEARING');
    this._clearSuggestion();
  }

  /**
   * Reset the suggestion and optionally set the input
   * content.
   *
   * @param input Optional string to set the input content.
   */
  private _clearSuggestion(input?: string) {
    console.warn('Calling Clear Suggestion');
    this.suggestion = this.activeCompletion = null;
    this._obj.removeChild(this._suggestionElement);
    if (typeof input !== 'undefined') {
      this._obj.innerHTML = input;
    }
  }

  /**
   * Place the caret at either the beginning (true) or
   * end (false) of a specified text element.
   *
   * @param start True to set the caret at the start.
   * @param el The input element to move the caret in.
   */
  private _placeCaret(start: boolean, el: HTMLElement) {
      el.focus();
      if (typeof window.getSelection != 'undefined'
              && typeof document.createRange != 'undefined') {
          let range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(start);
          let sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
      } else {
        throw new Error('Browser Too Old for caret Placement');
      }
  }


  /** AURELIA: DOMReady */
  attached() {
    this._obj = <HTMLElement>this._obj.children[0];
    this._obj.appendChild(this._ffFix);

    setTimeout(() => {
      this._obj.focus();
      this._placeCaret(true, this._obj);
    }, 30);

    this.pollTyping();

    this._obj.onpaste = (e: any) => {
      e.preventDefault();

      if (this._obj.textContent.length == 0) this._obj.removeChild(this._ffFix);
      let data = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, data.trim());
    };

    this._suggestionElement.classList.add('suggestion');
  }

  pollTyping() {

    if (this.activeCompletion ||
       (this._obj.textContent.length && this._obj.textContent[0] == '/'))
          return setTimeout(() => this.pollTyping(), 500);

    if (this._obj.textContent.length > 0 && !this._isTyping) {
      this._isTyping = true;
      this._sock.sendUserIsTyping(this._chatView.alias);
      console.log('is-typing');
    }
    else if (this._isTyping && this._obj.textContent.length === 0) {
      this._isTyping = false;
      this._sock.sendUserStoppedTyping(this._chatView.alias);
      console.log('finished-typing');
      clearTimeout(this._pausedTypingTimeout);
    }

    return setTimeout(() => this.pollTyping(), 500);
  }

  pollPausedTyping() {

    if (!this._isTyping) return;

    if (!this._pausedTyping) {
      console.log('paused-typing');
      this._sock.sendUserPausedTyping(this._chatView.alias);
      this._pausedTyping = true;
    }
    this._pausedTypingTimeout = setTimeout(() => this.pollPausedTyping(), this._pausedTypingSpeed);

  }


  // todo - Test for conflicting aliases
  // TODO - Refactor into a proper commands file(s)
  initCommands() {

    this._commands = [
      {
        alias: ['test'],
        isAdmin: false,
        execute: () => {
          this._sock.sendPrivateMsg('hello world', 'Aedaeum');
        }
      },
      {
        alias: ['prv', 'private'],
        isAdmin: false,
        execute: (msg) => {
          let parts = msg.split(' ');
          for (let user of this._chatView.users) {
            if (parts[0] === user.name) {
              let username = parts.splice(0, 1);
              this._sock.sendPrivateMsg(parts.join(' '), username);
              return;
            }
          }
          this._chatView.addMessage(`"${parts[0]}" is not online at this time.`, MessageType.CLIENT);
        }
      },
      {
        /** EMOTE  */
        alias: ['me', 'emote'],
        isAdmin: false,
        execute: (msg) => {
          this._sock.sendEmote('main', {
            username: this._chatView.alias,
            message: msg,
            realTimeFixed: Date.now(),
            scale: 'large',
            avatar: this._chatView.avatar,
            type: MessageType.EMOTE
          });
        }
      },
      {
        /** SERVER */
        alias: ['serv', 'server'],
        isAdmin: false,
        execute: (msg) => {
          this._sock.sendServerMsg('main', msg);
        }
      },
      {
        alias: ['clear'],
        isAdmin: false,
        execute: () => {
          this._chatView.clearAll();
        }
      },
      {
        alias: ['clearm'],
        isAdmin: false,
        execute: () => {
          this._chatView.ports.main.clear();
        }
      },
      {
        alias: ['ttom'],
        isAdmin: false,
        execute: () => {
          this._chatView.transferPorts(
            this._chatView.ports.top,
            this._chatView.ports.main
          );
        }
      },
      {
        alias: ['nick', 'alias'],
        isAdmin: false,
        execute: (msg) => {
          this._chatView.changeAlias(msg);
        }
      },
      {
        /** TRANSFER: Main to Top */
        alias: ['mtot'],
        isAdmin: false,
        execute: () => {
          this._chatView.transferPorts(
            this._chatView.ports.main,
            this._chatView.ports.top
          );
        }
      },
      {
        /** TRANSFER: Main to Center */
        alias: ['mtoc'],
        isAdmin: false,
        execute: () => {
          this._chatView.transferPorts(
            this._chatView.ports.main,
            this._chatView.ports.center
          );
        }
      },
      {
        /** TRANSFER: Main to Bottom */
        alias: ['mtob'],
        isAdmin: false,
        execute: () => {
          this._chatView.transferPorts(
            this._chatView.ports.main,
            this._chatView.ports.bottom
          );
        }
      },
      {
        alias: ['pt'],
        isAdmin: false,
        execute: () => {
          this._chatView.setMsgPortFocus(this._chatView.ports.top);
        }
      },
      {
        alias: ['pm'],
        isAdmin: false,
        execute: () => {
          this._chatView.setMsgPortFocus(this._chatView.ports.main);
        }
      },
      {
        alias: ['pc'],
        isAdmin: false,
        execute: () => {
          this._chatView.setMsgPortFocus(this._chatView.ports.center);
        }
      },
      {
        alias: ['pb'],
        isAdmin: false,
        execute: () => {
          this._chatView.setMsgPortFocus(this._chatView.ports.bottom);
        }
      },
      {
        alias: ['medium'],
        isAdmin: false,
        execute: () => {
          this._chatView.ports.main.messageScale = MessageScale.MEDIUM;
        }
      },
      {
        alias: ['small'],
        isAdmin: false,
        execute: () => {
          this._chatView.ports.main.messageScale = MessageScale.SMALL;
        }
      },
      {
        alias: ['large'],
        isAdmin: false,
        execute: () => {
          this._chatView.ports.main.messageScale = MessageScale.LARGE;
        }
      },
      {
        alias: ['connect'],
        isAdmin: false,
        execute: () => {
          this._chatView.reconnect();
        }
      }
    ];

  }

}
