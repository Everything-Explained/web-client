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
  public inviteStatus = '';
  public inviteStatusText = '';

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

    let resp = await this.$api.validateInvite(this.invite) as InviteStatus
    if (!resp.data.valid) {
      this.inviteStatus = 'bad';
      this.inviteStatusText = 'invalid invite';
    }
    else if (!resp.data.exists) {
      this.inviteStatus = 'bad';
      this.inviteStatusText = `invite not found`;
    }
    else if (resp.data.expired) {
      this.inviteStatus = 'medium';
      this.inviteStatusText = 'invite has expired'
    }
    else {
      this.inviteStatus = 'good';
      this.inviteStatusText = 'invite validated!'
    }
  }

  public clearInviteStatus() {
    if (this.inviteStatus)
      this.inviteStatus = ''
    ;
  }

}