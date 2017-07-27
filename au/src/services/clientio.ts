
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

  private _pingInterval = 0;

  private _pingStart = 0;
  private _latencies = [] as number[];
  private _isIdle = false;

  private _idleTime: string;
  private _idleTimeout: NodeJS.Timer;
  private _activeDate = new Date();

  private _forceDisconnect = false;

  public id: string;


  get latency() {

    let l = 0;
    for (let latency of this._latencies)
      l += latency
    ;

    let latency = Math.floor(l / this._latencies.length);

    return latency > 0
      ? `${latency}ms`
      : 'Waiting for Interval'
    ;
  }

  get latencyList() {
    return this._latencies;
  }

  get isIdle() {
    return this._isIdle;
  }

  set isActive(value: boolean) {
    if (value) {
      this._activeDate = new Date();
      clearTimeout(this._idleTimeout);
      this.startIdleTimeout();
    }
    this._isIdle = value;
  }



  constructor(private _hasConnected:     (data: any)      => void,
              private _populateMessages: (msg:  IMessage) => void,
              chat: Chat)
  {
    this._chat = chat;
    this.connect();
  }


  sendMsg(room: string, msg: IMessage) {

    if (typeof this._rooms[room] !== 'undefined') {
      this._sock.emit(this._rooms[room], msg);
    }

  }

  sendNotice(msg: IMessage, id: string) {
    this._sock.emit('notice-msg', msg, id);
  }


  sendEmote(room: string, msg: IMessage) {
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
    .emit('authenticate');

  }



  completeAuthentication(data) {

    if (!this._connected) {
      this._hasConnected(data);
      this.id = data.id;
      this._connected = true;
    }

    // Setup room hash event
    this._rooms[data.room] = data.hash;

    this._sock
      // Setup message population event
      .on(this._rooms.main, msg => this._populateMessages(msg))

      // Setup notice message event
      .on(this.id, msg => this._populateMessages(msg))

      // Setup all room events
      .on('user-joined',         user  => this.onUserJoin(user))
      .on('user-left',           user  => this.onUserDisconnect(user))
      .on('users-online',        users => this.populateUsers(users))
      .on('user-is-typing',      user  => this.onUserTyping(user))
      .on('user-stopped-typing', user  => this.onStoppedTyping(user))
      .on('user-paused-typing',  user  => this.onUserPausedTyping(user))
      .on('bible-verse',         data  => this.showBibleVerse(data))
      .on('session-timeout',     data  => this.onSessionTimeout())
      .on('userPing',            data  => this.onUserPing(data))
      .on('user-data',           data  => this.onUserData(data))
    ;

    // Recieve pong event to capture latency
    this._sock.on('pongcheck', () => {
      if (this._latencies.length + 1 > 50) {
        this._latencies.shift();
      }
      this._latencies.push(Date.now() - this._pingStart);
    });

    // Ping timeout to track latency and idle
    setInterval(() => {
      this._pingStart = Date.now();
      this._sock.emit('pingcheck', this.latency);
    }, 1000 * 7);

    this.startIdleTimeout();

  }

  startIdleTimeout() {
    this._idleTimeout = setTimeout(() => {
      this._isIdle = true;
    }, 1000 * 60); // 1 Minute
  }


  onSessionTimeout() {
    this._chat.addMessage('Session timed out, please navigate to another page.', MessageType.SERVER, MessageSeverity.ATTENTION);
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



  populateUsers(users: {alias: string; id: string}[]) {
    this._chat.userlistActive = true;
    let convertedUsers = [];
    for (let u of users) {
      convertedUsers.push({ name: u.alias, id: u.id, isTyping: ''});
    }
    this._chat.users = convertedUsers;
  }


  onBroadcast(msg: string) {
    this._chat.addMessage(msg, MessageType.CLIENT);
  }


  onUserJoin(user: {alias: string; id: string}) {
    if (user.alias === this._chat.alias) return;
    this._chat.addMessage(` has joined the conversation...`, MessageType.IMPLICIT, null, user.alias);
    this._chat.addUser(user);
  }


  onUserDisconnect(user: string) {
    this._chat.removeUser(user);
    this._chat.addMessage(` has left the room...`, MessageType.IMPLICIT, null, user);
  }


  onConnection(data: {room: string; hash: string}) {
    this._rooms[data.room] = data.hash;

    this._sock.on(this._rooms.main, (msg) => {
      this._populateMessages(msg);
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

  getUserData(clientID: string) {
    this._sock.emit('user-data', clientID);
  }

  onUserData(data) {
    let userData = JSON.parse(data);
    this._chat.userData.accessLevel = userData.accessLevel;
    this._chat.userData.alias = userData.alias;
    this._chat.userData.ping = userData.latency;
  }


  getPing(clientID) {
    this._sock.emit('ping-get', clientID);
  }

  onUserPing(latency: string) {
    this._chat.userData.ping = latency;
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
      msgObj.message = 'Server Closed Connection';
    } else {
      msgObj.message = 'Server Lost Connection';
    }
    if (!this._forceDisconnect)
      this._chat.ports.main.addMessage(new Message(msgObj))
    ;
    clearInterval(this._pingInterval);
    this._forceDisconnect = false;
    this._connected = false;
  }


  disconnect(silent = false) {
    if (!silent) {
      this._chat.addMessage(
        'Disconnected From Server',
        MessageType.CLIENT
      );
    }
    this._forceDisconnect = true;
    this._sock.close();
  }


}
