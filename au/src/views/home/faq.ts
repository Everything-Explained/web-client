import {inject} from 'aurelia-framework';
import { Web } from '../../helpers/web';


interface Question {
  title: string;
  content: string;
  filter: boolean;
}

@inject(Element)
export class Faq {

  public isAttached = false;

  public questions: Question[] = [];
  public answer = '## click a question on the left';
  public elSearch: HTMLInputElement;

  private _searchParam: string;
  private _qTitles: string[] = [];

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
        this.seek(this._searchParam);
      }
    });

  }

  attached() {

    if (this._searchParam) {
      this.elSearch.value = this._searchParam;
    }

    setTimeout(() => {
      this.isAttached = true;
    }, 30);

  }

  activate(params) {
    this._searchParam = params.query || null;
  }


  nodeToArray(nodes: NodeList) {
    return Array.prototype.slice.call(nodes);
  }


  render(q: Question) {
    this.answer = q.content;
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


  getViewStrategy() {
    return 'views/home/faq.html';
  }
}


