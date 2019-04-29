import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { Generator } from '@/libs/generator';
import Message from '../message/Message.vue';
import Lorem from '@/libs/loremipsum';

export interface IMessage {
  content: string;
  alias: string;
  avatar: string;
  time: string;
  type: MessageType;
  scale: MessageScale;
}

export type MessageType = 'normal'|'inline'|'inline-avatar'|'server';
export type MessageScale = 'small'|'normal'|'large'|'larger'|'largest';

@Component({
  components: {
    Message
  }
})
export default class Display extends Vue {

  @Prop({ type: Array })
  readonly messages!: IMessage[];

  @Prop({ type: String })
  readonly scale!: MessageScale;

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




}