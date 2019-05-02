import { Vue, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import Chat from '../../_chat';
import ChatCommands from './_commands';
import ChatSocket from '../../_socket';


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

  readonly commands = new ChatCommands(this.chatView, this.sock);

  created() {
    console.log(this.$refs);
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

    // Check for a command
    if (input.indexOf('/') == 0) {
      const cmd = input.substr(1);
      this.commands.exec(cmd);
      return el.innerText = '';
    }

    this.chatView.addMessage(
      'Aedaeum',
      input,
      'normal'
    )
    el.innerText = '';
  }





  private normalizeInput(input: string) {
    // Remove invisible character placeholder
    // if (input.length == 1) {
    //   input = input.replace(/\n/, '');
    // }

    input = input.replace(/\s/gi, ' ');
    return input.trim();
  }




}