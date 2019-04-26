import { Vue, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import Utils from '@/libs/utils';


@Component
export default class Message extends Vue {

  @Prop({ default: undefined, type: String })
  readonly alias!: string;

  @Prop({ default: undefined, type: String })
  readonly avatar!: string;

  @Prop({ default: 'normal', type: String})
  readonly scale!: 'large'|'normal'|'small';

  readonly time = Utils.toNormalTimeString(Date.now());

  created() {
  }




}