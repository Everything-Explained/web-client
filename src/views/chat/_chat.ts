import Vue from 'vue';
import Component from 'vue-class-component';
import Display from './components/display/Display.vue';
import Userlist from './components/userlist/Userlist.vue';
import Commander from './components/cmdinput/Commander.vue';
import Utils from '@/libs/utils';
import ChatSocket, { ClientEvent, RoomEvent, SockClient, SockRoom } from './_chatsocket';
import { MsgPriority, MsgScale, IMessage, MsgType } from './components/message/_message';
import { TypingState } from './components/cmdinput/_commander';
import ChatUser from './_chatuser';


@Component({
  components: {
    Display,
    Userlist,
    Commander,
  }
})
export default class Chat extends Vue {

  displayScale: MsgScale = 'normal';


  private readonly sio!: SocketIOClient.Socket;
  private readonly sock = new ChatSocket(
    'https://localhost:3003',
    'BKL8YW2OZUNFLC6RJLS7YN7T' || this.$api.rid
  );

  private messages: IMessage[] = [];
  private users: ChatUser[] = [];

  private user!: ChatUser;
  private mainRoom!: SockRoom;



  get thisView() {
    return this;
  }

  get socket() {
    return this.sock;
  }

  set typing(state: TypingState) {
    this.mainRoom.emit(RoomEvent.TYPING, state);
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
      ClientEvent.AUTHSUCCESS,
      (user) => { this.user = user; }
    )
    .on(
      ClientEvent.ROOMSETUP,
      (name, tag, clients) => this.onRoomSetup(name, tag, clients)
    )
  }




  onRoomSetup(name: string, tag: string, clients: SockClient[]) {
    const users =
      clients
        .slice(0)
        .map(client => new ChatUser(client.alias, client.avatar))
    ;
    this.mainRoom = this.sock.createRoomHandle(tag, name);

    this.users = users;
    this.setupRoomEvents();
  }


  setupRoomEvents() {
    this.mainRoom.on(RoomEvent.MESSAGE, (alias, msg, type) => {
      this.addMessage(alias, msg, type);
    })

    this.mainRoom.on(RoomEvent.TYPING, (alias, typing: TypingState) => {
      const user = this.users.find(u => u.alias == alias);
      if (user) {
        user.typingState = typing;
      }
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


  sendMessage(content: string) {
    this.mainRoom.emit(RoomEvent.MESSAGE, content);
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