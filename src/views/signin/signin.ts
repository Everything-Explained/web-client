import { Vue, Component } from 'vue-property-decorator';
import Toggle from '@/components/toggle/Toggle.vue';
import AuthInput from '@/components/auth-input/AuthInput.vue';



@Component({
  components: {
    Toggle,
    AuthInput
  }
})
export default class Signin extends Vue {

  public hasAccount   = false;
  public hasInvite    = false;
  public validInvite  = false;
  public validAlias   = false;
  public inviteActive = false;

  public alias = '';
  public invite = '';

  public signupResp = {
    verify: false,
    exists: false,
    error: null
  }

  public signinResp = {
    notfound: false,
    signedin: false,
    error: null
  }


  get isCallback() {
    return (
      !!this.$route.params.callback
      && !!this.$route.params.type
    )
  }

  get isFailedCallback() {
    return (
      this.isCallback
      && this.$route.params.callback == 'authfail'
    );
  }

  get isSuccessCallback() {
    return (
      this.isCallback
      && this.$route.params.callback == 'authsucc'
    );
  }

  get callbackType() {
    return parseInt(this.$route.params.type);
  }

  get callbackFailTitle() {
    if (this.isCallback) {
      if (this.callbackType == 1 || 2) {
        return 'SIGNIN FAILURE'
      }
      else {
        return 'SIGNUP FAILURE';
      }
    }
    return '';
  }

  get hasChosen() {
    return this.hasAccount || this.hasInvite || this.validInvite;
  }

  get canSignin() {
    return   !this.signupResp.exists
          && !this.signupResp.verify
          && !this.signupResp.error
          && !this.signinResp.notfound
          && !this.signinResp.signedin
          && !this.signinResp.error
    ;
  }




  created() {}




  public signin(type: 'google'|'facebook') {
    this.$api.signin(type);
  }


  public async validateAlias(alias) {
    return await this.$api.validateAlias(alias)
  }


  public async validateInvite(invite: string) {
    return await this.$api.validateInvite(invite);
  }


  public refresh() {
    window.location.reload();
  }




  // ONLY use with validateInvite() api call
  // private _randInviteResp() {
  //   let tests = [
  //     'invalid',
  //     'expired',
  //     'notexist',
  //   ]
  //   let rand = tests[Math.floor(Math.random() * tests.length)]
  //   return rand;
  // }

}