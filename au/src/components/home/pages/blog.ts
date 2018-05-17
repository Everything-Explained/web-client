import {singleton} from 'aurelia-framework';
import { IPage } from '../../../shared/layouts/dynamic-paging';


@singleton(false)
export class Blog {


  public isLoaded = false;
  public pages: IPage[];


  constructor() {}


  async created() {

    if (this.isLoaded) return;

    if (await this._loadContentful()) {
      let entries = await this._getContent();

      this.pages = entries.items.map(i =>  {
        return {
          title: [i.fields.title],
          date: new Date(i.sys.createdAt),
          content: i.fields.body
        };
      });
      
      this.isLoaded = true;
    }
    else {
      console.error('There was an error loading contetful');
    }

  }


  private _loadContentful() {
    let head = document.getElementsByTagName('head')[0]
      , contentful = document.createElement('script')
    ;

    return new Promise((rs, rj) => {
      contentful.async = true;
      contentful.onload = () => {
        rs(true);
      };
      contentful.onerror = (ev) => {
        rs(false);
      };
      contentful.src = '//unpkg.com/contentful@3.8.1/browser-dist/contentful.min.js';
      head.appendChild(contentful);
    });

  }


  private _getContent() {

    let client = contentful.createClient({
      accessToken: '87e615a6111bb8d7e772187bdf84f7fcd649c086da0043beac321cf52754556a',
      space: 's2rp7j0ifide'
    });
    return client.getEntries({order: '-sys.createdAt'});

  }

}