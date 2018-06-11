import * as io from 'socket.io-client';
import { IMessage } from '../elements/message/message-data';
import { ITimerExec, Timer } from '../../../shared/services/timing';



interface IEvent {
  [key: string]: {
    ev: ServerEvent|UserEvent;
    exec: (...args: any[]) => void;
    once?: boolean;
  };
}



enum UserEvent {
  MESSAGE       = 'user-message',
  EMOTE         = 'user-emote',
  NOTICE        = 'user-notice',
  LIST          = 'users-online',
  JOINED        = 'user-joined',
  LEFT          = 'user-left',
  TYPINGSTART   = 'user-typing-start',
  TYPINGPAUSED  = 'user-typing-paused',
  TYPINGSTOPPED = 'user-typing-stopped',
  IDLE          = 'user-state-idle',
  BIBLEVERSE    = 'user-get-verse',
}

enum ServerEvent {
  DISCONNECT  = 'server-disconnect',
  AUTHSUCCESS = 'server-auth-success',
  AUTHFAIL    = 'server-auth-fail',
  CONNERROR   = 'connect_error',
  TIMEOUT     = 'session-timeout',
  MESSAGE     = 'server-message',
  PING        = 'server-ping',
}

export enum ChatEvent {
  CONNECTED    = 'connected',
  AUTHED       = 'authed',
  RECONNECTING = 'reconnecting',
  DISCONNECTED = 'disconnected',

  SERVERMSG    = 'servermsg',
  MSG          = 'msg',
  NOTICE       = 'notice',
  EMOTE        = 'emote',
  USERJOINED   = 'userjoined',
  USERLEFT     = 'userleft',
  USERLIST     = 'userlist',
  TYPINGSTART  = 'usertypingstart',
  TYPINGSTOP   = 'usertypingstop',
  TYPINGPAUSED = 'usertypingpaused',
  BIBLEVERSE   = 'bibleverse'
}



export class ChatSock {


  private _sock: SocketIOClient.Socket = null;
  private _latencies: number[] = [];

  private _isConnected  = false;
  private _isIdle       = false;
  private _pingStart    = 0;
  private _messageEvent = '';

  private readonly _sockEventHandlers = {

    // Pre-connection events
    preconn: {
      msg: {
        ev: ServerEvent.MESSAGE,
        exec: (msg) => this._events.servermsg(msg)
      },
      auth_success: {
        ev: ServerEvent.AUTHSUCCESS,
        exec: (data) => this._onAuthSuccess(data)
      },
      auth_fail: {
        ev: ServerEvent.AUTHFAIL,
        exec: (msg) => { console.debug(msg); }
      },
      conn_error: {
        ev: ServerEvent.CONNERROR,
        exec: () => {}
      },
    },

    server: {
      disconnect: {
        ev: ServerEvent.DISCONNECT,
        exec: msg => this._onDisconnected(msg)
      },
      sessionTimeout: {
        ev: ServerEvent.TIMEOUT,
        exec: (data) => this._events.timeout(data)
      },
      ping: {
        ev: ServerEvent.PING,
        exec: () => this._onPing()
      },
    },

    user: {
      message: {
        ev: UserEvent.MESSAGE,
        exec: (msg: IMessage) => this._events.msg(msg)
      },
      notice: {
        ev: UserEvent.NOTICE,
        exec: (msg: string) => this._events.notice(msg)
      },
      emote: {
        ev: UserEvent.EMOTE,
        exec: (msg: string) => this._events.emote(msg)
      },
      getVerse: {
        ev: UserEvent.BIBLEVERSE,
        exec: data => this._events.bibleverse(data)
      },
    },

    implicit: {
      userTypingStart: {
        ev: UserEvent.TYPINGSTART,
        exec: (user: string) => this._events.usertypingstart(user)
      },
      userTypingStopped: {
        ev: UserEvent.TYPINGSTOPPED,
        exec: (user: string) => this._events.usertypingstop(user)
      },
      userTypingPaused: {
        ev: UserEvent.TYPINGPAUSED,
        exec: (user: string) => this._events.usertypingpaused(user)
      },
      userJoined: {
        ev: UserEvent.JOINED,
        exec: (user: string) => this._events.userjoined(user)
      },
      userLeft: {
        ev: UserEvent.LEFT,
        exec: (user: string) => this._events.userleft(user)
      },
      userList: {
        ev: UserEvent.LIST,
        exec: (users: string[]) => this._events.userlist(users)
      },
    }
  };

  private _events = {
    connected:    (msg?: string) => { console.debug('CONNECTED', msg); },
    authed:       (msg?: string) => { console.debug('AUTHED', msg); },
    reconnecting: (msg?: string) => { console.debug('RECONNECTING', msg); },
    disconnected: (msg?: string) => { console.debug('DISCONNECTED', msg); },
    timeout: err => { console.debug('SESSIONTIMEOUT', err); },

    servermsg: (msg: string)   => { console.debug('SERVERMESSAGE', msg); },
    msg:       (msg: IMessage) => { console.debug('MESSAGE', msg); },
    notice:    (msg: string)   => { console.debug('NOTICE', msg); },
    emote:     (msg: string)   => { console.debug('EMOTE', msg); },
    userjoined:       (user)  => { console.debug('USERJOINED', user); },
    userleft:         (user)  => { console.debug('USERLEFT', user); },
    userlist:         (users) => { console.debug('USERLIST', users); },
    usertypingstart:  (user)  => { console.debug('TYPINGSTART', user); },
    usertypingstop:   (user)  => { console.debug('TYPINGSTOP', user); },
    usertypingpaused: (user)  => { console.debug('TYPINGPAUSED', user); },
    bibleverse:       (data)  => { console.debug('USERLIST', data); },
  };


  private readonly _timers: ITimerExec[] = [
    {
      name: 'idle',
      time: 96, // 8 minutes
      interval: false,
      exec: () => {
        this._sock.emit(UserEvent.IDLE);
        this._isIdle = true;
      }
    },
    {
      name: 'ping',
      time: 1, // 5 seconds
      interval: true,
      exec: () => {
        this._pingStart = Date.now();
        this._sock.emit(ServerEvent.PING, this.latency);
      }
    }
  ];



  constructor(private readonly _timer: Timer) {}



  get latency() {
    let latency: number = null;

    if (this._latencies.length) {
      let latencySum = this._latencies.reduce((p, c) => p + c);
      latency = Math.floor(latencySum / this._latencies.length);
    }

    return latency;
  }


  get isIdle() {
    return this._isIdle;
  }



  public connect(reconnect = false) {

    if (reconnect && this._isConnected) {
      this._events.connected('Server is Already Connected.');
      return;
    }

    if (reconnect) {
      this._events.reconnecting('Trying connection to server...');
      this._sock = io({ forceNew: true });
      return;
    }

    this._sock = io({
      forceNew: true,
      reconnection: false
    });

    this._setSockEvents(this._sockEventHandlers.preconn)
      .emit('server-authenticate')
    ;

  }


  private _onAuthSuccess(data: any) {

    if (!this._isConnected) {
      this._isConnected = true;
    }

    this._setSockEvents([
      this._sockEventHandlers.server,
      this._sockEventHandlers.user,
      this._sockEventHandlers.implicit
    ]);

    console.log(this._timer);

    this._timers.forEach(t => this._timer.add(t));
    this._timer.start();

  }


  private _onDisconnected(msg: string) {
    let response =
      msg == 'io server disconnect'
        ? 'Server Closed Connection'
        : 'Server Lost Connection'
    ;

    this._events.disconnected(response);
    this._isConnected = false;
  }


  private _onPing() {
    if (this._latencies.length > 50) {
      this._latencies.shift();
    }
    this._latencies.push(Date.now() - this._pingStart);
    console.debug('PING', this._latencies);
  }


  public disconnect(silent = false) {
    if (!silent)
      this._events.disconnected('Disconnected from Server')
    ;

    this._timer
      .delete('idle')
      .delete('ping')
    ;

    this._sock.close();
  }


  public on(event: ChatEvent, exec: () => void) {
      this._events[event] = exec;
  }


  private _setSockEvents(events: IEvent|IEvent[]) {
    if (Array.isArray(events))
      events.forEach(evs => this._applySockHandlers(evs));
    else
      this._applySockHandlers(events);

    return this._sock;
  }


  private _applySockHandlers(event: IEvent) {
    for (let key in event) {
      let ev = event[key];
      this._sock.on(ev.ev, ev.exec);
    }
  }


  // private _setTyping(user: string, type: 'paused'|'is'|'stopped') {
  //   this._chat.users.find((u, i) => {
  //     if (u.name == user) {
  //       this._chat.users[i].isTyping = `${type}-typing`;
  //       return true;
  //     }
  //     return false;
  //   });
  // }

}