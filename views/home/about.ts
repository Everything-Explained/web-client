
export class About {

  private _emailName = this._toArray('noumenae') as string[];
  private _emailExt = this._toArray('outlook') as string[];
  private _email =
    this._emailName.concat(
      ['@'].concat(
        this._emailExt
      )
      .concat(['.', 'c', 'o', 'm'])
    );
  private _emailVisible = false;

  constructor() {

  }



  public decode(ev: MouseEvent) {
    if (this._emailVisible) return;
    let el = (ev.target) as HTMLElement;
    this._emailVisible = true;
    el.innerText = '';
    this._till(0, 0, el);


  }


  private _till(char: number, pos: number, el: HTMLElement) {

    // The amount of characters to flip through per iteration
    let charFlipAmount = 20;

    let charArray = this._toArray(el.innerText) as string[];
    if (charArray.length != char + 1) {
      charArray.push('');
    }

    if (char < this._email.length) {
      if (pos < charFlipAmount) {
        charArray[char] = (String.fromCharCode((Math.random() * 42) + 48)).toUpperCase();
        el.innerText = charArray.join('');
        setTimeout(() => {
          this._till(char, ++pos, el);
        }, 3);
      }
      if (pos == charFlipAmount) {
        console.log(pos);
        charArray[char] = this._email[char];
        el.innerText = charArray.join('');
        this._till(++char, 0, el);
      }

    }

    if (char == this._email.length && pos == charFlipAmount) {
      el.innerHTML =  `<a href='mailto:${el.innerText}'>${el.innerText}</a>`;
    }




  }

  getViewStrategy() {
    return 'views/home/about.html';
  }

  private _toArray(val: Node|string) {
    return Array.prototype.slice.call(val);
  }
}
