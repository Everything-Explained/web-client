

export class InputHistory {

  private _history = [];
  private _pos = 0;

  constructor() {}



  public add(entry: string) {
    if (this._history.length >= 35) {
      this._history.shift();
    }
    if (this._history.length) {
      if (this._history[this._history.length - 1] == entry) {
        // Reset position on entry
        this._pos = this._history.length;
        return;
      }
    }
    this._history.push(entry);
    this._pos = this._history.length;
  }



  public next() {
    if (this._pos < 0) return '';
    return this._history[--this._pos];
  }



  public prev() {
    if (this._pos == this._history.length) return '';
    return this._history[++this._pos];
  }

}