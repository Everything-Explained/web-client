export class FAQ {

  private _page: HTMLElement;
  private _questions: HTMLElement[];
  private _answers: HTMLElement[];
  private _timeout = 0;
  private _eAnswer: HTMLElement;
  private _scrollBar: IOptiscrollInstance;
  private _searchParam: string;

  constructor() {}

  attached() {
    this._page = document.querySelector('article.faq') as HTMLElement;
    this._questions = this.nodeToArray(this._page.querySelectorAll('div.question'));

    this._eAnswer = document.getElementById('Answers').firstChild as HTMLElement;

    this._scrollBar = new Optiscroll(document.getElementById('Questions'), {
      autoUpdate: false
    });

    new Optiscroll(document.getElementById('Answers'), {
      autoUpdate: true
    });

    if (this._searchParam) {
      let ev = document.createEvent('HTMLEvents')
        , el = document.getElementById('Search') as HTMLInputElement;

      ev.initEvent('keyup', true, false);
      el.value = this._searchParam;
      el.dispatchEvent(ev);
    }
  }

  activate(params) {
    this._searchParam = params.query || null;
  }

  nodeToArray(nodes: NodeList) {
    return Array.prototype.slice.call(nodes);
  }

  getAnswer(ev: MouseEvent) {
    let el = (ev.target as HTMLElement).parentElement.querySelector('.answer') as HTMLElement;

    this._eAnswer.innerHTML = `<h1>${(ev.target as HTMLElement).innerText}</h1>`;

    if (el.childNodes[0].nodeName == 'SPAN') {
      this._eAnswer.innerHTML += el.innerHTML;
    }
    else {
      this._eAnswer.innerHTML += `<span>${el.innerHTML}</span>`;
    }

  }

  seek(ev: KeyboardEvent) {

    clearTimeout(this._timeout);
    let input = (ev.target as HTMLInputElement).value;
    if (!input || input.length < 3) {
      this._questions.forEach((v) => {
        v.parentElement.style.display = 'flex';
      });
      this._scrollBar.update();
      return true;
    }

    this._timeout = setTimeout(() => {
      let words = (~input.indexOf(' ')) ? input.split(' ' ) : [input];

      this._questions.forEach((v) => {
        let i = 0
          , j = 0;

        for (; i < words.length; i++) {
          if (~v.innerText.toLowerCase().indexOf(`${words[i].toLowerCase()}`)) {
            ++j;
            v.parentElement.style.display = 'flex';
          } else {
            v.parentElement.style.display = 'none';
          }
        }
        console.log(j , words.length);
        if (j == words.length) console.log(v.innerText);
      });
      this._scrollBar.update();
    }, 300);

    return true;
  }
}


