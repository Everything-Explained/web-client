import Chat from '../../_chat';
import { MessageScale } from '../display/_display';



export default class ChatCommands {

  private commands = [
    // DISPLAY SCALE
    {
      alias: ['scale', 'size', 'display'],
      exec: (scale: MessageScale) => {
        if (this.isMessageScale(scale)) {
          return this.scale(scale);
        }
        this.sendClientMsg(
          `Invalid scale ${scale}; Acceptable values are small, normal, large, larger, and largest.`
        )
      }
    },
    // CLEAR MESSAGES
    {
      alias: ['clear', 'cls'],
      exec: () => {
        this.chatView.clearMessages();
      }
    }
  ]




  constructor(private chatView: Chat) {}




  exec(input: string) {
    const txtCmds = input.split(' ');
    const txtCmd = txtCmds[0];
    const txtCmdArg = input.length > 1 ? txtCmds[1] : undefined;

    for (let cmd of this.commands) {
      if (cmd.alias.includes(txtCmd)) {
        return cmd.exec(txtCmdArg as any)
      }
    }

    this.sendClientMsg('Not a valid command.')
  }


  scale(size: MessageScale) {
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