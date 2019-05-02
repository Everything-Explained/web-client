

export class InputHistory {

  private history: string[] = [];
  private pos = 0;



  constructor(private size: number) {}



  public add(entry: string) {
    if (this.history.length >= this.size) {
      this.history.shift();
    }

    // Causes existing entries to be moved to the front
    const index = this.history.indexOf(entry);
    if (~index) {
      this.history.splice(index, 1);
    }

    this.history.push(entry);
    this.pos = this.history.length;
  }



  public next() {
    if (this.pos < 0) return '';
    return (~(--this.pos)) ? this.history[this.pos] : '';
  }



  public prev() {
    if (this.pos == this.history.length) return '';
    return (++this.pos < this.history.length)
      ? this.history[this.pos]
      : ''
    ;
  }

}