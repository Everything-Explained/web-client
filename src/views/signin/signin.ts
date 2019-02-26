import { Component, Vue } from 'vue-property-decorator';
import Toggle from '@/components/toggle/Toggle.vue';


@Component({
  components: {
    Toggle
  }
})
export default class Signin extends Vue {


  public showSignin = false;

  created() {}

  public toggleSignin(val: boolean) {
    this.showSignin = val;
  }

}