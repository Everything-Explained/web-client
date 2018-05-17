import {Web} from '../../shared/services/web-get';
import { IPage, IPagingConfig, IPageData } from '../../shared/layouts/dynamic-paging';
import { singleton } from 'aurelia-framework';


@singleton(false)
export class Changelog {


  public isLoaded   = false;
  public pages      = [] as IPage[];


  constructor() {}


  async created() {
    if (this.isLoaded) return;

    let [err, code, data] = await Web.GET('/changelog') as [any, number, IPageData[]];

    if (err) {
      console.error(err);
      return;
    }

    data.forEach(d => {
      this.pages.push({
        title:   d.title.split(':').map(v => v.trim()),
        content: d.content,
        date:    new Date(d.date)
      });
    });

    this.isLoaded = true;
  }


}
