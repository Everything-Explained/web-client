import { MsgPriorityText as MsgPriorityText } from './components/message/_message';

export enum ClientEvent {
  AUTHFAIL  = 'auth-fail',
  PING      = 'clt-ping',
  SERVERMSG = 'srv-message',
  CLIENTMSG = 'clt-message',
  IDLE      = 'user-idle',
  ACTIVE    = 'user-active',
  MUTED     = 'user-muted',
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
    console.log(this.events);
    return this;
  }


  connect() {
    this.sock = io(this.url, { forceNew: true, query: { test: 'WP3SVHI2TL' }})
    this.sock
      .on('connect', () => this.onConnection())
      .on('disconnect', () => this.onDisconnect())
      .on(ClientEvent.AUTHFAIL, (msg) => this.authFailed(msg))
    ;
  }


  disconnect() {
    this.forceClosed = true;
    this.sock.close();
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


  private authFailed(content: string) {
    this.sendServerMsg(content, MsgPriorityText.HIGH);
  }


  private onServerMessage(content: string) {
    this.sendServerMsg(content, MsgPriorityText.LOW);
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