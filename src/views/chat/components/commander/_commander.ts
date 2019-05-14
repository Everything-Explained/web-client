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


  isTyping = false;


  readonly commands = new ChatCommands(this.chat, this.sock);
  readonly history = new InputHistory(25);

  readonly typingPaused = this.$debounce((cmdr: this) => {
    cmdr.isTyping = false;
    this.chat.typing = TypingState.PAUSED;
  }, 3000)();




  created() {
  }

  mounted() {
    const el = this.$refs.cmdbox as HTMLElement;
  }




  onEnter(ev: MouseEvent) {
    const el = ev.target as HTMLElement;
    const input =
      this.normalizeInput(
        el.innerText + String.fromCharCode(ev.which)
      )
    ;

    if (!input.length) return;

    this.history.add(input);

    if (input.indexOf('/') == 0) {
      const cmd = input.substr(1);
      this.commands.exec(cmd);
      el.innerText = '';
    }
    else {
      this.chat.sendMessage(input);
      el.innerText = '';
    }
  }


  onUp(ev: MouseEvent) {
    this.setInput(ev.target as HTMLElement, this.history.next());
  }


  onDown(ev: MouseEvent) {
    this.setInput(ev.target as HTMLElement, this.history.prev());
  }


  onTyping(ev: KeyboardEvent) {
    const obj = ev.target as HTMLElement;
    const input = this.normalizeInput(obj.innerText);
    const preventKeys = [
      Keys.DOWN,
      Keys.UP,
      Keys.LEFT,
      Keys.RIGHT
    ]

    if (this.isKeyPrevented(ev, ...preventKeys)) return;

    if (!input.length) {
      this.typingPaused.cancel();
      this.isTyping = false;
      this.chat.typing = TypingState.STOPPED;
      return;
    }

    if (!this.isTyping) {
      this.isTyping = true;
      this.chat.typing = TypingState.STARTED;
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


  private normalizeInput(input: string) {
    // Remove invisible character placeholder
    // if (input.length == 1) {
    //   input = input.replace(/\n/, '');
    // }

    input = input.replace(/\s/gi, ' ');
    return input.trim();
  }

  private isKeyPrevented(ev: KeyboardEvent, ...keys: Keys[]) {
    let pos = keys.length;

    while (~--pos) {
      if (ev.which == keys[pos]) return true;
    }

    return false;
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




}