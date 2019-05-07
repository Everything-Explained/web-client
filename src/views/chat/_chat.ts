import Vue from 'vue';
import Component from 'vue-class-component';
import Display from './components/display/Display.vue';
import Userlist from './components/userlist/Userlist.vue';
import Commander from './components/cmdinput/Commander.vue';
import Utils from '@/libs/utils';
import ChatSocket, { ClientEvent, RoomEvent, SockClient } from './_chatsocket';
import { MsgPriority, MsgScale, IMessage, MsgType } from './components/message/_message';
import { User, Typing } from './components/userlist/_userlist';


@Component({
  components: {
    Display,
    Userlist,
    Commander,
  }
})
export default class Chat extends Vue {

  displayScale: MsgScale = 'normal';

  // TODO: This is temporary until rooms are available
  // through the display, at which point this will be updated
  // by an event that comes from the display component
  roomTag = '';



  private readonly sio!: SocketIOClient.Socket;
  private readonly sock = new ChatSocket(
    'https://localhost:3003',
    'BKL8YW2OZUNFLC6RJLS7YN7T' || this.$api.rid
  );

  private messages: IMessage[] = [];
  private users: User[] = [];
  private userProto = {
    typing: false,
    typingPaused: false,
    muted: false,
    away: false,
    idle: false,
    nostatus: false
  } as User;



  get thisView() {
    return this;
  }

  get socket() {
    return this.sock;
  }




  created() {
    this.sock.on(ClientEvent.SERVERMSG, (content, priority) => {
      this.addMessage(
        'Server',
        content,
        'server',
        priority
      )
    })
    .on(ClientEvent.CLIENTMSG, (content, priority) => {
      this.addMessage(
        'Client',
        content,
        'server',
        priority
      )
    })
    .on(
      ClientEvent.ROOMSETUP,
      (name, tag, clients) => this.onRoomSetup(name, tag, clients)
    )
  }




  onRoomSetup(name: string, tag: string, clients: SockClient[]) {
    const users =
      clients
        .slice(0)
        .map(client => Object.assign(client, this.userProto) as User)
    ;
    this.roomTag = tag;
    this.users = users;
    this.setupRoomEvents(tag, users);
  }


  setupRoomEvents(tag: string, users: User[]) {
    this.sock.onRoomEvent(tag, RoomEvent.MESSAGE, (alias, msg, type) => {
      this.addMessage(
        alias,
        msg,
        type
      )
    })

    this.sock.onRoomEvent(tag, RoomEvent.TYPING, (alias, typing: Typing) => {
      console.log(typing)
    })
  }


  addMessage(alias: string, content: string, type?: MsgType, priority?: MsgPriority) {
    const avatar = 'https://lh4.googleusercontent.com/-jm9RnjaBMrI/AAAAAAAAAAI/AAAAAAAAAfM/_RhlOKf4IlU/photo.jpg?sz=96'
    this.messages.push(
      {
        alias,
        content,
        avatar,
        type: type || 'normal',
        scale: this.displayScale,
        priority: priority || 'low',
        time: Utils.toNormalTimeString(Date.now())
      }
    )
  }

  clearMessages() {
    this.messages = [];
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
    // this.sio.disconnect();
    next();
  }


}