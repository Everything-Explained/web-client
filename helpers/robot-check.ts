export class IRobot {

  private _hasEvents = false;
  private _evtPos = 0;
  private _speed = 400;
  private _seq: number[];
  private _inProgress = false;
  private _inError = false;

  constructor(private _objs: HTMLElement[], private _callback: (result: boolean) => void) {}


  public start(speed: number, delay = 0) {
    if (this._inProgress) return;
    this._clearNodes();
    this._speed = speed;
    this._seq = this._getRandomSequence();
    this._blink(0);
    this._inProgress = true;
  }

  public restart(delay = 300) {
    if (this._inProgress) return;
    this._clearNodes();

    setTimeout(() => {
      this._blink(0);
      this._inProgress = true;
    }, delay);

  }


  private _blink(pos: number) {

    if (pos >= this._seq.length) {
      this._inProgress = false;
      this._hasEvents = true;
      return;
    }

    for (let o = 0; o < this._objs.length; o++) {

      if (pos == this._seq[o]) {

        this._objs[o].classList.add('active');

        ((o: number, pos: number) => {

          setTimeout(() => {
            if (!this._hasEvents) {
              this._objs[o].setAttribute('data-pos', (this._seq[o]).toString());
              this._objs[o].addEventListener('mousedown', (e) => this._click(e));
            }
            this._objs[o].classList.remove('active');
            this._blink(pos + 1);
          }, this._speed);

        })(o, pos);

      }

    }

  }

  private _click(e: MouseEvent) {

    if (this._inError || this._inProgress) return;


    let obj = (e.target) as HTMLElement
    , pos = parseInt(obj.getAttribute('data-pos'));


    if (pos == this._evtPos) {

      if (pos + 1 == 4) {
        this._evtPos = 0;
        this._clearNodes();
        this._callback(true);
        return;
      }
      obj.classList.add('success');
      this._evtPos++;
    } else {
      obj.classList.add('error');
      this._inError = true;
      this._callback(false);
    }

  }

  private _clearNodes() {
    for (let o of this._objs) {
      o.classList.remove('success');
      o.classList.remove('error');
    }
    this._evtPos = 0;
    this._inError = false;
  }


  private _getRandomSequence() {

    let seq = [] as number[];
    for (let i = 0; i < 4; i++) {
      seq.push(i);
    }

    let randSeq = [] as number[];
    while (seq.length) {
      let pos = Math.floor(Math.random() * seq.length);
      randSeq.push(seq.splice(pos, 1)[0]);
    }
    
    // Prevent sequential pattern
    for (let i = 0; i < randSeq.length; i++) {
      if (randSeq[i] != i) break;
      return this._getRandomSequence();
    }

    return randSeq;
  }


}