import {inject, singleton} from 'aurelia-framework';
import { Web } from '../../../../shared/services/web-get';
import { Router } from 'aurelia-router';
import { IPage, IPageData } from '../../../../shared/layouts/dynamic-paging';


@singleton(false)
@inject(Element, Router)
export class Faq {


  public isLoaded = false;
  public pages: IPage[] = [];


  constructor(private _el: HTMLElement, private _router) {}


  async created() {
    if (this.isLoaded) return;

    let [err, code, data] = await Web.GET('/faq') as [any, number, IPageData[]];

    if (err) {
      console.error(err);
      return;
    }

    data.forEach(d => {
      this.pages.push({
        title: [d.title],
        content: d.content,
        date: new Date(d.date)
      });
    });

    this.isLoaded = true;
  }


}


