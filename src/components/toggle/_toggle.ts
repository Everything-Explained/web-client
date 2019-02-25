import { Component, Vue, Provide, Prop } from 'vue-property-decorator';

@Component
export default class Toggle extends Vue {

  @Provide() checked = false;

  @Prop({ default: 'OFF' }) offText!: string;
  @Prop({ default: 'ON'  }) onText!: string;

  // Prevent rapid clicking
  private inTransit_ = false;

  public toggle(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    if (this.inTransit_) return;
    this.inTransit_ = true;

    this.checked = !this.checked
    this.$emit('toggled', this.checked);

    setTimeout(() => {
      this.inTransit_ = false;
    }, 350);
  }
}