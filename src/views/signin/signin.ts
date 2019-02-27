import { Component, Vue } from 'vue-property-decorator';
import Toggle from '@/components/toggle/Toggle.vue';


@Component({
  components: {
    Toggle
  }
})
export default class Signin extends Vue {


  public hasAccount = false;
  public hasInvite = false;

  created() {}

  public canSignup() {
    this.hasInvite = true;
  }

  public canSignin() {
    this.hasAccount = true;
  }

  public getInvite() {
    this.$router.push('invite');
  }

}