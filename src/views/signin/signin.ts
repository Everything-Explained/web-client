import { Component, Vue, Provide } from 'vue-property-decorator';
import Toggle from '@/components/toggle/Toggle.vue';



interface InviteStatus {
  status: number;
  data: {
    valid: boolean;
    exists: boolean;
    expired: boolean;
    validated: boolean;
  }
}



@Component({
  components: {
    Toggle
  }
})
export default class Signin extends Vue {

  @Provide() invite = '';

  public hasAccount = false;
  public hasInvite = false;
  public inviteStatus = {
    active: false,
    valid: false,
    exists: false,
    expired: false,
    validated: false
  }

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


  public async validateInvite() {
    let resp =
      await this.$api.validateInvite(this.invite) as InviteStatus
    ;
    this.inviteStatus = Object.assign(this.inviteStatus, resp.data);
    this.inviteStatus.active = true;
  }


  public clearInviteStatus() {
    if (this.inviteStatus)
      this.inviteStatus.active = false
    ;
  }

  // ONLY use with validateInvite() api call
  // private _randInviteResp() {
  //   let tests = [
  //     'invalid',
  //     'expired',
  //     'notexist',
  //     ''
  //   ]
  //   let rand = tests[Math.floor(Math.random() * tests.length)]
  //   return rand;
  // }

}