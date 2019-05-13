import Vue from 'vue';
import Component from 'vue-class-component';
import Display from './components/display/Display.vue';
import Userlist from './components/userlist/Userlist.vue';
import Commander from './components/cmdinput/Commander.vue';
import Utils from '@/libs/utils';
import ChatSocket, { ClientEvent, RoomEvent, SockClient, RoomSock } from './_chatsocket';
import { MsgPriority, MsgScale, IMessage, MsgType, MsgPriorityText } from './components/message/_message';
import { TypingState } from './components/cmdinput/_commander';
import ChatUser from './_chatuser';
import Room from './_room';


@Component({
  components: {
    Display,
    Userlist,
    Commander,
  }
})
export default class Chat extends Vue {

  displayScale: MsgScale = 'normal';
  user!: ChatUser;

  users: ChatUser[] = [];


  private messages: IMessage[] = [];
  private room!: Room;

  private readonly sio!: SocketIOClient.Socket;
  private readonly sock = new ChatSocket(
    'https://localhost:3003',
    'BKL8YW2OZUNFLC6RJLS7YN7T' || this.$api.rid
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
    this.room.sendMessage(content);
  }


  sendEmote(content: string) {
    this.room.sendEmote(content);
  }


  sendNotice(alias: string, content: string) {
    this.room.sendNotice(alias, content);
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
    this.sock.disconnect();
    next();
  }




  private initSockEvents() {
    this.sock
      .on(
        ClientEvent.SERVERMSG,
        (content, priority) => {
          this.addMessage('Server', content, 'server', priority)
        }
      )
      .on(
        ClientEvent.CLIENTMSG,
        (content, priority) => {
          this.addMessage('Client', content, 'server', priority)
        }
      )
      .on(ClientEvent.AUTHSUCCESS, user => { this.user = user })
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
  }





}