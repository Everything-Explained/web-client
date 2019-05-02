

export class InputHistory {

  private history: string[] = [];
  private pos = 0;



  constructor(private size: number) {}



  public add(entry: string) {
    if (this.history.length >= this.size) {
      this.history.shift();
    }

    const histlen = this.history.length;

    // Don't add duplicate entries
    if (histlen && this.history[histlen - 1] == entry) {
      return;
    }
    this.history.push(entry);
    this.pos = this.history.length;
  }



  public next() {
    if (this.pos == 0) return '';
    return this.history[--this.pos];
  }



  public prev() {
    if (this.pos == this.history.length) return '';
    return this.history[this.pos++];
  }

}