
import * as io from 'socket.io-client';
import { ITimerExec, Timer } from '../../../shared/services/timing';
import { IUser } from '../../../shared/models/user-data';



interface IEvent {
  ev: string;
  funcs: ((...args: any[]) => void)[];
}


enum SockEvent {
  MESSAGE       = 'user-message',
  EMOTE         = 'user-emote',
  NOTICE        = 'user-notice',

  LIST          = 'users-online',
  JOINED        = 'user-joined',
  LEFT          = 'user-left',

  TYPINGSTARTED = 'user-typing-started',
  TYPINGPAUSED  = 'user-typing-paused',
  TYPINGSTOPPED = 'user-typing-stopped',

  IDLE          = 'user-state-idle',
  AWAY          = 'user-state-away',

  BIBLEVERSE    = 'user-get-verse',
  UPDATESTATS   = 'user-update-stats',

  TEST          = 'test',


  DISCONNECT  = 'server-disconnect',
  AUTHSUCCESS = 'server-auth-success',
  AUTHFAIL    = 'server-auth-fail',
  CONNERROR   = 'connect_error',
  TIMEOUT     = 'session-timeout',
  PING        = 'server-ping',
}


export enum UserEvent {
  MESSAGE = SockEvent.MESSAGE,
  EMOTE = SockEvent.EMOTE,
  NOTICE = SockEvent.NOTICE,

  LIST = SockEvent.LIST,
  JOINED = SockEvent.JOINED,
  LEFT = SockEvent.LEFT,

  TYPINGSTART = SockEvent.TYPINGSTARTED,
  TYPINGSTOP = SockEvent.TYPINGSTOPPED,
  TYPINGPAUSE = SockEvent.TYPINGPAUSED,

  DISCONNECT = SockEvent.DISCONNECT,
}


export enum ServerEvent {
  SERVERMSG  = 'server-message',
  CONNECTED  = 'sock-connected',
  RECONNECT  = 'sock-reconnecting',
  DISCONNECT = 'sock-disconnected',
  AUTHED     = 'sock-authed',
}




export class ChatSock {


  private _sock: SocketIOClient.Socket = null;
  private _latencies: number[] = [];

  private _isConnected  = false;
  private _isIdle       = false;
  private _pingStart    = 0;

  private readonly _eventLinks = [
    {
      ev: SockEvent.AUTHSUCCESS,
      func: (user) => this._onAuthSuccess(user)
    },
    {
      ev: SockEvent.AUTHFAIL,
      func: (msg) => console.error('AUTHFAIL', msg)
    },
    {
      ev: SockEvent.CONNERROR,
      func: (data) => console.error('CONNERROR', data)
    },
    {
      ev: SockEvent.DISCONNECT,
      func: (msg) => this._onDisconnected(msg)
    },
    {
      ev: SockEvent.PING,
      func: () => this._onPing()
    }
  ];

  private _events: IEvent[] = [];

  private readonly _timers: ITimerExec[] = [
    {
      name: 'idle',
      time: 96, // 8 minutes
      interval: false,
      exec: () => {
        this._sock.emit(SockEvent.IDLE);
        this._isIdle = true;
      }
    },
    {
      name: 'ping',
      time: 3, // 5 seconds
      interval: true,
      exec: () => {
        this._pingStart = Date.now();
        this._sock.emit(SockEvent.PING, this.latency);
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




  constructor(private readonly _timer: Timer) {
    this._populateEvents();
  }




  public connect(reconnect = false) {

    if (reconnect && this._isConnected) {
      this._exec(ServerEvent.CONNECTED, 'Server Already Connected...');
      return;
    }

    if (reconnect) {
      this._exec(ServerEvent.RECONNECT, 'Trying connection to server...');
      this._sock = io({ forceNew: true });
      return;
    }

    this._setupSocket();

    this._sock.emit('server-authenticate');

  }


  private _setupSocket() {
    this._sock = io({
      forceNew: true,
      reconnection: false
    });

    // Setup pre-connection Events
    this._eventLinks.forEach(ev => {
      this._sock.on(ev.ev, ev.func);
    });

    // Setup post-connection Events
    this._events.forEach(ev => {
      this._sock.on(ev.ev, (data) => ev.funcs.forEach(f => f(data)));
    });
  }


  private _onAuthSuccess(user: IUser) {

    if (!this._isConnected) {
      this._isConnected = true;
    }

    this._timers.forEach(t => this._timer.add(t));
    this._timer.start();

    this._exec(ServerEvent.AUTHED, user);

  }


  private _onDisconnected(msg: string) {
    let response =
      msg == 'io server disconnect'
        ? 'Server Closed Connection'
        : 'Server Lost Connection'
    ;

    this._exec(ServerEvent.DISCONNECT, response);
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
      this._exec(ServerEvent.DISCONNECT, 'Disconnected from Server');
    ;

    this._timer
      .delete('idle')
      .delete('ping')
    ;

    this._sock.close();
  }


  public on(event: UserEvent|ServerEvent|string, func: (...args: any[]) => void) {
    let _event = this._events.find(e => e.ev == event);

    if (_event)
      _event.funcs.push(func)
    ;
    else
      this._sock.on(event.toString(), func)
    ;

    return this;
  }


  public send(event: UserEvent, data?: any) {
    this._sock.emit(event.toString(), data || null);
  }


  private _populateEvents() {
    this._pushEvents(SockEvent);
    this._pushEvents(ServerEvent);
  }


  private _pushEvents(events: typeof ServerEvent|typeof SockEvent) {
    for (let k of Object.keys(events)) {
      this._events.push({
        ev: events[k],
        funcs: [(... args) => console.debug(k, args ? args : null)]
      });
    }
  }


  private _exec(event: ServerEvent|UserEvent, data: any) {
    let ev = this._events.find(e => e.ev == event);
    ev.funcs.forEach(f => f(data));
  }

}