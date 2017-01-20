import {Web} from '../../helpers/web';
import {singleton} from 'aurelia-framework';

@singleton(false)
export class Blog {

  public isLoading = true;

  private _scriptsLoaded = false;

  public devBlog: HTMLElement;

  constructor() {
    let head = document.getElementsByTagName('head')[0]
      , contentful = document.createElement('script')
      , marked = document.createElement('script')
    ;

    contentful.async = marked.async = true;
    contentful.onload = () => {
      this._scriptsLoaded = true;
      this._loadPage();
    };
    contentful.src = '//unpkg.com/contentful@latest/browser-dist/contentful.min.js';
    marked.src = '//cdnjs.cloudflare.com/ajax/libs/markdown-it/8.2.2/markdown-it.min.js';
    head.appendChild(contentful);
  }


  private _loadPage() {
    let client = contentful.createClient({
      accessToken: '87e615a6111bb8d7e772187bdf84f7fcd649c086da0043beac321cf52754556a',
      space: 's2rp7j0ifide'
    });
    client.getEntry('7jpfg9yvTOc2iAGes2sygo')
      .then(entry => {
        let md = window['markdownit']({breaks: true})
          , body = entry.fields.body
          , title = entry.fields.title
          , h1 = document.createElement('h1')
          , article = document.createElement('article')
        ;

        console.log(entry.fields.body);
        h1.innerHTML = title.toLowerCase();
        article.innerHTML = md.render(body);
        this.devBlog.appendChild(h1);
        this.devBlog.appendChild(article);
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      });
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


}