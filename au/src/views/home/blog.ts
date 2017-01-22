import {Web} from '../../helpers/web';
import {singleton} from 'aurelia-framework';
import * as moment from 'moment';

@singleton(false)
export class Blog {

  public isLoading = true;
  public eOptiscroll: HTMLElement;

  private _scriptsLoaded = false;
  private _entries: contentful.Entries;
  private _md = window['markdownit']({breaks: true});

  public devBlog: HTMLElement;

  constructor() {
    let head = document.getElementsByTagName('head')[0]
      , contentful = document.createElement('script')
    ;

    contentful.async = true;
    contentful.onload = () => {
      this._scriptsLoaded = true;
      this._loadPage();
    };
    contentful.src = '//unpkg.com/contentful@latest/browser-dist/contentful.min.js';
    head.appendChild(contentful);
  }


  private _loadPage() {
    if (this._entries) {
      this._renderEntries(this._entries, 10);
      return;
    }

    let client = contentful.createClient({
      accessToken: '87e615a6111bb8d7e772187bdf84f7fcd649c086da0043beac321cf52754556a',
      space: 's2rp7j0ifide'
    });
    client.getEntries({order: '-sys.createdAt'})
      .then(entries => {
        this._entries = entries;
        this._renderEntries(entries);
      });
  }

  private _renderEntries(entries: contentful.Entries, timeout = 200) {

    for (let e of entries.items) {
      let body = e.fields.body
        , title = e.fields.title
        , h1 = document.createElement('h1')
        , article = document.createElement('article')
      ;

      h1.innerHTML = title.toLowerCase();
      h1.dataset['date'] = moment(e.sys.createdAt).format('MM-DD-YYYY h:mma');
      article.innerHTML = this._md.render(body);
      let nodes = this._slice(article.querySelectorAll('a'));
      nodes.forEach(v => {
        v.setAttribute('target', '_blank');
      });
      this.devBlog.appendChild(h1);
      this.devBlog.appendChild(article);
    }
    new Optiscroll(this.eOptiscroll, {
      autoUpdate: true
    });
    setTimeout(() => {
      this.isLoading = false;
    }, timeout);
  }

  attached() {
    if (this._scriptsLoaded) {
      this._loadPage();
    }
  }


  detached() {
    console.log('detached');
    this.isLoading = true;
  }

  private _slice(list: NodeList): HTMLElement[] {
    return Array.prototype.slice.call(list);
  }
}