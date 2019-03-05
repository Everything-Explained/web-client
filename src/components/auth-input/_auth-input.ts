import { Vue, Provide, Component, Prop, Watch } from 'vue-property-decorator';


type InputTest = (input: string) => boolean;

@Component
export default class AuthInput extends Vue {

  @Prop({ default: 0, type: Number })
  readonly min!: number;

  @Prop({ default: 0, type: Number })
  readonly max!: number;

  @Prop({ default: undefined, type: Function})
  readonly test1!: InputTest;

  @Prop({ default: undefined, type: Function})
  readonly test2!: InputTest;

  @Prop({ default: undefined, type: Function})
  readonly test3!: InputTest;

  @Provide() readonly textInput = '';



  public state = {
    default: true,
    underMin: false,
    overMax: false,
    invalid1: false,
    invalid2: false,
    invalid3: false,
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

      this.resetState_();

      if (len) {
        if (this.isInvalid_(text)) {}
        else if (len < this.min) {
          this.state.underMin = true;
        }
        else if (len > this.max) {
          this.state.overMax = true;
        }
        else {
          this.state.valid = true;
        }
      }

    }, delay);
  }


  private isInvalid_(input: string) {
    if (this.test1 && !this.test1(input))
      return this.state.invalid1 = true
    ;
    if (this.test2 && !this.test2(input))
      return this.state.invalid2 = true
    ;
    if (this.test3 && !this.test3(input))
      return this.state.invalid3 = true
    ;
    return false;
  }



  private resetState_() {
    this.state = {
      default: true,
      underMin: false,
      overMax: false,
      invalid1: false,
      invalid2: false,
      invalid3: false,
      valid: false
    }
  }



}