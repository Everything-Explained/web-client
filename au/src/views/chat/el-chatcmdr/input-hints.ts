import {ClientIO} from '../../../services/clientio';
import {CommanderData, Chat} from '../../../views/chat/chat';

export class InputHints {

  private _inputBox: HTMLElement;
  private _elHint = document.createElement('span');

  private _hint = '';
  private _hintPartial = '';

  private _test = ['penis'];


  get isActive() {
    return !!this._hint;
  }


  constructor(private _commandBox: HTMLElement)
  {
    this._inputBox = this._commandBox.childNodes[0] as HTMLElement;
    this._elHint.classList.add('suggestion');
  }




  public show(input: string) {

    if (input.length == 0) return;


    for (let a of this._test) {
      if (a.indexOf(input.replace(this._hintPartial, '')) == 0) {
        if (!this._hint) this._inputBox.appendChild(this._elHint);
        this._elHint.textContent = a.replace(input, '');
        this._hintPartial = this._elHint.textContent;
        this._hint = a;
        if (a == input) this.clear();
        return;
      }
    }

    // Clear active hint if word no longer matches
    if (this.isActive)
      this.clear()
    ;

  }

  public fillIn() {
    let hint = this._hintPartial
      , rawInput = this._inputBox.innerText
      , input =
          rawInput.substr(
            0, rawInput.length - this._hintPartial.length
          )
    ;
    this._inputBox.innerText = input + this._hintPartial;
    this.clear(false);
  }


  public clear(removeHint = true) {
    this._hint = this._hintPartial = null;
    if (removeHint)
      this._inputBox.removeChild(this._elHint)
    ;
  }


  /**
   * Filters the hint out of the raw input. This is required
   * in order to retain original user input.
   *
   * @param input The raw input to filter
   */
  public filterHint(input: string) {
    if (this._hintPartial)
      input = input.substr(0, input.length - this._hintPartial.length)
    ;
    return input;
  }



}