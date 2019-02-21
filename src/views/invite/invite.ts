import { Vue, Component } from 'vue-property-decorator';


@Component
export default class Invite extends Vue {


  public aliasLen = 0;
  public textLen = 0;
  public minAliasLen = 4;
  public minTextLen = 200;

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
    return this.textLen >= this.minTextLen;
  }

  created() {}

  public validateAlias(event: KeyboardEvent) {
    let obj = event.target as HTMLInputElement;
    this.aliasLen = obj.value.length;
    // hasValidAliasLen() already checks for 0 chars (keep '*')
    this.hasValidAliasChars = /^[a-z0-9]*$/.test(obj.value)
  }

  public validateEmail(event: KeyboardEvent) {
    let obj = event.target as HTMLInputElement;
    this.isValidEmail = /^.+@.+\..+$/.test(obj.value);
  }

  public validateText(event: KeyboardEvent) {
    let obj = event.target as HTMLTextAreaElement;
    this.textLen = obj.value.length;
  }
}