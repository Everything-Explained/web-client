import { Vue, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import Chat from '../../_chat';
import ChatCommands from './_commands';
import ChatSocket, { RoomEvent } from '../../_chatsocket';
import { InputHistory } from './_input-history';
import InputHints from './_input-hints';


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

export enum TypingState {
  STARTED = 'typing-started',
  STOPPED = 'typing-stopped',
  PAUSED = 'typing-paused',
}


@Component
export default class Commander extends Vue {

  @Prop({ type: Object })
  readonly chat!: Chat;

  @Prop({ type: Object })
  readonly sock!: ChatSocket;


  get isTyping() {
    return this.chat.typing == TypingState.STARTED;
  }

  get typingState() {
    return this.chat.typing;
  }

  set typingState(val: TypingState) {
    if (TypingState.STOPPED == val) {
      this.typingPaused.cancel();
    }

    this.chat.typing = val;
  }


  readonly typingPaused = this.$debounce((cmdr: this) => {
    cmdr.typingState = TypingState.PAUSED;
  }, 3000)();


  private readonly commands = new ChatCommands(this.chat, this.sock);
  private readonly history = new InputHistory(25);
  private hints!: InputHints;
  private cmdBox!: HTMLElement;





  created() {}


  mounted() {
    this.cmdBox = this.$refs.cmdbox as HTMLElement
    this.hints = new InputHints(this.cmdBox, this.commands.aliases);
  }





  onEnter(ev: MouseEvent) {
    const input =
      this.normalizedInput(String.fromCharCode(ev.which))
    ;

    if (!input.length) return;

    // Requires hitting enter twice to execute hinted command
    if (this.hints.isActive)
      return this.completeHint()
    ;

    this.history.add(input);

    if (input.indexOf('/') == 0) {
      const cmd = input.substr(1);
      this.commands.exec(cmd);
    }
    else {
      this.chat.sendMessage(input);
    }

    this.reset();
  }


  onBackspace(ev: KeyboardEvent) {
    let box = this.cmdBox;
    // Prevent removal of placeholder character
    if (box.innerText.length - 1 == 0) {
      ev.preventDefault();
    }
    this.hints.clear();
  }


  onUp(ev: MouseEvent) {
    this.setInput(ev.target as HTMLElement, this.history.next());
  }


  onDown(ev: MouseEvent) {
    this.setInput(ev.target as HTMLElement, this.history.prev());
  }


  onSuggestion(ev: KeyboardEvent) {
    if (this.isKeyPrevented(ev, Keys.BACKSPACE, Keys.UP, Keys.DOWN)) return;

    const input = this.normalizedInput(ev.key, true);

    if (input.length < 2 || input[0] != '/') return;

    this.hints.show(input.substr(1));
  }


  onTyping(ev: KeyboardEvent) {
    const input = this.normalizedInput();
    const preventKeys = [
      Keys.DOWN,
      Keys.UP,
      Keys.LEFT,
      Keys.RIGHT
    ]

    if (this.isKeyPrevented(ev, ...preventKeys)) return;

    if (!input.length) {
      this.typingState = TypingState.STOPPED;
      return;
    }

    // Ignore typing status when executing commands
    if (input[0] == '/') return;

    if (!this.isTyping) {
      this.typingState = TypingState.STARTED;
    }

    this.typingPaused.exec(this);

  }


  onPaste(ev: ClipboardEvent) {
    const data = ev.clipboardData;
    if (data) {
      document.execCommand(
        'insertText', false, data.getData('text/plain')
      );
    }
    else {
      throw new Error(
        'onPaste()::does not support clipboard data modification'
      );
    }
  }




  private setInput(el: HTMLElement, val: string) {
    if (el.innerText == val) return;
    el.innerText = val;
    this.alignCaret(false, el);
  }


  private normalizedInput(additive?: string, fromNode?: boolean) {
    const input =
      (fromNode)
        ? this.cmdBox.childNodes[0].textContent + (additive || '')
        : this.cmdBox.innerText + (additive || '')
    ;

    return input.replace(/\s/gi, ' ').trim();
  }


  private completeHint() {
    this.hints.fill();
    this.alignCaret(false, this.cmdBox);
  }


  private isKeyPrevented(ev: KeyboardEvent, ...keys: Keys[]) {
    let pos = keys.length;

    while (~--pos) {
      if (ev.which == keys[pos]) return true;
    }

    return false;
  }


  private reset() {
    this.cmdBox.innerHTML = '&#xfeff;';
    this.alignCaret(false, this.cmdBox);
  }


  /**
   * Place the caret at either the beginning (true) or
   * end (false) of a specified text element.
   *
   * @param start True to set the caret at the start.
   * @param el The input element to move the caret in.
   */
  private alignCaret(start: boolean, el: HTMLElement) {
    el.focus();
    if (typeof window.getSelection != 'undefined'
          && typeof document.createRange != 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(start);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
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
  private insertCaret(pos: number, el: HTMLElement|HTMLInputElement) {

    let range = document.createRange()
      , sel = window.getSelection()
    ;

    range.setStart(el.childNodes[0], pos);
    range.collapse(true);
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }




}