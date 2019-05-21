import ChatSocket, { RoomSock, RoomEvent, SockClient, ClientEvent } from './_chatsocket';
import Chat from './_chat';
import { TypingState } from './components/commander/_commander';
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


  /**
   * Try's to send a notice, but if the user does not
   * exist, returns false.
   */
  sendNotice(aliasTo: string, content: string) {
    const {user} = this.findUser(aliasTo)
    if (user) {
      this.send(RoomEvent.NOTICE, user.id, content);
      return true;
    }
    return false;
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

    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }





  private initEvents() {

    this.sock
      .on(ClientEvent.IDLE, alias => this.onIdle(alias))
      .on(ClientEvent.ACTIVE, alias => this.onActive(alias))
    ;

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


  /**
   * Emits an event over this room-specific channel.
   *
   * @param ev Room event to handle
   * @param args Any arguments to send on the event
   */
  private send(ev: RoomEvent, ...args: any[]) {
    this.roomSock.emit(ev, ...args);
    return this.roomSock;
  }


  /**
   * Add a handler to this room-specific channel event
   */
  private on(ev: RoomEvent, func: (...args: any[]) => void) {
    this.roomSock.on(ev, func);
    return this.roomSock;
  }


  private onIdle(alias: string) {
    const {user} = this.findUser(alias);
    if (user) user.idle = true;
  }


  private onActive(alias: string) {
    const {user} = this.findUser(alias);
    if (user) user.idle = false;
  }


  private onMessage(alias: string, content: string) {
    this.chat.addNormalMsg(alias, content);
  }


  private onEmote(alias: string, content: string) {
    this.chat.addEmote(alias, content);
  }


  private onNotice(alias: string, content: string) {
    this.chat.addNotice(alias, content);
  }


  private onJoin(client: SockClient) {
    this.users.push(new ChatUser(client))
    this.chat.addImplicitMsg(client.alias, 'has joined the room...')
  }


  private onLeave(alias: string) {
    if (this.removeUser(alias)) {
      this.chat.addImplicitMsg(alias, 'has left the room...');
    }
    else {
      this.chat.addClientMsg(
        'Could not remove user',
        'medium'
      )
    }
  }


  private onTyping(alias: string, typing: TypingState) {
    const {user} = this.findUser(alias);
    if (user) {
      user.typingState = typing;
    }
  }
}