import ChatSocket, { RoomSock, RoomEvent, SockClient } from './_chatsocket';
import Chat from './_chat';
import { TypingState } from './components/cmdinput/_commander';
import ChatUser from './_chatuser';

interface RoomConfig {
  name: string;
  tag: string;
  clients: SockClient[];
}



export default class Room {

  private _name: string;
  private roomSock: RoomSock;

  readonly users: ChatUser[] = [];



  get name() {
    return this._name;
  }

  get tag() {
    return this.roomSock.tag;
  }




  constructor(
    private sock: ChatSocket,
    private chat: Chat,
    config: RoomConfig
  ) {
    const users =
      config.clients.map(
        client => new ChatUser(client)
      )
    ;
    this._name = config.name;
    this.roomSock = this.sock.createRoomHandle(config.tag);
    this.users.push(...users);

    this.initEvents();
  }




  sendMessage(content: string) {
    this.send(RoomEvent.MESSAGE, content);
  }


  sendEmote(content: string) {
    this.send(RoomEvent.EMOTE, content);
  }


  sendNotice(aliasTo: string, content: string) {
    const user = this.users.find(u => u.alias == aliasTo);
    if (user) {
      this.send(RoomEvent.NOTICE, user.id, content);
    }
  }


  sendTypingState(state: TypingState) {
    this.send(RoomEvent.TYPING, state);
  }


  leave() {
    this.send(RoomEvent.LEAVE);
  }


  findUser(alias: string) {
    const userIndex = this.users.findIndex(u => u.alias == alias);
    return {
      user: (~userIndex) ? this.users[userIndex] : undefined,
      index: userIndex
    }
  }


  removeUser(alias: string, userIndex?: number) {
    if (typeof userIndex == 'undefined') {
      const {index} = this.findUser(alias);
      userIndex = index;
    }

    if (~userIndex) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }





  private initEvents() {
    this
      .on(RoomEvent.MESSAGE,
        (alias, content) => this.onMessage(alias, content)
      )
      .on(RoomEvent.EMOTE,
        (alias, content) => this.onEmote(alias, content)
      )
      .on(RoomEvent.NOTICE,
        (alias, content) => this.onNotice(alias, content)
      )
      .on(RoomEvent.TYPING,
        (alias, typing) => this.onTyping(alias, typing)
      )
      .on(RoomEvent.JOINED, (alias) => this.onJoin(alias))
      .on(RoomEvent.LEAVE, (alias) => this.onLeave(alias))
    ;
  }


  private send(ev: RoomEvent, ...args: any[]) {
    this.roomSock.emit(ev, ...args);
    return this.roomSock;
  }


  private on(ev: RoomEvent, func: (...args: any[]) => void) {
    this.roomSock.on(ev, func);
    return this.roomSock;
  }


  private onMessage(alias: string, content: string) {
    this.chat.addMessage(alias, content, 'normal');
  }


  private onEmote(alias: string, content: string) {
    this.chat.addMessage(alias, content, 'implicit-emote');
  }


  private onNotice(alias: string, content: string) {
    this.chat.addMessage(alias, content, 'implicit-notice');
  }


  private onJoin(client: SockClient) {
    this.users.push(new ChatUser(client))
    this.chat.addMessage(client.alias, 'has joined the room...', 'implicit-passive')
  }


  private onLeave(alias: string) {
    this.removeUser(alias);
    this.chat.addMessage(alias, 'has left the room...', 'implicit-passive');
  }


  private onTyping(alias: string, typing: TypingState) {
    const {user} = this.findUser(alias);
    if (user) {
      user.typingState = typing;
    }
  }
}