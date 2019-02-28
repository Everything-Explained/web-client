import { Vue, Component, Provide } from 'vue-property-decorator';
import { InviteRequest } from '@/api/mock';


@Component
export default class Invite extends Vue {

  @Provide() alias = '';
  @Provide() email = '';
  @Provide() content = '';

  public aliasLen = 0;
  public contentLen = 0;
  public minAliasLen = 4;
  public minTextLen = 200;

  public isLoading = true;
  public hasFailed = false;
  public hasSent = false;

  public timeout = {
    hours: 0,
    minutes: 0
  }

  public isValidEmail = false;
  // Is always true on first load (0 chars)
  public hasValidAliasChars = true;


  get isValidAlias() {
    return this.hasValidAliasLen && this.hasValidAliasChars
  }

  get hasValidAliasLen() {
    return this.aliasLen >= this.minAliasLen
  }

  get isValidText() {
    return this.contentLen >= this.minTextLen;
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
    return this.isValidAlias && this.isValidEmail && this.isValidText
  }

  async created() {
    let resp = await this.$api.canRequestInvite(1000);
    if (resp.status == 202) {
      if (resp.data && resp.data.timeout) {
        this.timeout = resp.data.timeout;
      }
    }
    if (resp.status == 500) {
      this.hasFailed = true;
    }
    this.isLoading = false;
  }

  public validateAlias() {
    this.aliasLen = this.alias.length
    // hasValidAliasLen() already checks for 0 chars (keep '*')
    this.hasValidAliasChars = /^[a-z0-9]*$/.test(this.alias)
  }

  public validateEmail() {
    this.isValidEmail = /^.+@.+\..+$/.test(this.email);
  }

  public validateText() {
    this.contentLen = this.content.length;
  }

  public async submit(ev: Event) {
    ev.preventDefault();
    if (this.isReadyToSubmit) {
      this.isLoading = true;
      let inv = await this.$api.requestInvite({
        alias: this.alias,
        email: this.email,
        content: this.content
      }, 1000)
      this.isLoading = false;
      if (inv.status == 500) {
        this.hasFailed = true;
      }
      if (inv.status == 200) {
        this.hasSent = true;
      }
    }

    return false;
  }
}