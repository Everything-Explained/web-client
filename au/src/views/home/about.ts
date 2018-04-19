import {inject} from 'aurelia-framework';


@inject(Element)
export class About {

  private _emailName = this._toArray('noumenae') as string[];
  private _emailExt = this._toArray('yandex') as string[];
  private _email =
    this._emailName.concat(
      ['@'].concat(
        this._emailExt
      )
      .concat(['.', 'c', 'o', 'm'])
    );
  private _emailVisible = false;
  private calculateTimeout: NodeJS.Timer = null;

  public text = about;
  public isAttached = false;

  constructor(private _el: HTMLElement) {}



  public decode(ev: MouseEvent) {
    if (this._emailVisible) return;
    let el = (ev.target) as HTMLElement;
    this._emailVisible = true;
    el.innerText = '';
    this._till(0, 0, el);


  }

  attached() {
    let el = this._el.querySelector('#PageContent .home');

    setTimeout(() => {
      this.isAttached = true;
    }, 30);

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


const about = `**Hello there!**

_So you want to know what this site is all about huh?_ It's funny, cause I do too! Without people to make this place amazing, it won't be. You are an integral part of whether or not this place will become a bastion of love and understanding...or just another haven for trolling and depravity. Often in our lives we become complacent with each other, deciding that as long as we stay in our own lane, we're _"okay"_. **Are you okay?** Is your life all that you imagined? That's what Noumenae is about; it's about the discovery of our potential, __together__. It's the understanding that there is more to life than what we're doing about it.

If you're still reading, you must be at least a little curious right? At this point you might be wondering about the invite requirements. **No Judgment**, **No Condemnation**, and **No shortage of Love** are all the tenets you need. I don't want anyone to be under any illusions though, so let me make this clear: _We are about the work of God_. No, I do not claim that this site is the literal or metaphorical work of God, but that the people for whom this site was made, are the work of God; and by extension, if you do not believe you are the work of God, then you probably won't see your home here. However, if you have an inkling that there is more to you than flesh and blood, then you might've just found your long lost home.

Now obviously because we aren't perfect, this site is not going to be perfect. There will inevitably be disagreements from time to time, but they will be dealt with by the spirit of love that we will have for one another. Now, all this _"God-talk"_ aside, there is room for debate surrounding other topics, but the spirit of the site stays the same. Believe it or not, it is possible to think, speak, and be like a human while exhibiting an air of Godliness.

**An air of Godliness is precisely what Noumenae is looking to pull out of its members**.

For a more complete understanding of this site, check out the [Rules] and [FAQ] sections.


[Noumenon]:#/faq/noumenae
[Rules]:#/rules
[FAQ]:#/faq/how-to-use-the-faq`;