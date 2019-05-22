import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { Generator } from '@/libs/generator';
import Message from '../message/Message.vue';
import Lorem from '@/libs/loremipsum';
import { IMessage, MsgScale, MsgType } from '../message/_message';



@Component({
  components: {
    Message
  }
})
export default class Display extends Vue {

  @Prop({ type: Array })
  readonly messages!: IMessage[];

  @Prop({ type: String })
  readonly scale!: MsgScale;

  @Prop({ type: String })
  readonly msgStyle!: 'normal'|'inline-normal';


  private stopScroll = false;
  private el!: HTMLElement;

  created() {
    // const gen = new Generator();
    // const ipsum = new Lorem();

    // for (let i = 0; i < 30; i++) {
    //   const avatar = 'https://lh4.googleusercontent.com/-jm9RnjaBMrI/AAAAAAAAAAI/AAAAAAAAAfM/_RhlOKf4IlU/photo.jpg?sz=96';
    //   this.messages.push({
    //     content: ipsum.generate('words', gen.randomRange(1, 20), 'english'),
    //     avatar,
    //     alias: gen.randomStr(gen.randomRange(4, 12)),
    //     time: new Date(Date.now())
    //             .toLocaleTimeString(
    //               'en-US',
    //               { hour: 'numeric', minute: 'numeric', hour12: true }
    //             )
    //   })
    // }
  }

  mounted() {
    this.el = this.$refs.elMessageContainer as HTMLElement;
  }


  setMsgType(type: MsgType) {
    if (type == 'normal' || type == 'normal-inline') {
      return this.msgStyle;
    }

    return type;
  }


  @Watch('messages', {immediate: true})
  onImmediateMsgChg(messages: IMessage[]) {
    this.keepScrollPos();

    if (messages.length > 1) {
      this.appendMsgOnTime(messages);
    }
  }


  @Watch('messages')
  onMsgChg() {
    this.autoScrollOnMsg();
  }




  private appendMsgOnTime(messages: IMessage[]) {
    const lastMsg = messages[messages.length - 2];
    const currentMsg = messages[messages.length - 1];

    if (
         currentMsg.type == lastMsg.type
      && currentMsg.alias == lastMsg.alias
      && lastMsg.type == 'normal'
    ) {
      if (currentMsg.timeNow - lastMsg.timeNow <= 45000) {
        lastMsg.content.push(messages.pop()!.content[0]);
      }
    }
  }


  /**
   * Prevents auto-scrolling when a user manually adjusts
   * their scroll position.
   */
  private keepScrollPos() {
    if (this.el) {
      const scrollDiff = this.el.scrollHeight - this.el.clientHeight;
      if (scrollDiff - this.el.scrollTop >= 100) {
        this.stopScroll = true;
      }
    }
  }


  private autoScrollOnMsg() {
    // Vue renders async
    this.$nextTick(() => {
      if (!this.stopScroll)
        this.el.scrollTop = this.el.scrollHeight;
      else
        this.stopScroll = false
      ;
    })
  }




}