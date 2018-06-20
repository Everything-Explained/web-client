import * as io from 'socket.io-client';
import { IMessage } from '../elements/message/message-data';
import { ITimerExec, Timer } from '../../../shared/services/timing';
import { IUser } from '../../../shared/models/user-data';
import { IStats } from '../../../../../../server/models/db_modules/db_stats';



interface IEvent {
  [key: string]: {
    ev: ServerEvent|UserEvent;
    exec: (...args: any[]) => void;
    once?: boolean;
  };
}


type SockEvents = {
  [key: string]: ((...args: any[]) => void)[]
}


type SockEvent = {
  connected:    (msg: string) => void;
  authed:       (msg: string) => void;
  reconnecting: (msg: string) => void;
  disconnected: (msg: string) => void;
  timeout:      (err: any) => void;

  servermsg:        (msg:   string)   => void;
  msg:              (msg:   IMessage) => void;
  notice:           (msg:   string)   => void;
  emote:            (msg:   string)   => void;
  userjoined:       (user:  IUser)    => void;
  userleft:         (user:  IUser)    => void;
  userlist:         (user:  IUser[])  => void;
  usertypingstart:  (user:  IUser)    => void;
  usertypingstop:   (user:  IUser)    => void;
  usertypingpaused: (user:  IUser)    => void;
  bibleverse:       (data:  any)      => void;
  updatestats:      (stats: IStats)   => void;
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
  UPDATESTATS   = 'user-update-stats'
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

  private readonly _sockEventHandlers = {

    // Pre-connection events
    preconn: {
      msg: {
        ev: ServerEvent.MESSAGE,
        exec: (msg: string) => this._execEvent.servermsg(msg)
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
        exec: (err) => this._execEvent.timeout(err)
      },
      ping: {
        ev: ServerEvent.PING,
        exec: () => this._onPing()
      },
    },

    user: {
      message: {
        ev: UserEvent.MESSAGE,
        exec: (msg: IMessage) => this._execEvent.msg(msg)
      },
      notice: {
        ev: UserEvent.NOTICE,
        exec: (msg: string) => this._execEvent.notice(msg)
      },
      emote: {
        ev: UserEvent.EMOTE,
        exec: (msg: string) => this._execEvent.emote(msg)
      },
      getVerse: {
        ev: UserEvent.BIBLEVERSE,
        exec: data => this._execEvent.bibleverse(data)
      },
    },

    implicit: {
      userTypingStart: {
        ev: UserEvent.TYPINGSTART,
        exec: (user: IUser) => this._execEvent.usertypingstart(user)
      },
      userTypingStopped: {
        ev: UserEvent.TYPINGSTOPPED,
        exec: (user: IUser) => this._execEvent.usertypingstop(user)
      },
      userTypingPaused: {
        ev: UserEvent.TYPINGPAUSED,
        exec: (user: IUser) => this._execEvent.usertypingpaused(user)
      },
      userJoined: {
        ev: UserEvent.JOINED,
        exec: (user: IUser) => this._execEvent.userjoined(user)
      },
      userLeft: {
        ev: UserEvent.LEFT,
        exec: (user: IUser) => this._execEvent.userleft(user)
      },
      userList: {
        ev: UserEvent.LIST,
        exec: (users: IUser[]) => this._execEvent.userlist(users)
      },
      updateStats: {
        ev: UserEvent.UPDATESTATS,
        exec: (stats: IStats) => this._execEvent.updatestats(stats)
      }
    }
  };

  private _events: SockEvents = {};

  private _execEvent = {} as SockEvent;


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




  constructor(private readonly _timer: Timer) {}




  public connect(reconnect = false) {

    this._populateEvents();

    if (reconnect && this._isConnected) {
      this._execEvent.connected('Server is Already Connected.');
      return;
    }

    if (reconnect) {
      this._execEvent.reconnecting('Trying connection to server...');
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

    this._execEvent.disconnected(response);
    this._isConnected = false;
  }


  private _onPing() {
    if (this._latencies.length > 50) {
      this._latencies.shift();
    }
    this._latencies.push(Date.now() - this._pingStart);
    // console.debug('PING', this._latencies);
  }


  public disconnect(silent = false) {
    if (!silent)
      this._execEvent.disconnected('Disconnected from Server');
    ;

    this._timer
      .delete('idle')
      .delete('ping')
    ;

    this._sock.close();
  }


  public on(event: ChatEvent, exec: (...args: any[]) => void) {
      this._events[event].push(exec);
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


  private _populateEvents() {

    if (this._events[ChatEvent.AUTHED.toLowerCase()]) return;

    for (let k of Object.keys(ChatEvent)) {
      let n = k.toLowerCase();
      // TODO - Remove Debug code for release
      this._events[n] = [(...args) => { console.debug(n.toUpperCase(), args[0]); }];
      this._execEvent[n] = (...args: any[]) => this._events[n].forEach(f => f(args));
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