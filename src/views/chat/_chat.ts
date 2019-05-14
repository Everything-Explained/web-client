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
    'Z1YUXTXEK125D8HKGBIC5GWU' // this.$api.rid
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




  private addMsg(
    alias: string,
    content: string,
    type?: MsgType,
    priority?: MsgPriority
  ) {
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