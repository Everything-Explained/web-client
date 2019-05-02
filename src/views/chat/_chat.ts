import Vue from 'vue';
import Component from 'vue-class-component';
import Display from './components/display/Display.vue';
import Userlist from './components/userlist/Userlist.vue';
import Commander from './components/cmdinput/Commander.vue';
import Utils from '@/libs/utils';
import { IMessage, MessageType, MessageScale } from './components/display/_display';
import ChatSocket, { ClientEvent } from './_socket';
import { MsgPriority } from './components/message/_message';

@Component({
  components: {
    Display,
    Userlist,
    Commander,
  }
})
export default class Chat extends Vue {

  public displayScale: MessageScale = 'normal';


  private sio!: SocketIOClient.Socket;
  private readonly sock = new ChatSocket(
    'https://localhost:3003',
    'BKL8YW2OZUNFLC6RJLS7YN7T' || this.$api.rid
  );

  private messages: IMessage[] = [];


  get thisView() {
    return this;
  }

  get socket() {
    return this.sock;
  }


  created() {
    sock.on(ClientEvent.SRVMSG, (content, priority) => {
      this.addMessage(
        'Server',
        content,
        priority,
        'server'
      )
    })
    // this.sio = io.connect('https://localhost:3003', { forceNew: true });
    // this.sio.on('connect', () => {
    //   console.log('connected successfully');
    //   this.sio.on('room-setup', (name: string, d: string, clients: []) => {
    //     console.log('joined room', name, d, clients);
    //   })
    //   this.sio.emit('hand-shake', this.$api.rid);
    // })
  }


  addMessage(alias: string, content: string, priority?: MsgPriority, type?: MessageType) {
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