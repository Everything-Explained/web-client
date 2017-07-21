

import {Port} from './port';
import {inject} from 'aurelia-framework';
import {Message, MessageType, MessageSeverity} from './message';
import {aggregateVerses, IScriptures, IRawScriptures} from './display-verse';
import {ClientIO} from '../../services/clientio';
import {MiniModal} from '../../helpers/minimodal';
import {Web} from '../../helpers/web';
import {ChatCommander} from './el-chatcmdr/chatcmdr';



export enum Ports { MAIN, TOP, CENTER, BOTTOM };

export interface CommanderData {
  sock: ClientIO;
  chatView: Chat;
}
enum AccessLevel {
  GUEST = 1,
  MEMBER = 2,
  MODERATOR = 4,
  ADMIN = 8
}


@inject(Element, MiniModal)
export class Chat {

  // Socket IO instance
  io: ClientIO;

  // Data to send to the input commander
  data: CommanderData;

  commander: ChatCommander;

  alias: string;
  avatar: string = null;
  id: string;
  accessLevel: number;

  userlistActive = false;
  userDataActive = false;

  messageCounter = 0;

  users = new Array<{name: string; isTyping: string; id: string}>();

  userData = {
    alias: '',
    ping: '103ms',
    idleTime: '1d 2h 3m',
    accessLevel: 'Member',
    id: ''
  };

  scriptures: IScriptures;

  isAttached = false;


  ports = {
    main:   new Port('main', this),
    top:    new Port('top', this),
    center: new Port('center', this),
    bottom: new Port('bottom', this)
  };

  // Are we connected to the socket?
  private _isConnected = false;

  private _activePort: Port;

  private _chatCommander: HTMLElement;


  constructor(private body: HTMLElement, public modal: MiniModal) {

    // Initialize chat service
    // DO NOT MOVE -- Dependancy of bind()
    this.io = new ClientIO((data) => {
      this.alias = data.alias;
      this.avatar = data.picture;
      this.id = data.id;
      this.accessLevel = data.access_level;

      this.addMessage('You are now authenticated, enjoy the chat!', MessageType.SERVER);

    },
    // Executes on every message
    (msg) => {

      // if (msg.type === MessageType.NORMAL && msg.username == this.alias) {
      //   window.performance.mark('mark_message_displayed');
      //   window.performance.measure(
      //     'measure_msg_' + this.messageCounter,
      //     'mark_message',
      //     'mark_message_displayed');

      //   var measures = window.performance.getEntriesByType('measure')
      //     , total = 0;
      //   for(let m of measures) {
      //     total += m.duration;
      //   }
      //   console.log('Average message latency:', total / measures.length)
      // }
      if (msg.type == MessageType.SERVER) {
        this.addMessage(msg.message[0], MessageType.SERVER);
      } else {
        this.ports.main.addMessage(new Message({
          alias: msg.alias,
          message: msg.message,
          realTimeFixed: msg.realTimeFixed,
          avatar: msg.avatar,
          type: msg.type
        }));
      }
    }, this);


  }

  toggleUserData(e: MouseEvent) {
    let obj = e.target as HTMLElement
      , alias = obj.innerText.trim()
    ;

    if (e.button == 2) {
      this.userDataActive = !this.userDataActive;

      // Prevent minor spamming from open/closing the menu
      if (!this.userDataActive) return false;

      // Checking ones own stats does not require server interaction
      if (alias == this.alias) {
        this.userData.ping = this.io.latency;
        this.userData.alias = this.alias;
        this.userData.id = this.id;
        this.userData.accessLevel = this.accessLevel.toString();
        return false;
      }
      // Server interaction for all other users
      else {
        for (let user of this.users) {
          if (user.name == alias) {
            console.log(`Getting ${user.name} data: ${user.id}`);
            this.io.getUserData(user.id);
            this.userData.id = user.id;
          }
        }
      }
      return false;
    }
  }

  noticeUser(e: MouseEvent) {
    let obj = e.target as HTMLElement
      , alias = obj.innerText.trim()
    ;

    for (let user of this.users) {
      if (user.name == alias) {
        this._chatCommander.innerHTML = `/notice ${user.id}&nbsp;`;
        this.commander.placeCaret(false, this.commander.inputObj);
        break;
      }
    }
  }

  denyContextMenu() {
    return false;
  }

  // AURELIA: Activates on data binding
  bind() {

    // DO NOT MOVE -- Dependancy of Chat Commander Element
    this.data =
    {
      sock: this.io,
      chatView: this
    };
  }

  // AURELIA: Activates on DOMReady
  attached() {

    // this.page.userList.show();
    // this.page.userList.setClass('active');
    // this.page.rightTray.setSize({ w: '200px'})

    this.ports.main.portContainer   = document.getElementById('MainWindow');
    this.ports.top.portContainer    = document.getElementById('Pane0');
    this.ports.center.portContainer = document.getElementById('Pane1');
    this.ports.bottom.portContainer = document.getElementById('Pane2');
    this._chatCommander = this.body.querySelector('chat-commander .chat-input-container') as HTMLElement;

    setTimeout(() => {
      this.isAttached = true;
    }, 30);

  }

  // AURELIA: Activates when leaving page
  deactivate() {
    // this.page.rightTray.resetSize();
    // this.page.userList.setClass('');
    // this.page.userList.hide();
    this.modal.cleanup('VerseModal');
    this.io.disconnect(true);
  }


  // TODO: Broadcast to all ports
  setMsgPortFocus(port: Port) {
    this._activePort = port;

    for (let p in this.ports) {
      if (this.ports[p] !== port) {
        (<Port>this.ports[p]).active = false;
      }
    }
    this.addMessage(`${port.name} port is now receiving input.`, MessageType.CLIENT);
    port.active = true;
  }

  addMessage(msg: string, type: MessageType, severity = MessageSeverity.NEUTRAL, forceAlias = '') {

    let alias = '';

    switch (type) {
      case MessageType.NORMAL:
      case MessageType.EMOTE:    alias = this.alias; break;
      case MessageType.CLIENT:   alias = 'Client';   break;
      case MessageType.SERVER:   alias = 'Server';   break;
      case MessageType.IMPLICIT: alias = forceAlias; break;
      case MessageType.INLINE:
        let parts = msg.split(';', 2);
        alias  = parts[0].trim();
        msg       = parts[1];
      break;

      default:
        throw new Error('ADDMESSAGE::Invalid Message Type');
    }

    this.ports.main.addMessage(new Message({
      message: msg,
      alias,
      realTimeFixed: Date.now(),
      avatar: this.avatar || null,
      type,
      severity
    }));
  }

  showVerse(scriptures: IRawScriptures) {
    let s = aggregateVerses(scriptures);
    this.scriptures = {
      book: s.book,
      notation: s.notation,
      chapters: s.chapters
    };
    setTimeout(() => {
      this.modal.show('VerseModal');
    }, 300);
  }


  clearAll() {
    this.ports.bottom.clear();
    this.ports.center.clear();
    this.ports.top.clear();
    this.ports.main.clear(false);
  }

  changeAlias(alias: string) {

    if (!/^[a-zA-Z0-9]+$/.test(alias)) {
      this.addMessage('Invalid Alias, Try Again.', MessageType.CLIENT);
    }

    Web.POST('/internal/alias', {
      fields: {
        from: this.alias,
        to: alias
      }
    }, (err, code, data) => {
      console.log(err, code, data);
      if (err) {
        this.addMessage(`"${alias}" is ` + err.msg, MessageType.SERVER, MessageSeverity.ATTENTION);
        return;
      }
      this.addMessage(`Your alias has been changed to ${alias}`, MessageType.SERVER, MessageSeverity.INFO);
    });
  }

  addUser(user: {alias: string; id: string}) {
    this.users.push({name: user.alias, id: user.id, isTyping: ''});
  }

  removeUser(user: string) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].name === user) {
        this.users.splice(i, 1);
        break;
      }
    }
  }


  transferPorts(from: Port, to: Port) {

    // Only transfer messages when messages are present
    if (!from.messages.length && !to.messages.length)
      return;

    let msgsFrom = from.transferMessages()
      , msgsTo   = to.messages.length ? to.transferMessages() : [];

    if (from.messages.length) from.clear(false);
    if (to.messages.length)   to.clear(false);

    to.messages = msgsFrom;
    from.messages = msgsTo;

    if (from.name !== 'main') from.adjustPortFlex();
    if (to.name   !== 'main')   to.adjustPortFlex();

  }


  reconnect() {
    this.io.connect(true);
  }


}



