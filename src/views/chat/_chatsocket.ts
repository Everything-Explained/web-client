import { MsgPriorityText as MsgPriorityText } from './components/message/_message';

export interface SockClient {
  alias: string;
  id?: string;
  avatar: string;
}

export enum ClientEvent {
  AUTHFAIL  = 'auth-fail',
  PING      = 'clt-ping',
  SERVERMSG = 'srv-message',
  CLIENTMSG = 'clt-message',
  ROOMSETUP = 'setup-room',
}

export enum RoomEvent {
  MESSAGE = '-rm-message',
  EMOTE   = '-rm-emote',
  NOTICE  = '-rm-notice',
  TYPING  = '-rm-typing',
  LEAVE   = '-rm-leave',
  LEFT    = '-rm-left',
  JOINED  = '-rm-joined'
}

export enum ServerEvent {
  SHAKE = 'hand-shake',
  PONG = 'srv-pong',
  IDLE = 'state-idle',
  ACTIVE = 'state-active'
}


interface SockEvent {
  ev: string;
  exec: ((...args: any[]) => void)[];
}


export default class ChatSocket {

  private sock!: SocketIOClient.Socket;
  private events: SockEvent[] = [];

  private forceClosed = false;





  constructor(private url: string, private rid: string) {
    this.connect();
  }


  /**
   * Binds a function to an event on a room.
   *
   * @param tag Room identification tag - **via room-setup**
   */
  onRoomEvent(tag: string, type: RoomEvent, func: (...args: any[]) => void) {
    this.sock.on(`${tag}${type}`, (subargs: any[]) => func(...subargs));
  }

  emitRoomEvent(tag: string, type: RoomEvent, ...args: any[]) {
    this.sock.emit(`${tag}${type}`, ...args);
  }


  on(name: ClientEvent, func: (...args: any[]) => void) {
    const event = this.events.find(v => v.ev == name);

    if (event) {
      event.exec.push(func);
    }
    else {
      this.events.push({
        ev: name,
        exec: [func]
      });
    }
    return this;
  }


  connect() {
    this.sock = io(this.url, {
      forceNew: true, reconnection: false, query: { test: 'K2DLYMTVLF' }})
    this.sock
      .on('connect', () => this.onConnection())
      .on('disconnect', () => this.onDisconnect())
      .on('connect_error', err => this.onError(err))
      .on('connect_timeout', err => this.onError(err))
      .on(ClientEvent.ROOMSETUP, (name, tag, clients) => this.onRoomSetup(name, tag, clients))
      .on(ClientEvent.AUTHFAIL, msg => this.authFailed(msg))
    ;
  }


  disconnect() {
    this.forceClosed = true;
    this.sock.close();
  }





  private onRoomSetup(name: string, tag: string, clients: any) {
    console.debug('onRoomSetup()')
    this.emit(ClientEvent.ROOMSETUP, name, tag, clients);
  }


  private onConnection() {
    this.sock.emit(ServerEvent.SHAKE, this.rid)
    this.sendServerMsg(
      'Connected Successfully',
      MsgPriorityText.LOW
    );
  }


  private onDisconnect() {
    if (this.forceClosed) {
      this.forceClosed = false;
      return this.sendClientMsg('Closed Connection');
    }

    return this.sendServerMsg(
      'Closed Connection',
      MsgPriorityText.HIGH
    );
  }


  private onError(error: Error) {
    if (~error.message.indexOf('xhr poll error')) {
      return this.sendClientMsg(
        'Cannot Connect to Server',
        MsgPriorityText.HIGH
      )
    }
    this.sendServerMsg(error.message, MsgPriorityText.HIGH);
  }


  private authFailed(content: string) {
    this.sendServerMsg(content, MsgPriorityText.HIGH);
  }


  private sendServerMsg(content: string, priority: MsgPriorityText) {
    this.emit(
      ClientEvent.SERVERMSG,
      content,
      priority
    )
  }

  private sendClientMsg(content: string, priority = MsgPriorityText.LOW) {
    this.emit(
      ClientEvent.CLIENTMSG,
      content,
      priority
    )
  }


  private emit(name: ClientEvent, ...args: any[]) {
    const event = this.events.find(v => v.ev == name);

    if (event) {
      event.exec.forEach(f => f(...args))
    }
  }



}