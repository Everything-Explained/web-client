import {inject} from 'aurelia-framework';
import { Web } from '../../../../shared/services/web-get';
import { Router } from 'aurelia-router';


interface Question {
  title: string;
  content: string;
  filter: boolean;
}

@inject(Element, Router)
export class Faq {

  public isAttached = false;

  public questions: Question[] = [];
  public pages = [];


  private _searchParam: string;
  private _qTitles: string[] = [];
  private _rendered = false;

  constructor(private _el: HTMLElement, private _router) {

    Web.GET('/faq', {}, (err, code, data) => {
      if (err) {
        console.error(err);
        return;
      }

      let titles = []
        , sortedPages = []
      ;

      for (let d of data) {
        this.pages.push(
          {
            title: d.title,
            content: d.content,
            time: new Date(d.date)
          }
        );
      }
    });

  }



  attached() {

    setTimeout(() => {
      this.isAttached = true;
    }, 30);

  }
}


