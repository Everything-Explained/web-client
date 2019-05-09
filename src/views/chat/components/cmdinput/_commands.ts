import Chat from '../../_chat';
import { MsgScale, MsgPriorityText } from '../message/_message';
import ChatSocket from '../../_chatsocket';



export default class ChatCommands {

  private commands = [
    // DISPLAY SCALE
    {
      alias: ['scale', 'size', 'display'],
      exec: (scale: MsgScale) => {
        if (this.isMessageScale(scale)) {
          return this.scale(scale);
        }
        this.sendClientMsg(
          '_Invalid scale_; Acceptable values are **small**, **normal**, \
          **large**, **larger**, and **largest**.'
        )
      }
    },
    {
      alias: ['me', 'emote'],
      exec: (content: string) => {
        if (content.length) {
          this.chatView.sendEmote(content);
        }
      }
    },
    // CLEAR MESSAGES
    {
      alias: ['clear', 'cls'],
      exec: () => {
        this.chatView.clearMessages();
      }
    },
    {
      alias: ['connect'],
      exec: () => {
        this.sock.connect();
      }
    },
    {
      alias: ['disconnect'],
      exec: () => {
        this.sock.disconnect();
      }
    }
  ]




  constructor(private readonly chatView: Chat,
              private readonly sock: ChatSocket)
  {}




  exec(input: string) {
    const txtCmds = input.split(' ');
    const txtCmd = txtCmds[0];
    const txtCmdArg = input.length > 1 ? txtCmds[1] : undefined;

    txtCmds.shift()
    const longCmdArg = txtCmds.length >= 2 ? txtCmds.join(' ') : undefined;

    for (const cmd of this.commands) {
      if (cmd.alias.includes(txtCmd)) {
        return cmd.exec(longCmdArg || txtCmdArg as any)
      }
    }

    this.sendClientMsg('Not a valid command.')
  }


  scale(size: MsgScale) {
    this.chatView.displayScale = size;
    this.sendClientMsg(`Display scale set to: (${size})`);
  }





  private isMessageScale(scale: string) {
    return (
      scale == 'small' ||
      scale == 'normal' ||
      scale == 'large' ||
      scale == 'larger' ||
      scale == 'largest'
    )
  }


  private sendClientMsg(content: string) {
    this.chatView.addMessage(
      'Client',
      content,
      'server'
    );
  }

}