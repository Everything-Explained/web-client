import Chat from '../../_chat';
import { MsgScale, MsgPriorityText } from '../message/_message';
import ChatSocket from '../../_chatsocket';



export default class ChatCommands {

  private commands = [
    // DISPLAY SCALE
    {
      alias: ['scale', 'size', 'display'],
      exec: (args: string) => this.onSetScale(args)
    },
    {
      alias: ['me', 'emote'],
      exec: (args: string) => this.onSendEmote(args)
    },
    {
      alias: ['notice'],
      exec: (arg: string) => this.onSendNotice(arg)
    },
    // CLEAR MESSAGES
    {
      alias: ['clear', 'cls'],
      exec: () => this.onClearScreen()
    },
    {
      alias: ['client'],
      exec: () => {
        this.chat.addClientMsg(
          'this is some long text to test the client message',
          'medium'
        );
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

  get aliases() {
    return this.commands.reduce(
      (a: string[], v) => {
        a.push(...v.alias);
        return a;
      },
      []
    )
  }


  constructor(private readonly chat: Chat,
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

    this.chat.addClientMsg(
      `Sorry, I don't understand that command...`,
      'low'
    );
  }


  scale(size: MsgScale) {
    this.chat.displayScale = size;
    this.chat.addClientMsg(`Display scale set to: (${size})`);
  }




  private onSetScale(args: string) {
    const validArgs = this.getArgs(1, args) as [MsgScale];
    if (validArgs) {
      let [size] = validArgs;
      if (this.isMessageScale(size)) {
        this.chat.displayScale = size;
        this.chat.addClientMsg(`Display scale set to: (${size})`);
        return;
      }
    }

    this.chat.addClientMsg(
      '_Invalid scale_; Acceptable values are **small**, **normal**, \
      **large**, **larger**, and **largest**.'
    );
  }


  private onSendEmote(args: string) {
    if (args && args.length) {
      this.chat.sendEmote(args);
      return;
    }

    this.chat.addClientMsg(
      `_Invalid Argument_; Make sure you didn't enter empty input.`
    )
  }


  private onSendNotice(args: string) {
    const validArgs = this.getArgs(2, args) as [string, string]
    if (validArgs) {
      if (!this.chat.sendNotice(...validArgs)) {
        this.chat.addClientMsg(
          `**"${validArgs[0]}"** is not in this room.`
        );
      }
      return;
    }

    this.chat.addClientMsg(`Make sure you enter a users name to Notice them.`);
  }


  private onClearScreen() {
    this.chat.clearMessages();
  }


  private getArgs(amount: number, str: string) {
    if (!str) return null;

    const args = str.split(' ');
    if (args.length < amount) return null;

    const reqArgs: string[] = [];
    reqArgs.push(...args.slice(0, amount));

    if (args.length > amount)
      reqArgs.push(args.slice(amount - 1).join(' '))
    ;
    return reqArgs;
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

}