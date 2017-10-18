

export class InputHistory {

  private _history = [];
  private _pos = 0;

  constructor() {}

  public add(entry: string) {
    if (this._history.length >= 35) {
      this._history.shift();
    }
    if (this._history.length) {
      if (this._history[this._history.length - 1] == entry) return;
    }
    this._history.push(entry);
    this._pos = this._history.length - 1;
  }



  public next() {
    if (this._pos < 0) return;
    if (this._pos == this._history.length) --this._pos;
    console.log(this._history[this._pos--]);
  }



  public prev() {
    if (this._pos < 0) ++this._pos;
    if (this._pos == this._history.length) return;
    console.log(this._history[this._pos++]);
  }

}