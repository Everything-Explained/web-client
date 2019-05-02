import { Vue, Prop } from 'vue-property-decorator';
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

  @Prop({ default: 'normal', type: String })
  readonly scale!: 'small'|'large'|'larger'|'largest';

  users: IUser[] = [];

  get scaleClass() {
    return `scale-${this.scale}`;
  }

  created() {
    let gen = new Generator();

    for (let i = 0; i < 20; i++) {
      this.users.push({
        alias: gen.randomStr(gen.randomRange(4, 13)),
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


