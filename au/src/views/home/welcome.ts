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
    return 'views/home/welcome.html';
  }

  private _toArray(val: Node|string) {
    return Array.prototype.slice.call(val);
  }
}


const about = `**Hello there!**

_Do you like long walks on the Beach?_...**Just Kidding!!**
But...do you find yourself contemplating where your life is headed? **Noumenae** is a place for those who are confounded in their present life. **No**, not necessarily unhappy, but _unsure as to what exactly fulfills them_. Even further, those who might be very happy with their life but feel as though something isn't quite right...**something is missing**...

Unfortunately this material world has very little answers when it comes to the human condition. You'd think by now that with **all** the self-help books, we'd have figured out what gives our lives _meaning and purpose_. Thankfully though, the answer is often inside our own selves, but...**most of us can't hear**. If you're ready to listen to _the real You_, then I think **Noumenae** might just be the community you've been searching for.

Just so there's no mincing of words here, **Yes**, we are about the **Spiritual** work; the revealing of our hidden nature which we so often ignore. There is **no** judgement or condemnation here, only simple people whom all are on this journey with you, desiring your success. Now before you think we're all just a bunch of happy Guppies, let me say that I myself, have been disenchanted with life on many occations; I know what depression feels like. _But that's what **Love** is for_.

___There is no doctrine___, only ___YOU___.
You are the light you never knew you had; _all of us **Are**_.
If you are thoroughly enticed by now _...hehe..._ then go ahead and check out the invite tab on the left or [Click Here][invite]

For a more complete understanding of this site, check out the [Rules] and [FAQ] sections.


[Noumenon]:#/faq/about-the-creation
[Rules]:#/rules
[invite]:#/invites
[FAQ]:#/faq/how-to-use-the-faq`;