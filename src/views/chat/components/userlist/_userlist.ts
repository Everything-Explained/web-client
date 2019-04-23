import { Vue, Provide } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { Generator } from '@/libs/generator';


interface IUser {
  alias: string;
  typing?: boolean;
  typingPaused?: boolean;
  muted?: boolean;
  away?: boolean;
  idle?: boolean;
  nostatus?: boolean;
}

@Component
export default class Userlist extends Vue {

  users: IUser[] = [];


  created() {
    let gen = new Generator();

    for (let i = 0; i < 20; i++) {
      this.users.push({
        alias: gen.randomStr(gen.randomRange(4, 12)),
        idle: this.rngOutOf100() < 40,
        away: this.rngOutOf100() < 50,
        nostatus: this.rngOutOf100() < 15,
        typing: this.rngOutOf100() < 14,
        typingPaused: this.rngOutOf100() < 14
      });
    }
    console.log('Userlist Created');
  }


  rngOutOf100() {
    return Math.floor(Math.random() * 100);
  }
}


