

import {inject} from 'aurelia-framework';
import {MiniModal} from '../../shared/utilities/minimodal';
import { Timer } from '../../shared/services/timing';
import { ChatSock, UserEvent, ServerEvent } from './components/ChatSock';
import { IMessage, MessageSeverity, MessageType, MessageDisplay } from './elements/message/message-data';
import { UserData, IUser } from '../../shared/models/user-data';



export enum Ports { MAIN, TOP, CENTER, BOTTOM };

enum AccessLevel {
  GUEST = 1,
  MEMBER = 2,
  MODERATOR = 4,
  ADMIN = 8
}

type EventLink = {
  ev: UserEvent|ServerEvent;
  func: (...args: any[]) => void;
}


@inject(Element, MiniModal, Timer, UserData)
export class Chat {


  isAttached = false;


  private _sock:       ChatSock;
  private _messages:   MessageDisplay[] = [];
  private _eventLinks: EventLink[] = [
    {
      ev: ServerEvent.AUTHED,
      func: (user) => this.onAuthSuccess(user)
    },
    {
      ev: ServerEvent.SERVERMSG,
      func: (msg) => this.onServerMsg(msg)
    },
    {
      ev: UserEvent.JOINED,
      func: (user) => this.onUserJoined(user)
    }
  ];


  get sock() {
    return this._sock;
  }
  get chat() {
    return this;
  }
  get messages() {
    return this._messages;
  }




  constructor(private body: HTMLElement,
              public modal: MiniModal,
              public timing: Timer,
              private _userData: UserData) {

    this._sock = new ChatSock(timing);

    this._eventLinks.forEach(h => {
      this._sock.on(h.ev, h.func);
    });

  }




  onAuthSuccess(user: IUser) {
    this._userData.currentUser = user;
    this._sock.on(user.room.hash, (msg) => this.onRoomChat(msg));
  }

  onUserJoined(user: IUser) {
    if (this._userData.currentUser.alias == user.alias) return;
    this.addImplicitMsg(`${user.alias} joined the chat...`);
  }

  onRoomChat(msg: IMessage) {
    this.addMessage(new MessageDisplay(msg));
  }

  onServerMsg(msg: string) {
    this.addServerMsg(msg);
  }


  // AURELIA: Activates on DOMReady
  attached() {

    this._sock.connect();

    window.onunload = () => {
      this._sock.disconnect();
    };

    setTimeout(() => {
      this.isAttached = true;
      window.onfocus = () => {
        // this.io.isActive = true;
      };
    }, 30);

  }


  // AURELIA: Activates when leaving page
  deactivate() {
    this.modal.cleanup('VerseModal');
    this._sock.disconnect();
    window.onfocus = null;
  }


  public addMessage(msg: MessageDisplay) {
    this._messages.push(msg);
  }


  public addServerMsg(msg: string, severity = MessageSeverity.INFO) {
    this.addMessage(new MessageDisplay({
      alias: 'Server',
      type: MessageType.SERVER,
      line: msg,
      severity
    }));
  }


  public addImplicitMsg(msg: string) {
    this.addMessage(new MessageDisplay({
      alias: '',
      type: MessageType.IMPLICIT,
      line: msg
    }));
  }


  // showVerse(scriptures: IRawScriptures) {
  //   let s = aggregateVerses(scriptures);
  //   this.scriptures = {
  //     book: s.book,
  //     notation: s.notation,
  //     chapters: s.chapters
  //   };
  //   setTimeout(() => {
  //     this.modal.show('VerseModal');
  //   }, 300);
  // }


}



