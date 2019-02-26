import { Component, Vue, Provide, Prop } from 'vue-property-decorator';

@Component
export default class Toggle extends Vue {

  @Provide() checked = false;

  @Prop({ default: 'OFF' }) offText!: string;
  @Prop({ default: 'ON'  }) onText!: string;

  private inTransit_ = false;

  public toggle(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    if (this.inTransit_) return;
    this.inTransit_ = true;

    this.checked = !this.checked

    // Animation glitches if clicked too fast
    setTimeout(() => {
      this.$emit('toggled', this.checked);
      this.inTransit_ = false;
    }, 370);
  }
}