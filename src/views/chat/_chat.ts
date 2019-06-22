import { Vue, Component } from 'vue-property-decorator';
import Display from './components/display/Display.vue';
import Userlist from './components/userlist/Userlist.vue';
import Cmdr from './components/commander/Commander.vue';
import Utils from '@/libs/utils';
import ChatSocket, { ClientEvent, RoomEvent, SockClient, RoomSock } from './_chatsocket';
import { MsgPriority, MsgScale, IMessage, MsgType, MsgPriorityText } from './components/message/_message';
import Commander, { TypingState } from './components/commander/_commander';
import ChatUser from './_chatuser';
import Room from './_room';


@Component({
  components: {
    Display,
    Userlist,
    Commander: Cmdr,
  }
})
export default class Chat extends Vue {

  displayScale: MsgScale = 'normal';
  messageStyle: 'normal'|'normal-inline' = 'normal';
  user!: ChatUser;
  users: ChatUser[] = [];


  private messages: IMessage[] = [];
  private room!: Room;

  private readonly sio!: SocketIOClient.Socket;
  private readonly sock = new ChatSocket(
    window.location.origin,
    this.$api.rid,
    this.$timer
  );



  get $this() {
    return this;
  }

  get socket() {
    return this.sock;
  }

  get typing() {
    return this.user.typingState;
  }


  set typing(state: TypingState) {
    if (this.room)
      this.room.sendTypingState(state)
    ;
  }





  created() {
    this.initSockEvents();
    this.setupIdleChecks();
  }

  async beforeRouteEnter(to, from, next) {
    await Utils.loadScript(
      'socketScriptLoaded',
      window.indev
        ? '//cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js'
        : '/socket.io/socket.io.js'
    )
    next();
  }

  beforeRouteLeave(to, from, next) {
    this.sock.disconnect();
    this.tearDown();
    next();
  }





  addNormalMsg(alias: string, content: string) {
    this.addMsg(alias, content, 'normal');
  }


  addEmote(alias: string, content: string) {
    this.addMsg(alias, content, 'implicit-emote');
  }


  addNotice(alias: string, content: string) {
    this.addMsg(alias, content, 'implicit-notice');
  }


  addClientMsg(content: string, priority?: MsgPriority) {
    this.addMsg(
      'Client', content, 'inline-client', priority || 'low'
    );
  }


  addServerMsg(content: string, priority?: MsgPriority) {
    this.addMsg(
      'Server', content, 'inline-server', priority || 'high'
    );
  }


  addImplicitMsg(alias: string, content: string) {
    this.addMsg(alias, content, 'implicit-passive')
  }



  sendMessage(content: string) {
    this.room.sendMessage(content);
  }


  sendEmote(content: string) {
    this.room.sendEmote(content);
  }


  sendNotice(alias: string, content: string) {
    return this.room.sendNotice(alias, content);
  }


  clearMessages() {
    this.messages = [];
  }


  userListNotice(cmdStr: string) {
    const cmdr = this.$refs.commander as Commander;
    cmdr.inputManual(cmdStr);
  }





  private addMsg(
    alias: string,
    content: string,
    type?: MsgType,
    priority?: MsgPriority
  ) {

    const user = this.users.find(u => u.alias == alias)
    const avatar = user ? user.avatar : '';

    // FIXME: Message style logic should not be here. This is a display
    // mechanism and should reside in display.
    type = (!type || type == 'normal') ? this.messageStyle : type;
    this.messages.push(
      {
        alias,
        content: [content],
        avatar,
        type: type || 'normal',
        scale: this.displayScale,
        priority: priority || 'low',
        time: Utils.toNormalTimeString(Date.now()),
        timeNow: Date.now()
      }
    )
  }


  private initSockEvents() {
    this.sock
      .on(
        ClientEvent.SERVERMSG,
        (content, priority) => {
          this.addMsg('Server', content, 'inline-server', priority)
        }
      )
      .on(
        ClientEvent.CLIENTMSG,
        (content, priority) => {
          this.addMsg('Client', content, 'inline-client', priority)
        }
      )
      .on(ClientEvent.AUTHSUCCESS, user => {
        this.user = new ChatUser(user);
      })
      .on(
        ClientEvent.ROOMSETUP,
        (name, tag, clients) => this.onRoomSetup(name, tag, clients)
      )
    ;
  }


  private onRoomSetup(name: string, tag: string, clients: SockClient[]) {
    this.room = new Room(this.sock, this, {
      name,
      tag,
      clients
    });
    this.users = this.room.users;
    this.users.push(this.user); // Add current user to the room
  }


  private setupIdleChecks() {
    window.onfocus = () => {
      this.sock.resetIdle();
    }

    const idle = this.$debounce(() => {
      this.sock.resetIdle();
    }, 500)

    window.onmousemove = () => {
      // Set active immediately if user is idle
      if (this.user && this.user.idle)
        this.sock.resetIdle()
      ;
      idle.exec();
    }
  }


  private tearDown() {
    window.onfocus = null;
    window.onmousemove = null;
    this.$timer.delete('ping');
    this.$timer.delete('idle');
  }





}