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

  @Prop({ default: undefined, type: Function})
  readonly validate!: (...args: any) => Promise<any>;

  @Prop({ default: undefined, type: String})
  readonly validationType!: string;

  @Prop({ default: 500, type: Number })
  readonly validationDelay!: number;

  @Provide() readonly textInput = '';



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

  public failedValidationText = '';
  public validation = this.delayValidation(this.validate)

  /** Maintains validation priority with async operations */
  private validationPriority_ = 0;




  created() {}



  @Watch('textInput')
  private async validateTextField() {
    let text = this.textInput;
    let len = text.length;

    this.resetState();
    this.$emit('valid-input', '');

    if (len) {
      if (this.isInvalid(text)) {}
      else if (this.min && len < this.min) {
        this.state.underMin = true;
      }
      else if (this.max && len > this.max) {
        this.state.overMax = true;
      }
      else {
        this.state.checkingValidation = true;
        this.state.valid =
          await this.isValidated(text, ++this.validationPriority_)
        ;
        if (this.state.valid) {
          this.$emit('valid-input', text);
        }
      }
    }
  }


  private async isValidated(input: string, priority: number) {
    if (!this.validate) return true;

    let req = await this.validation.start(input) as any
    if (priority < this.validationPriority_) return false;

    if (req.status >= 400) {
      this.state.failedValidation = true;
      this.failedValidationText = req.data;
      return false;
    }

    this.state.checkingValidation = false;
    return true
  }


  private isInvalid(input: string) {
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



  private resetState() {
    ++this.validationPriority_;
    this.validation.stop();
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


  private delayValidation(fn: (...args: any) => Promise<any>) {
    let timeoutID = 0;
    let that = this;
    return {
      start: function (...args: any) {
        clearTimeout(timeoutID);
        return new Promise(rs => {
          timeoutID = setTimeout(() => {
            rs(fn(args));
          }, that.validationDelay);
        })
      },
      stop: function() {
        clearTimeout(timeoutID);
      }
    }
  }



}