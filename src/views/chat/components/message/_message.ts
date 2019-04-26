import { Vue, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import Utils from '@/libs/utils';


@Component
export default class Message extends Vue {

  @Prop({ type: String })
  readonly alias!: string;

  @Prop({ type: String })
  readonly avatar!: string;

  @Prop({ default: 'normal', type: String })
  readonly scale!: 'large'|'normal'|'small';

  @Prop({ default: 'normal', type: String })
  readonly type!: 'normal'|'inline'|'inline-avatar'|'server';

  readonly time = Utils.toNormalTimeString(Date.now());



  get scaleClass() {
    return `scale-${this.scale}`
  }

  get isInline() {
    return (
      this.type == 'inline' ||
      this.type == 'inline-avatar'
    )
  }





  created() {
  }




}