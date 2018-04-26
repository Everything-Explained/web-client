import {inject} from 'aurelia-framework';
import { Web } from '../../../../shared/services/web-get';


interface Question {
  title: string;
  content: string;
  filter: boolean;
}

@inject(Element)
export class Faq {

  public isAttached = false;

  public questions: Question[] = [];
  public answer = '#### click a question on the left';
  public elSearch: HTMLInputElement;
  public elScroller: HTMLElement;

  private _searchParam: string;
  private _qTitles: string[] = [];
  private _rendered = false;

  constructor(private _el: HTMLElement) {

    Web.GET('/faq', {}, (err, code, data) => {
      if (err) {
        console.error(err);
        return;
      }

      let qTemp: Question[] = [];

      for (let q in data) {
        qTemp.push(
          {
            title: q,
            content: data[q],
            filter: false
          }
        );
        this._qTitles.push(q);
      }

      // Sort questions by Alphabetical
      this._qTitles.sort();
      this._qTitles.forEach(t => {
        this.questions.push(qTemp.filter(v => { return t == v.title; })[0]);
      });

      if (this._searchParam) {
        if (!this._findPage(this._searchParam))
          this.seek(this._searchParam);
      }
    });

  }



  attached() {

    setTimeout(() => {
      this.isAttached = true;
    }, 30);

  }



  activate(params) {
    this._searchParam = params.page || null;

    // Auto-filter from FAQ links
    if (this.isAttached && this._searchParam && !this._rendered) {
      if (!this._findPage(this._searchParam)) {
        this.elSearch.value = this._searchParam;
        this.seek(this._searchParam);
      }
    }

    if (!this._searchParam) {
      this.answer = '#### click a question on the left';
    }

    this._rendered = false;
  }



  private _findPage(page: string) {

    page = page.replace(/[-]/g, ' ');

    if (this._qTitles.includes(page)) {
      for (let q of this.questions) {
        if (q.title == page) {
          this.answer = q.content;
          this.elScroller.scrollTop = 0;
          return true;
        }
      }
    }

    return false;
  }


  // Referenced in view
  render(q: Question) {
    this.answer = q.content;
    this._rendered = true;
    this.elScroller.scrollTop = 0;
    window.location.assign(`#/home/faq/${q.title.replace(/\s/g, '-')}`);
  }



  seek(data: KeyboardEvent | string) {

    let input =
      (typeof data == 'string')
        ? data
        : (data.target as HTMLInputElement).value.toLowerCase()
    ;

    if (!input || input.length < 3) {
      this.questions.forEach(v => {
        v.filter = false;
      });
      return true;
    }

    this.questions.forEach((v) => {

      if (~v.title.indexOf(input)) {
        v.filter = false;
      }
      else v.filter = true;

    });

    return true;
  }


  // getViewStrategy() {
  //   return 'views/home/faq.html';
  // }
}


