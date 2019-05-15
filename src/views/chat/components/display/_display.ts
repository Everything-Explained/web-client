import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { Generator } from '@/libs/generator';
import Message from '../message/Message.vue';
import Lorem from '@/libs/loremipsum';
import { IMessage, MsgScale } from '../message/_message';



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

  @Watch('messages', {immediate: true})
  mergeMessages(messages: IMessage[]) {
    if (messages.length <= 1) return;

    const lastMsg = messages[messages.length - 2];
    const currentMsg = messages[messages.length - 1];

    if (
         currentMsg.type == lastMsg.type
      && currentMsg.alias == lastMsg.alias
    ) {
      if (currentMsg.timeNow - lastMsg.timeNow <= 45000) {
        lastMsg.content.push(messages.pop()!.content[0]);
      }
    }
  }


  @Watch('messages')
  watchMessages(messages: IMessage[]) {
    const el = this.$refs.elMessageContainer as HTMLElement;
    // Vue renders async
    this.$nextTick(() => {
      el.scrollTop = el.scrollHeight;
    })
  }




}