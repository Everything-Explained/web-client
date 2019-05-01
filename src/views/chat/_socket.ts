import { MsgPriorityText as MsgPriorityText } from './components/message/_message';

export enum ClientEvent {
  AUTHFAIL = 'auth-fail',
  PING     = 'clt-ping',
  SRVMSG   = 'srv-message',
  IDLE     = 'user-idle',
  ACTIVE   = 'user-active',
  MUTED    = 'user-muted',
}


interface SockEvent {
  ev: string;
  exec: ((...args: any[]) => void)[];
}


export default class ChatSocket {

  private sock: SocketIOClient.Socket;
  private events: SockEvent[] = [];

  constructor() {
    this.sock = io.connect('https://localhost:3003', { forceNew: true });
    this.sock
      .on('connect', () => this.onConnection())
      .on('disconnect', () => this.onDisconnect())
      .on(ClientEvent.AUTHFAIL, (msg) => this.authFailed(msg))
  }

  on(ev: ClientEvent, func: (...args: any[]) => void) {
    const evName = ClientEvent[ev];
    const event = this.events.find(v => v.ev == evName);

    if (event) {
      event.exec.push(func);
    }
    else {
      this.events.push({
        ev: evName,
        exec: [func]
      });
    }
  }




  private onConnection() {
    this.sendServerMessage(
      'Connected Successfully',
      MsgPriorityText.LOW
    );
  }

  private onDisconnect() {
    this.sendServerMessage(
      'Server Disconnected',
      MsgPriorityText.HIGH
    );
  }

  private authFailed(content: string) {
    this.sendServerMessage(content, MsgPriorityText.HIGH);
  }

  private onServerMessage(content: string) {
    this.sendServerMessage(content, MsgPriorityText.LOW);
  }


  private sendServerMessage(content: string, priority: MsgPriorityText) {
    this.emit(
      ClientEvent.SRVMSG,
      content,
      priority
    )
  }


  private emit(ev: ClientEvent, ...args: any[]) {
    const evName = ClientEvent[ev];
    const event = this.events.find(v => v.ev == evName);

    if (event) {
      event.exec.forEach(f => f(...args))
    }
  }



}