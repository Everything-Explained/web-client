import {ChatIO} from './chat-io';
import {ChatCommander} from '../elements/chatcmdr/chatcmdr';
import {MessageScale, MessageType} from '../components/message';
import {Chat} from '../chat';

interface ICommand {
  alias: string[];
  execute: (...args: any[]) => void;
  isAdmin: boolean;
}


export class ChatCommands {

  public commands = {} as {[key: string]: (...args: any[]) => void};
  public aliases = [] as string[];


  constructor(private _sock: ChatIO, private _chatView: Chat) {

    this.commands['me|emote']   = (args) => this._emote(args[0]);
    this.commands['notice']     = (args) => this._notice(args[0]);
    this.commands['ping']       = ()     => this._ping();
    this.commands['disconnect'] = ()     => this._disconnect();
    this.commands['connect']    = ()     => this._connect();
    this.commands['nick|alias'] = (args) => this._chatView.changeAlias(args[0]);
    this.commands['clear']      = ()     => this._chatView.clearAll();
    this.commands['small']      = ()     => this._setPortScale('small');
    this.commands['medium']     = ()     => this._setPortScale('medium');
    this.commands['large']      = ()     => this._setPortScale('large');

    this._populateAliases();

  }

  private _populateAliases() {
    for (let cmd in this.commands) {
      if (~cmd.indexOf('|')) {
        this.aliases =  this.aliases.concat(cmd.split('|'));
        continue;
      }

      this.aliases.push(cmd);
    }
  }


  public exec(alias: string, ...args: string[]) {

    for (let key in this.commands) {
      if (~key.indexOf('|')) {
        let aliases = key.split('|');
        for (let a of aliases) {
          if (a == alias) {
            this.commands[key](args ? args : null);
            return true;
          }
        }
      }

      if (key == alias) {
        this.commands[key](args ? args : null);
        return true;
      }
    }
    return false;
  }


  private _notice(msg: string) {
    let argArray = msg.split(' ')
      , id = argArray.shift().toString()
      , message = argArray.join(' ')
    ;

    this._sock.sendNotice({
      alias: this._chatView.alias,
      message,
      realTimeFixed: Date.now(),
      avatar: this._chatView.avatar,
      type: MessageType.INLINE
    }, id);
  }


  private _emote(message: string) {

    if (!message || !message.trim().length) return;

    this._sock.sendEmote('main', {
      alias: this._chatView.alias,
      message,
      realTimeFixed: Date.now(),
      scale: 'large',
      avatar: this._chatView.avatar,
      type: MessageType.EMOTE
    });

  }

  private _setPortScale(size: string) {
    let scale = null as MessageScale;

    switch (size) {
      case 'small': scale = MessageScale.SMALL; break;
      case 'medium': scale = MessageScale.MEDIUM; break;
      case 'large': scale = MessageScale.LARGE; break;
    }

    this._chatView.ports.main.messageScale = scale;
  }

  private _ping() {
    this._chatView.addMessage(`Ping: ${this._sock.latency}`, MessageType.CLIENT);
    console.log(this._sock.latencyList);
  }

  private _connect() {
    this._chatView.reconnect();
  }

  private _disconnect() {
    this._sock.disconnect();
  }


}