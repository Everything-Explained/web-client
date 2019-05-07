import { Vue, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import Chat from '../../_chat';
import ChatCommands from './_commands';
import ChatSocket, { RoomEvent } from '../../_chatsocket';
import { InputHistory } from './_input-history';


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



@Component
export default class Commander extends Vue {

  @Prop({ type: Object })
  readonly chatView!: Chat;

  @Prop({ type: Object })
  readonly sock!: ChatSocket;


  isTyping = false;


  readonly commands = new ChatCommands(this.chatView, this.sock);
  readonly history = new InputHistory(25);

  readonly typingPaused = this.$debounce((cmdr: this) => {
    cmdr.isTyping = false;
    this.sock.emitRoomEvent(
      this.chatView.roomTag,
      RoomEvent.TYPING,
      'typing-paused'
    )
  }, 3000)();




  created() {
  }

  mounted() {
    const el = this.$refs.cmdbox as HTMLElement;
    el.innerHTML = '<br/>'
  }




  onEnter(ev: MouseEvent) {
    const el = ev.target as HTMLElement;
    const input =
      this.normalizeInput(
        el.innerText + String.fromCharCode(ev.which)
      )
    ;

    // Check for empty input
    if (!input) {
      return this.chatView.addMessage(
        'Client',
        'You need to enter a command or message.',
        'server'
      );
    }

    this.history.add(input);

    // Check for a command
    if (input.indexOf('/') == 0) {
      const cmd = input.substr(1);
      this.commands.exec(cmd);
      return el.innerText = '';
    }

    this.sock.emitRoomEvent(this.chatView.roomTag, RoomEvent.MESSAGE, input);
    el.innerText = '';
  }


  onUp(ev: MouseEvent) {
    this.setInput(ev.target as HTMLElement, this.history.next());
  }


  onDown(ev: MouseEvent) {
    this.setInput(ev.target as HTMLElement, this.history.prev());
  }


  onTyping(ev: MouseEvent) {
    const obj = ev.target as HTMLElement;
    console.debug('onTyping()')

    if (!obj.innerText.length) {
      this.typingPaused.cancel();
      this.isTyping = false;
      this.sock.emitRoomEvent(this.chatView.roomTag, RoomEvent.TYPING, 'typing-stopped')
      return;
    }

    if (!this.isTyping) {
      this.isTyping = true;
      this.sock.emitRoomEvent(this.chatView.roomTag, RoomEvent.TYPING, 'typing-started')
    }

    this.typingPaused.exec(this);

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