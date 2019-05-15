


export default class InputHints {

  private activeHint: string|undefined;
  private readonly elHint!: HTMLElement;


  get isActive() {
    return !!this.activeHint;
  }





  constructor(
    private readonly el: HTMLElement,
    private readonly hints: string[]
  ) {
    this.elHint = document.createElement('span');
    this.elHint.classList.add('suggestion');
  }





  show(input: string) {
    if (!this.isActive) {
      this.el.appendChild(this.elHint);
    }

    this.activeHint = this.filterHint(input);

    if (this.activeHint) {
      this.elHint.textContent = this.activeHint;
    }
    else this.clear();
  }


  fill() {
    if (this.isActive) {
      this.el.childNodes[0].textContent! += this.activeHint;
      this.clear();
    }
  }


  clear() {
    if (this.activeHint !== undefined) {
      this.activeHint = undefined;
      this.el.removeChild(this.elHint);
    }
  }




  private filterHint(input: string) {
    if (!input) return '';

    for (let hint of this.hints) {
      if (hint == input) return '';

      if (hint.indexOf(input) == 0) {
        return hint.replace(input, '');
      }
    }

    return '';
  }





}