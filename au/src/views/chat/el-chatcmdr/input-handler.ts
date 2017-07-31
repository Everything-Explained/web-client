import {ClientIO} from '../../../services/clientio';
import {CommanderData, Chat} from '../../../views/chat/chat';
import {InputHints} from './input-hints';

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
  private _inputHint: InputHints;

  private _isTyping            = false;
  private _pausedTyping        = false;
  private _typingTimeout       = null;
  private _typingTimeoutSpeed  = 3500;

  private _ffFix = document.createElement('br');


  constructor(private _commandBox: HTMLElement,
              private _sock: ClientIO,
              private _chatView: Chat)
  {
    this._inputBox = this._commandBox.childNodes[0] as HTMLElement;
    this._inputHint = new InputHints(this._commandBox);
  }



  onKeyDown(e: KeyboardEvent) {

    let obj = <HTMLElement>e.target,
      input = this.normalizeInput(this._inputBox.innerText)
    ;

    // Setup paused-typing debounce
    clearTimeout(this._typingTimeout);
    this._typingTimeout = setTimeout(() => this.onPausedTyping(), this._typingTimeoutSpeed);

    // Track is-typing event
    this.onTyping(input);

    // Reset idle timeout event on socket
    this._sock.isActive = true;


    if (   Keys.BACKSPACE == e.which
        || Keys.DELETE == e.which) {
      this.onBackspace(input);
      this.onDelete(input);
    }

    if (   e.shiftKey
        && (   Keys.DELETE == e.which
            || Keys.BACKSPACE == e.which))
    {
      this.resetInputBox();
    }

    if (Keys.TAB == e.which) {
      if (this.onTab(input)) {
        return false;
      }
    }

    return true;
  }



  onKeyPress(e: KeyboardEvent) {

    let input = (
      this._inputHint.filterHint(this._inputBox.innerText) +
      String.fromCharCode(e.which)
    );

    // Catch commands and activate hints
    if (input[0] == '/') {
      this._inputHint.show(input.substr(1));
    }


    return true;
  }



  onKeyUp(e: KeyboardEvent) {

    let input =  this.normalizeInput(this._inputBox.innerText);

    // Catches entire selection deletion
    if (Keys.BACKSPACE == e.which
        || Keys.DELETE == e.which)
    {
      this.onTyping(input);
    }

    return true;
  }



  // Control caret position when hint active
  onFocus(e: MouseEvent|KeyboardEvent) {
    let obj = e.target as HTMLElement;
    if (this._inputHint.isActive) {
      InputHandler.insertCaret(
        this._inputBox.childNodes[0].textContent.length,
        this._inputBox as HTMLElement
      );
    }
  }



  // Control caret position when hint active
  onMouseDown(e: MouseEvent) {
    let obj = e.target as HTMLElement;

    if (this._inputHint.isActive) {
      InputHandler.insertCaret(
        this._inputBox.childNodes[0].textContent.length,
        this._inputBox as HTMLElement
      );
      return false;
    }
    return true;
  }





  // ////////////////////////////
  // ////////// EVENTS \\\\\\\\\\
  // ----------------------------

  onPaste(e: ClipboardEvent) {
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
    InputHandler.alignCaret(false, this._inputBox);
  }


  onTyping(input: string) {

    // DO NOT activate typing when user is entering a client command
    if (input[0] == '/' && !~input.indexOf(' ')) {
      return true;
    }

    // Only activate typing when input exists
    if (input.length > 0) {
      if (!this._isTyping) {
        this._isTyping = true;
        this._pausedTyping = false;
        this._sock.sendUserIsTyping(this._chatView.alias);
      }
      return true;
    }

    // Catch when user has finished (ENTER) or erased (BACKSPACE|DEL) typing
    if (this._isTyping || this._pausedTyping) {
      this._isTyping = false;
      this._pausedTyping = false;
      this._sock.sendUserFinishedTyping(this._chatView.alias);
      return true;
    }

    return false;

  }


  onPausedTyping() {

    if (!this._pausedTyping && this._isTyping) {
      this._pausedTyping = true;
      this._isTyping = false;
      this._sock.sendUserPausedTyping(this._chatView.alias);
    }

  }


  onTab(input: string) {
    if (this._inputHint.isActive) {
      this._inputHint.fillIn();
      InputHandler.alignCaret(false, this._inputBox);
      return true;
    }
    return false;
  }


  onBackspace(input: string) {
    this.cleanInputBox(input);
  }


  onDelete(input: string) {
    this.cleanInputBox(input);
  }




  normalizeInput(input: string) {

    // Remove invisible character placeholder
    if (input.length == 1) {
      input = input.replace(/\n/, '');
    }

    // Replace &nbsp; chars
    input = input.replace(/\s/gi, ' ');

    return input;
  }



  /**
   * Aligns and cleans programmatically inserted characters
   * and/or elements.
   *
   * @param input The input to test for cleaning.
   */
  cleanInputBox(input: string) {

    this.resetInputBox(input);

    if (this._inputHint.isActive)
      this._inputHint.clear()
    ;
  }



  /**
   * Prevents the removal of an invisible placeholder character
   * necessary for contenteditable divs.
   *
   * @param input The input to test for invisible character
   */
  resetInputBox(input?: string) {
    if (input) {
      if (input.length - 1 != 0) {
        return false;
      }
    }

    this._inputBox.innerHTML = '';
    this._inputBox.appendChild(this._ffFix);

  }



  /**
   * Place the caret at either the beginning (true) or
   * end (false) of a specified text element.
   *
   * @param start True to set the caret at the start.
   * @param el The input element to move the caret in.
   */
  static alignCaret(start: boolean, el: HTMLElement) {
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


  /**
   * Inserts the caret at the specified location of the
   * specified object
   *
   * @param pos The position you want the caret in the object
   */
  static insertCaret(pos: number, el: HTMLElement|HTMLInputElement) {
    console.log('executing');
    let range = document.createRange()
      , sel = window.getSelection()
    ;

    range.setStart(el.childNodes[0], pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

  }


}