import { Vue, Component, Provide } from 'vue-property-decorator';


@Component
export default class Invite extends Vue {

  @Provide() alias = '';
  @Provide() email = '';
  @Provide() content = '';

  public readonly minAliasLen = 4;
  public readonly minTextLen = 200;

  public isLoading = true;
  public hasFailed = false;
  public hasSent = false;

  public timeout = {
    hours: 0,
    minutes: 0
  }



  get hasValidAliasLen() {
    return this.alias.length >= this.minAliasLen
  }

  get hasValidAliasChars() {
    return /^[a-z0-9A-Z]*$/.test(this.alias);
  }

  get hasValidAlias() {
    return this.hasValidAliasLen && this.hasValidAliasChars
  }

  get hasValidEmail() {
    return /^.+@.+\..+$/.test(this.email);
  }

  get hasValidTextLen() {
    return this.content.length >= this.minTextLen;
  }

  get hasActiveTimeout() {
    return !!this.timeout.hours || !!this.timeout.minutes;
  }

  get isRequestActive() {
    return this.hasActiveTimeout
        || this.hasFailed
        || this.hasSent
  }

  get isReadyToSubmit() {
    return   this.hasValidAlias
          && this.hasValidEmail
          && this.hasValidTextLen
    ;
  }





  async created() {
    let resp = await this.$api.canRequestInvite(500);

    if (resp.status == 202) {
      this.timeout = resp.data!.timeout!;
    }

    if (resp.status > 400) {
      this.hasFailed = true;
    }

    this.isLoading = false;
  }




  public async submit(ev: Event) {
    ev.preventDefault();

    if (this.isReadyToSubmit) {
      this.isLoading = true;

      let inv = await this.$api.requestInvite({
        alias: this.alias,
        email: this.email,
        content: this.content
      }, 700)

      this.isLoading = false;

      if (inv.status == 500) {
        this.hasFailed = true;
      }
      if (inv.status == 200) {
        this.hasSent = true;
      }
    }
  }




}