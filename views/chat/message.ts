


export enum MessageType {
  NORMAL,
  EMOTE,
  SERVER,
  CLIENT,
  INLINE,
  IMPLICIT,
  AELO
}

export enum MessageSeverity {
  NEUTRAL,
  INFO,
  ATTENTION
}

export enum MessageScale {
  LARGE,
  MEDIUM,
  SMALL
}

export interface IMessage {
  username?: string;
  message: string;
  realTimeFixed?: number;
  scale?: string;
  severity?: MessageSeverity;
  type: MessageType;
  avatar?: string;
}

export class Message {

  username: string;
  message: string;
  realTimeFixed: number;
  scale: string;
  severity: string;
  type: MessageType;
  avatar: string;

  /** A message object ready for the message view */
  constructor(ops: IMessage) {

    this.username = ops.username;
    this.message = ops.message;
    this.scale = ops.scale === undefined ? 'large' : ops.scale;
    this.type = ops.type;
    this.avatar = ops.avatar;
    this.realTimeFixed = ops.realTimeFixed;
    this.severity = ops.severity == undefined ? 'info' : this.getMessageSeverity(ops.severity);

  }


  get messageType() {

    switch (this.type) {
      case MessageType.EMOTE: return 'emote';

      case MessageType.NORMAL:
      case null:
        return 'normal';

      case MessageType.SERVER: return 'server';
      case MessageType.AELO: return 'aelo';
      case MessageType.CLIENT: return 'client';
      case MessageType.INLINE: return 'inline';
      case MessageType.IMPLICIT: return 'implicit';

      default:
        throw new Error(`There is no "${this.type}" message type`);
    }

  }

  getMessageSeverity(severity: MessageSeverity) {
    switch (severity) {

      case MessageSeverity.INFO: return 'info';
      case MessageSeverity.NEUTRAL: return 'normal';
      case MessageSeverity.ATTENTION: return 'attention';
      default:
        throw new Error(severity + ' is an Invalid Message Severity');

    }
  }


  setTypeClass(el: HTMLElement) {

    switch (this.type) {

      case MessageType.NORMAL:
        el.classList.add('animated');
        el.classList.add('flipInX');
        el.classList.add('delay5');
        break;


      case MessageType.SERVER:
      case MessageType.CLIENT:
      case MessageType.EMOTE:
        el.classList.add('animated');
        el.classList.add('zoomIn');
        el.classList.add('delay3');
        break;

    }


  }


}