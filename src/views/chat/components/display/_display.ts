import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { Generator } from '@/libs/generator';
import Message from '../message/Message.vue';
import Lorem from '@/libs/loremipsum';

interface IMessage {
  content: string;
  alias: string;
  avatar: string;
  time: string;
}

@Component({
  components: {
    Message
  }
})
export default class Display extends Vue {

  messages: IMessage[] = [];

  created() {
    const gen = new Generator();
    const ipsum = new Lorem();

    for (let i = 0; i < 30; i++) {
      const avatar = 'https://lh4.googleusercontent.com/-jm9RnjaBMrI/AAAAAAAAAAI/AAAAAAAAAfM/_RhlOKf4IlU/photo.jpg?sz=96';
      this.messages.push({
        content: ipsum.generate('words', gen.randomRange(5, 20), 'english'),
        avatar,
        alias: gen.randomStr(gen.randomRange(4, 12)),
        time: new Date(Date.now())
                .toLocaleTimeString(
                  'en-US',
                  { hour: 'numeric', minute: 'numeric', hour12: true }
                )
      })
    }
  }




}