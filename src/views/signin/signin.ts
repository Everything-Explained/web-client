import { Component, Vue } from 'vue-property-decorator';
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
    let callback = this.$route.params.callback;

    return (
         !!callback
      && callback == 'authfail'
      && !!this.$route.params.type
    )
  }

  get callbackType() {
    return parseInt(this.$route.params.type);
  }

  get callbackTitle() {
    if (this.isCallback) {
      if (this.callbackType == 1) {
        return 'Signin Failure'
      }
      else {
        return 'Signup Failure';
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
    if (type == 'google') {
      window.location.replace('/auth/google')
    }
    // if (this.alias && this.hasInvite) {
    //   let resp = await this.$api.signup(this.alias, type, 300, 'email')
    //   console.log(resp);
    //   if (resp.status >= 400) {
    //     this.signupResp = Object.assign(this.signupResp, resp.data);
    //   }
    // }
    // else {
    //   let resp = await this.$api.signin(type, 0, 'error');
    //   if (resp.status >= 400) {
    //     this.signinResp = Object.assign(this.signinResp, resp.data);
    //   }
    // }
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