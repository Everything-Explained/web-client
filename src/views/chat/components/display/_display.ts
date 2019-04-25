import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { Generator } from '@/libs/generator';

interface IMessage {
  content: string;
  alias: string;
  avatar: string;
  time: string;
}

@Component
export default class Display extends Vue {

  messages: IMessage[] = [];

  created() {
    const gen = new Generator();
    for (let i = 0; i < 30; i++) {
      const avatar = 'https://lh4.googleusercontent.com/-jm9RnjaBMrI/AAAAAAAAAAI/AAAAAAAAAfM/_RhlOKf4IlU/photo.jpg?sz=48';
      this.messages.push({
        content: 'Tempor nulla deserunt veniam exercitation. Exercitation irure minim reprehenderit officia. Adipisicing eiusmod elit nostrud ullamco deserunt id proident non fugiat mollit in esse duis est. Aliquip laborum eiusmod ad ullamco est sunt anim nostrud irure.',
        avatar,
        alias: gen.randomStr(gen.randomRange(4, 12)),
        time: this.$moment(Date.now()).format('h:mm:ss a')
      })
    }
  }




}