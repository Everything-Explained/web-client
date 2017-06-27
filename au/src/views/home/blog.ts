import {Web} from '../../helpers/web';
import {singleton} from 'aurelia-framework';
import * as moment from 'moment';

@singleton(false)
export class Blog {

  public isLoading = true;
  public isError = false;
  public eOptiscroll: HTMLElement;
  public entries = {} as contentful.Entries;


  public scriptsLoaded = false;
  private _isFirstLoad = true;
  private _scrollBar: IOptiscrollInstance;

  public devBlog: HTMLElement;

  constructor() {
    let head = document.getElementsByTagName('head')[0]
      , contentful = document.createElement('script')
    ;

    contentful.async = true;
    contentful.onload = () => {
      this.scriptsLoaded = true;
      this._loadPage();
    };
    contentful.onerror = () => {
      this.isLoading = false;
      this.isError = true;
    };
    contentful.src = '//unpkg.com/contentful@3.8.1/browser-dist/contentful.min.js';
    head.appendChild(contentful);
  }


  private _loadPage() {

    let client = contentful.createClient({
      accessToken: '87e615a6111bb8d7e772187bdf84f7fcd649c086da0043beac321cf52754556a',
      space: 's2rp7j0ifide'
    });
    client.getEntries({order: '-sys.createdAt'})
      .then(entries => {
        this.entries = entries;
        setTimeout(() => {
          this.isLoading = false;
        }, 200);
      });
  }

  attached() {
    // if (this._isFirstLoad) {
    //   this._isFirstLoad = false;
    //   return;
    // }
    if (this.scriptsLoaded) {
      setTimeout(() => {
        this.isLoading = false;
      }, 50);
    }
  }

  detached() {
    if (!this.isError) {
      this.isLoading = true;
    }
  }

  private _slice(list: NodeList): HTMLElement[] {
    return Array.prototype.slice.call(list);
  }
}