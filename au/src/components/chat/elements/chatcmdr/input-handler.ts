import {ChatIO} from '../../components/chat-io';
import {CommanderData, Chat} from '../../chat';
import {InputHints} from './input-hints';
import {InputHistory} from './input-history';
import {InputSpellcheck} from './input-spellcheck';
import {ChatCommands} from '../../components/commands';
import {MessageType} from '../../components/message';

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


enum TypingMode {
  TYPING,
  PASUED,
  STOPPED
}




export class InputHandler {

  private _inputBox: HTMLElement;
  private _inputHint: InputHints;
  private _inputHistory: InputHistory;
  private _inputSpellcheck: InputSpellcheck;

  private _isTyping            = false;
  private _pausedTyping        = false;
  private _typingTimeout       = null;
  private _typingTimeoutSpeed  = 3500;

  private _isFirefox = !!~navigator.userAgent.indexOf('Firefox');
  private _ffFix = document.createElement('br');


  set typingStatus(val: TypingMode) {

    if (TypingMode.TYPING == val) {
      if (!this._isTyping) {
        this._isTyping = true;
        this._pausedTyping = false;
        this._sock.sendUserIsTyping();
      }
      return;
    }


    if (TypingMode.PASUED == val) {
      if (!this._pausedTyping && this._isTyping) {
        this._pausedTyping = true;
        this._isTyping = false;
        this._sock.sendUserPausedTyping();
      }
      return;
    }


    if (TypingMode.STOPPED == val) {
      if (this._isTyping || this._pausedTyping) {
        this._isTyping = this._pausedTyping = false;
        this._sock.sendUserFinishedTyping();
      }
    }

  }


  constructor(private _commandBox: HTMLElement,
              private _sock: ChatIO,
              private _chatView: Chat,
              private _commands: ChatCommands)
  {
    this._inputBox = this._commandBox.childNodes[0] as HTMLElement;
    if (this._isFirefox) {
      this._inputBox.appendChild(this._ffFix);
    }
    this._inputHint = new InputHints(this._commandBox, this._commands.aliases);
    this._inputHistory = new InputHistory();
    this._inputSpellcheck = new InputSpellcheck();

  }








  onKeyDown(e: KeyboardEvent) {

    let rawInput = this._inputBox.innerText
      , input = this.normalizeInput(rawInput + String.fromCharCode(e.which))
    ;


    if (!input) {

      if (this.onTabOut(e)) return false;

      // Prevent firing functions on empty input
      return true;

    }


    // Reset idle timeout event on socket
    this._sock.isActive = true;


    if (this.onInputRemoval(input, e)) return false;


    if (this.onFillHint(e)) return false;


    if (this.onHistory(e)) return false;


    // Do not allow SPACE character while hint is active
    if (   Keys.SPACE == e.which
        && this._inputHint.isActive)
    {
      return false;
    }


    // Simulate special command for deleting line
    // TODO - Create keyboard shortcuts method eventually
    if (   e.shiftKey
        && (   Keys.DELETE == e.which
            || Keys.BACKSPACE == e.which))
    {
      this.resetInputBox();
    }


    // Prevent Firefox BR removal
    if (Keys.BACKSPACE == e.which && this._isFirefox) {
      if (!!~rawInput[0].indexOf('\n') && rawInput.length - 1 == 0) {
        return false;
      }
    }


    if (this.onTabOut(e)) return false;

    return true;
  }



  onKeyPress(e: KeyboardEvent) {

    // Prevent Firefox firing
    if (Keys.BACKSPACE == e.which) return true;

    let rawInput = this._inputBox.innerText

        // Normalize Input
      , input =
          this.normalizeInput(
            this._inputHint.filterHint(
              rawInput
            ) + String.fromCharCode(e.which)
          )
    ;

    // User should understand their mistake
    if (  Keys.ENTER == e.which
       && !input)
    {
      this.onInvalidInput(input);
      return false;
    }


    // Prevent firing on empty input
    if (!input) return true;


    // Catch commands and activate hints
    if (input[0] == '/') {

      // Fix Firefox BR nonsense
      if (this._isFirefox) {

        if (rawInput[0] == '\n') {
          let br = this._inputBox.childNodes[0];
          this._inputBox.removeChild(br);
        }

        if (Keys.SPACE == e.which && !this._inputHint.isActive) {
          let br = this._inputBox.childNodes[this._inputBox.childNodes.length - 1];
          this._inputBox.removeChild(br);
          this._inputBox.textContent = rawInput.trim() + '\u00a0'; // append NBSP
          InputHandler.alignCaret(false, this._inputBox);
          return false;
        }

      }

      // Strip / char from input
      let word = input.substr(1);

      this._inputHint.show(word);

      if (this.onCommandEntry(word, e)) return false;
    }


    // Default input method
    if (Keys.ENTER == e.which) {
      this._inputHistory.add(input);
      this._sock.sendMsg('main', {
        alias: this._chatView.alias,
        type: MessageType.NORMAL,
        message: input,
        realTimeFixed: Date.now(),
        avatar: this._chatView.avatar
      });

      this.resetInputBox();

      return false;
    }


    return true;
  }



  onKeyUp(e: KeyboardEvent) {

    let input = this.normalizeInput(this._inputBox.textContent)
      , rawInput = this._inputBox.textContent
    ;

    // Setup paused-typing timeout
    clearTimeout(this._typingTimeout);
    this._typingTimeout =
      setTimeout(() => {
        this.typingStatus = TypingMode.PASUED;
      },
      this._typingTimeoutSpeed
    );

    // Track is-typing event
    this.onTyping(input);

    if (!input) return false;

    let newInput = null;
    if (newInput = this._inputSpellcheck.check(rawInput)) {
      this._inputBox.innerHTML = newInput;
      InputHandler.alignCaret(false, this._inputBox);
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
      return;
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


  /** Converts formatted text into plain text */
  onPaste(e: ClipboardEvent) {
    let originalText = this.normalizeInput(this._inputBox.textContent)
      , newText = e.clipboardData.getData('text')
    ;

    this._inputBox.textContent = originalText + newText;
    InputHandler.alignCaret(false, this._inputBox);
  }









  onTyping(input: string) {

    // DO NOT activate typing when user is entering a client command
    if (input[0] == '/' && !~input.indexOf(' ')) {
      return true;
    }

    // Only activate typing when input exists
    if (input.length > 0) {
      this.typingStatus = TypingMode.TYPING;
      return true;
    }

    // Default is no typing
    this.typingStatus = TypingMode.STOPPED;

  }



  /** on BACKSPACE & DELETE: Clean input if applicable */
  onInputRemoval(input: string, e: KeyboardEvent) {
    if (
           Keys.BACKSPACE == e.which
        || Keys.DELETE == e.which
      )
    {
      if (this.cleanInputBox(input)) {
        return true;
      }
    }
    return false;
  }



  /** on ENTER & TAB: handle filling hint */
  onFillHint(e: KeyboardEvent) {

    if (
           Keys.ENTER == e.which
        || Keys.TAB   == e.which
       )
    {
      if (this._inputHint.fillIn()) {
        InputHandler.alignCaret(false, this._inputBox);
        return true;
      }
    }

    return false;

  }



  // on ENTER: execute command if applicable
  onCommandEntry(input: string, e: KeyboardEvent) {

    if (Keys.ENTER == e.which) {

      let alias = input.split(' ', 1)[0]
        , content = input.replace(alias, '').trim()
      ;

      this._inputHistory.add('/' + input);

      if (this._commands.exec(alias, content || null)) {
        this.resetInputBox();
        return true;
      }

      // Prevent partial commands from being sent as a message
      this.onInvalidInput(input);
      return true;

    }
    return false;

  }



  /** Handles empty and invalid command input. */
  onInvalidInput(input: string) {
    let ignorant = `"${input}" is not an internal or external command.`
      , fail = 'You must enter a value to send a message.'
    ;

    this._chatView.addMessage(
      (!input) ? fail : ignorant,
      MessageType.CLIENT
    );

  }



  /** Prevents accidental tab-out */
  onTabOut(e: KeyboardEvent) {
    if (Keys.TAB == e.which) return true;
    return false;
  }


  /** on UP or DOWN: toggle forward through input history */
  onHistory(e: KeyboardEvent) {

    if (   Keys.UP   !== e.which
        && Keys.DOWN !== e.which)
      return false
    ;

    if (Keys.UP == e.which) {
      let val = this._inputHistory.next();
      if (val)
        this._inputBox.innerText = val;
      else
        this.resetInputBox()
      ;
    }

    if (Keys.DOWN == e.which) {
      let val = this._inputHistory.prev();

      if (val)
        this._inputBox.innerText = val;
      else
        this.resetInputBox()
      ;
    }

    InputHandler.alignCaret(false, this._inputBox);
    return true;
  }











  /**
   * Strips and replaces unnecessary characters.
   *
   * @param input The input to normalize.
   */
  normalizeInput(input: string) {

    // Remove invisible character placeholder
    if (input.length == 1) {
      input = input.replace(/\n/, '');
    }

    // Replace &nbsp; chars
    input = input.replace(/\s/gi, ' ');

    return input.trim();
  }



  /**
   * Aligns and cleans programmatically inserted characters
   * and/or elements.
   *
   * @param input The input to test for cleaning.
   */
  cleanInputBox(input: string) {

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
  resetInputBox() {

    // Clearing whole input
    this._inputBox.innerHTML = null;

    // Fix Firefox BR behavior
    if (this._isFirefox) {
      this._inputBox.appendChild(this._ffFix);
    }

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

    let range = document.createRange()
      , sel = window.getSelection()
    ;

    range.setStart(el.childNodes[0], pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

  }


}