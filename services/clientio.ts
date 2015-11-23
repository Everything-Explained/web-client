
import * as io from 'socketio';
import {Message, MessageType, MessageSeverity, IMessage, MessageAvatar} from '../views/chat/message';
import {IScriptures} from '../views/chat/display-verse';
import {Chat} from '../views/chat/chat';


export class ClientIO {

  private _sock = io({ forceNew: true });
  private _serverShuttingDown = false;
  private _connected = false;
  private _chat: Chat;

  private _rooms = {
    main: null
  }


  constructor(private _hasConnected: () => void, private _populate: (msg: Message) => void, chat: Chat) {

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


  sendServerMsg(room: string, msg: string) {
    if (typeof this._rooms[room] !== 'undefined') {
      this._sock.emit(this._rooms[room], { content: msg, type: MessageType.SERVER})
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
    })
  }

  getBibleVerse(scriptures: string) {
    console.log('Sending EMIT');
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
      this._sock = io({forceNew: true});
    }

    this._sock.on('client-connected',    ()    => this.authClient())
    this._sock.on('auth-success',        data  => this.onConnection(data));
    this._sock.on('disconnect',          ()    => this.onLostConnection());
    this._sock.on('connect_error',       ()    => this.onFailedConnection())
    this._sock.on('broadcast',           msg   => this.onBroadcast(msg))
    this._sock.on('user-joined',         user  => this.onUserJoin(user))
    this._sock.on('user-left',           user  => this.onUserDisconnect(user))
    this._sock.on('users-online',        users => this.populateUsers(users))
    this._sock.on('user-is-typing',      user  => this.onUserTyping(user))
    this._sock.on('user-stopped-typing', user  => this.onStoppedTyping(user));
    this._sock.on('user-paused-typing',  user  => this.onUserPausedTyping(user));
    this._sock.on('bible-verse',         data  => this.showBibleVerse(data));
    this._sock.on('private-msg',         data  => this.onPrivateMessage(data))
  }

  showBibleVerse(verses: IScriptures[]) {
    this._chat.showVerse(verses);
  }


  onPrivateMessage(data: any) {
    this._chat.addMessage(`${data.from};${data.text}`, MessageType.INLINE);
  }

  authClient() {
    if (!this._connected) {
      this._hasConnected();
      this._connected = true;
    }
    if (!this._chat.alias) return;
    console.log('calling emit');
    this._sock.emit('auth', this._chat.alias);
  }

  populateUsers(users: string[]) {
    this._chat.userlistActive = true;
    let convertedUsers = [];
    for(let u of users) {
      convertedUsers.push({ name: u, isTyping: ''})
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
    this._chat.addMessage('Server Connection Failed, Try Again Later', MessageType.CLIENT);
    this._sock.disconnect();
  }


  onUserTyping(user: string) {
    let index = _.findIndex(this._chat.users, 'name', user);
    this._chat.users[index].isTyping = 'is-typing';
  }

  onStoppedTyping(user: string) {
    let index = _.findIndex(this._chat.users, 'name', user);
    this._chat.users[index].isTyping = '';
  }

  onUserPausedTyping(user: string) {
    let index = _.findIndex(this._chat.users, 'name', user);
    this._chat.users[index].isTyping = 'paused-typing';
  }

  onUserResumedTyping(user: string) {
    let index = _.findIndex(this._chat.users, 'name', user);
    this._chat.users[index].isTyping = 'is-typing';
  }


  onLostConnection() {
    if (this._serverShuttingDown) return;
    console.error('Server Shutdown or Lost Connection');
    this._chat.ports.main.addMessage(new Message({
      username: 'Server',
      message: 'Server Shutdown or Lost Connection',
      realTimeFixed: Date.now(),
      avatar: MessageAvatar.DEFAULT,
      scale: 'large',
      type: MessageType.SERVER,
      severity: MessageSeverity.ATTENTION
    }))
    this._sock.disconnect();
    this._connected = false;
  }


  disconnect() {
    this._serverShuttingDown = true;
    this._sock.disconnect();
  }


}
