import { Vue, Provide, Component, Prop, Watch } from 'vue-property-decorator';
import { DebounceObj } from '@/globals';


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

  @Prop({ default: undefined, type: Object})
  readonly validate!: DebounceObj;

  @Prop({ default: undefined, type: String})
  readonly validationType!: string;

  @Provide() readonly textInput = '';

  public failedValidationText = '';

  public state = {
    default: true,
    underMin: false,
    overMax: false,
    invalid1: false,
    invalid2: false,
    invalid3: false,
    failedValidation: false,
    checkingValidation: false,
    valid: false,
  }



  created() {}



  @Watch('textInput')
  public onInputChanged() {
    this.validateTextField_();
  }


  private async validateTextField_() {
    let text = this.textInput;
    let len = text.length;

    this.resetState_();
    this.validate.cancel();
    this.$emit('valid-input', '');


    if (len) {
      if (this.isInvalid_(text)) {
      }
      else if (len < this.min) {
        this.state.underMin = true;
      }
      else if (len > this.max) {
        this.state.overMax = true;
      }
      else {
        this.state.valid = await this.isValidated_(text);
        this.$emit('valid-input', text);
      }
    }
  }


  private async isValidated_(input: string) {
    if (!this.validate) return true;

    this.state.checkingValidation = true;
    let req = await this.validate.exec(input);

    if (req.status >= 400) {
      this.state.failedValidation = true;
      this.failedValidationText = req.data;
      return false;
    }

    this.state.checkingValidation = false;

    return true
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
      failedValidation: false,
      checkingValidation: false,
      valid: false
    }
  }



}