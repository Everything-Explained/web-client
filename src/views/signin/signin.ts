import { Component, Vue, Provide, Watch } from 'vue-property-decorator';
import Toggle from '@/components/toggle/Toggle.vue';
import AuthInput from '@/components/auth-input/AuthInput.vue';



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
    Toggle,
    AuthInput
  }
})
export default class Signin extends Vue {

  @Provide() invite = '';

  public hasAccount = false;
  public hasInvite = false;
  public validatedInvite = false;
  public validAlias = false;
  public inviteStatus = {
    active: false,
    valid: false,
    exists: false,
    expired: false,
    validated: false
  }

  public authedAlias = '';
  public authedInvite = '';


  get validateAlias() {
    return (this.$debounce(async (input: string) => {
      return await this.$api.validateAlias(input, 500)
    }, 800))();
  }


  get validateInvite() {
    return (this.$debounce(async (input: string) => {
      return await this.$api.validateInvite(input, 500);
    }, 800))();
  }


  get hasChosen() {
    return this.hasAccount || this.hasInvite || this.validatedInvite;
  }


  created() {}




  public canSignup() {
    this.hasInvite = true;
  }

  public startSignup() {
    this.validatedInvite = true;
  }

  public canSignin() {
    this.hasAccount = true;
  }


  public getInvite() {
    this.$router.push('invite');
  }

  @Watch('invite')
  public clearInviteStatus() {
    if (this.inviteStatus)
      this.inviteStatus.active = false
    ;
  }

  public setInvite(val: string) {
    this.authedInvite = val;
  }

  public setAlias(val: string) {
    this.authedAlias = val;
  }

  public saveAlias() {
    this.validAlias = true;
  }







  // ONLY use with validateInvite() api call
  private _randInviteResp() {
    let tests = [
      'invalid',
      'expired',
      'notexist',
    ]
    let rand = tests[Math.floor(Math.random() * tests.length)]
    return rand;
  }

}