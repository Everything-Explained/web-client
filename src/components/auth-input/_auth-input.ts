import { Vue, Provide, Component, Prop, Watch } from 'vue-property-decorator';


@Component
export default class AuthInput extends Vue {

  @Prop({ default: 0, type: Number })
  readonly min!: number;

  @Prop({ default: 0, type: Number })
  readonly max!: number;

  @Prop({ default: undefined, type: RegExp})
  readonly regexp!: RegExp;

  @Provide() readonly textInput = '';



  public state = {
    default: true,
    underMin: false,
    overMax: false,
    invalid: false,
    valid: false,
  }



  created() {}



  public validateTextField = this.validateTextField_(400);
  @Watch('textInput')
  public onInputChanged() {
    this.validateTextField();
  }


  private validateTextField_(delay: number) {
    return this.$debounce(() => {

      let text = this.textInput;
      let len = text.length;

      if (len) {
        if (this.regexp && !this.regexp.test(text)) {
          this.state.invalid = true;
        }
        else if (len < this.min) {
          this.state.underMin = true;
        }
        else if (len > this.max) {
          this.state.overMax = true;
        }
        else {
          this.resetState_();
          this.state.valid = true;
        }
      }
      else this.resetState_()

    }, delay);
  }



  private resetState_() {
    this.state = {
      default: true,
      underMin: false,
      overMax: false,
      invalid: false,
      valid: false
    }
  }



}