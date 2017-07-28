import {ClientIO} from '../../../services/clientio';
import {CommanderData, Chat} from '../../../views/chat/chat';

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
  SPACE = 32,

  // Direction
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,

  CONSOLE = 192
}




export class InputHandler {

  private _inputBox: HTMLElement;

  private _isTyping            = false;
  private _pausedTyping        = false;
  private _typingTimeout       = null;
  private _typingTimeoutSpeed  = 3500;


  constructor(private _commandBox: HTMLElement,
              private _sock: ClientIO,
              private _chatView: Chat)
  {
    this._inputBox = this._commandBox.childNodes[0] as HTMLElement;
  }



  onKeyDown(e: KeyboardEvent) {

    let obj = <HTMLElement>e.target,
      input = this._commandBox.textContent
    ;

    // Setup paused-typing polling
    clearTimeout(this._typingTimeout);
    this._typingTimeout = setTimeout(() => this.setPausedTyping(), this._typingTimeoutSpeed);

    // Reset idle timeout event on socket
    this._sock.isActive = true;


    // if (Keys.BACKSPACE == e.which)
    //   this.onBackspace(input)
    // ;


    // if (Keys.TAB == e.which)
    //   return this.onTab(input)
    // ;

    return true;
  }

  onKeyUp(e: KeyboardEvent) {

    let input =  this.cleanInput(this._commandBox.innerText)
      , inputBox = this._commandBox.childNodes[0] as HTMLElement
    ;

    this.onTypingHandler(input);


    return true;
  }


  cleanInput(input: string) {
    return input.replace(/\s/gi, ' ');
  }


  cleanPastes(e: ClipboardEvent) {
    let originalText = this._inputBox.innerText
      , newText = e.clipboardData.getData('text')
    ;

    // Strip unnecessary new line char
    originalText =
      originalText[0] == '\n'
        ? ''
        : originalText
    ;

    this._inputBox.innerText = originalText + newText;
    this.placeCaret(false, this._inputBox);
  }



  onTypingHandler(input: string) {

    // User is not typing if they're executing a client command
    if (input[0] == '/' && !~input.indexOf(' ')) {
      return true;
    }

    // Input must have a value
    if (input.length > 0) {
      if (!this._isTyping) {
        this._isTyping = true;
        this._pausedTyping = false;
        this._sock.sendUserIsTyping(this._chatView.alias);
      }
      return true;
    }

    if (this._isTyping) {
      this._isTyping = false;
      this._sock.sendUserFinishedTyping(this._chatView.alias);
      return true;
    }

    return false;

  }


  onTab(input: string) {
    // Auto-complete suggestion
    // if (this.activeCompletion) {
    //   console.log('Active Completion TAB CLEAR');
    //   this._clearSuggestion('/' + this.activeCompletion);
    //   this.placeCaret(false, this._body);
    // }
    // return false;
  }


  onBackspace(input: string) {
    // Prevents space buffer from being removed
    if (input.length - 1 == 0) {
      console.log('APPENDING::BACKSPACE');
      this._commandBox.innerHTML = '';
      // this._commandBox.appendChild(this._ffFix);
    }

    // if (this.activeCompletion) {
    //   console.log('Active Completion BACKSPACE CLEAR');
    //   this._clearSuggestion();
    // }
  }


  setPausedTyping() {

    if (!this._pausedTyping && this._isTyping) {
      this._pausedTyping = true;
      this._isTyping = false;
      this._sock.sendUserPausedTyping(this._chatView.alias);
    }

  }


  /**
   * Place the caret at either the beginning (true) or
   * end (false) of a specified text element.
   *
   * @param start True to set the caret at the start.
   * @param el The input element to move the caret in.
   */
  public placeCaret(start: boolean, el: HTMLElement) {
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


}