
import * as io from 'socket.io-client';
import {Message, MessageType, MessageSeverity, IMessage} from '../views/chat/message';
import {IRawScriptures} from '../views/chat/display-verse';
import {Chat} from '../views/chat/chat';
import {Utils} from '../helpers/utils';


export class ClientIO {

  private _sock = io({
    forceNew: true,
    reconnection: false
  });
  private _connected = false;
  private _chat: Chat;

  private _rooms = {
    main: null
  };


  constructor(private _hasConnected: (data: any) => void, private _populate: (msg: Message) => void, chat: Chat) {

    this._chat = chat;
    this.connect();

  }


  sendMsg(room: string, msg: IMessage) {

    if (typeof this._rooms[room] !== 'undefined') {
      this._sock.emit(this._rooms[room], msg);
    }

    // window.performance.mark('mark_message')

  }


  sendEmote(room: string, msg: IMessage) {
    if (typeof this._rooms[room] !== 'undefined') {
      this._sock.emit(this._rooms[room], msg);
    }
  }


  sendServerMsg(room: string, msg: IMessage) {
    if (typeof this._rooms[room] !== 'undefined') {
      this._sock.emit(this._rooms[room], msg);
    }
  }


  sendUserIsTyping(user: string) {
    this._sock.emit('user-is-typing', user);
  }

  sendUserStoppedTyping(user: string) {
    this._sock.emit('user-stopped-typing', user);
  }

  sendUserPausedTyping(user: string) {
    this._sock.emit('user-paused-typing', user);
  }

  sendPrivateMsg(text: string, to: string) {
    this._sock.emit('private-msg', {
      to,
      text
    });
  }

  getBibleVerse(scriptures: string) {
    this._chat.modal.preload('VerseModal');
    this._sock.emit('find-verse', scriptures);
  }


  join(room: string) {

  }


  leave(room: string) {

  }



  connect(reconnect = false) {

    if (reconnect && this._connected) {
      this._chat.addMessage('Server is Already connected', MessageType.CLIENT);
      return;
    }

    if (reconnect) {
      this._chat.addMessage('Connecting to server...', MessageType.CLIENT);
      this._sock = io({forceNew: true});
    }

    this._sock.once('connect', () => {
      this._chat.addMessage('Connected Successfully', MessageType.SERVER);
    })
    .on('server-msg',   msg => this.onServerMessage(msg))
    .on('auth-success', data => this.completeAuthentication(data))
    .on('auth-fail',    msg => {
      this._chat.addMessage(msg, MessageType.SERVER);
    })
    .on('disconnect',          srv   => this.onDisconnect(srv))
    .on('connect_error',       ()    => this.onFailedConnection())
    .on('user-joined',         user  => this.onUserJoin(user))
    .on('user-left',           user  => this.onUserDisconnect(user))
    .on('users-online',        users => this.populateUsers(users))
    .on('user-is-typing',      user  => this.onUserTyping(user))
    .on('user-stopped-typing', user  => this.onStoppedTyping(user))
    .on('user-paused-typing',  user  => this.onUserPausedTyping(user))
    .on('bible-verse',         data  => this.showBibleVerse(data))
    .emit('authenticate');

  }



  completeAuthentication(data) {

    if (!this._connected) {
      this._hasConnected(data);
      this._connected = true;
    }

    // Setup room hash event
    this._rooms[data.room] = data.hash;

    // Setup message population event
    this._sock.on(this._rooms.main, (msg) => {
      this._populate(msg);
    });
  }


  onServerMessage(out: {msg: string; type?: number}) {
    if (!out.type) {
      this._chat.addMessage(out.msg, MessageType.SERVER);
    }
    else {
      this._chat.addMessage(out.msg, MessageType.SERVER, out.type);
    }
  }



  showBibleVerse(verses: IRawScriptures) {
    this._chat.showVerse(verses);
  }



  onPrivateMessage(data: any) {
    this._chat.addMessage(`${data.from};${data.text}`, MessageType.INLINE);
  }



  populateUsers(users: string[]) {
    this._chat.userlistActive = true;
    let convertedUsers = [];
    for (let u of users) {
      convertedUsers.push({ name: u, isTyping: ''});
    }
    this._chat.users = convertedUsers;
  }


  onBroadcast(msg: string) {
    this._chat.addMessage(msg, MessageType.CLIENT);
  }


  onUserJoin(user: string) {
    if (user === this._chat.alias) return;
    this._chat.addMessage(`${user} has joined the conversation...`, MessageType.IMPLICIT);
    this._chat.addUser(user);
  }


  onUserDisconnect(user: string) {
    this._chat.removeUser(user);
    this._chat.addMessage(`${user} has left the room...`, MessageType.IMPLICIT);
  }


  onConnection(data: {room: string; hash: string}) {
    this._rooms[data.room] = data.hash;

    this._sock.on(this._rooms.main, (msg) => {
      this._populate(msg);
    });
  }

  onFailedConnection() {
    this._chat.addMessage(
      'Server Connection Failed, Try Again Later',
      MessageType.CLIENT,
      MessageSeverity.ATTENTION
    );
    this._sock.disconnect();
  }


  onUserTyping(user: string) {
    let index = Utils.findIndex(this._chat.users, o => {
      return o.name == user;
    });
    this._chat.users[index].isTyping = 'is-typing';
  }
  onStoppedTyping(user: string) {
    let index = Utils.findIndex(this._chat.users, o => {
      return o.name == user;
    });
    this._chat.users[index].isTyping = '';
  }
  onUserPausedTyping(user: string) {
    let index = Utils.findIndex(this._chat.users, o => {
      return o.name == user;
    });
    this._chat.users[index].isTyping = 'paused-typing';
  }
  onUserResumedTyping(user: string) {
    let index = Utils.findIndex(this._chat.users, o => {
      return o.name == user;
    });
    this._chat.users[index].isTyping = 'is-typing';
  }


  onDisconnect(srv: string) {

    let msgObj = {
      alias: 'Server',
      realTimeFixed: Date.now(),
      avatar: null,
      message: '',
      type: MessageType.SERVER,
      severity: MessageSeverity.ATTENTION
    };

    if (srv && srv === 'io server disconnect') {
      msgObj.message = 'Server Shutdown by Admin';
    } else {
      msgObj.message = 'Server Lost Connection';
    }
    this._chat.ports.main.addMessage(new Message(msgObj));
    this.disconnect();
  }


  disconnect() {
    this._connected = false;
    this._sock.close();
  }


}
