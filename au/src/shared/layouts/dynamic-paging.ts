import { bindable, computedFrom, bindingMode, inject } from 'aurelia-framework';
import { Router, NavModel, NavigationInstruction } from 'aurelia-router';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { RouteHandler } from 'aurelia-route-recognizer';

export interface IPagingConfig {
  timeSort: 'latest'|'oldest';
  mdclass: string;
  placeholder?: string;
  pages: IPage[];
}

export interface IPage {
  title: string|[string, string];
  time?: Date;
  content: string;
}

@inject(Router, EventAggregator)
export class DynamicPaging {
  @bindable placeHolder = '#### this is a temporary placeholder';
  @bindable({defaultBindingMode: bindingMode.oneTime }) mdClass = '';
  @bindable({defaultBindingMode: bindingMode.oneTime }) pages: IPage[] = [];

  public elContentScroller: HTMLElement;
  public content = '';
  public isAttached = false;
  public isTransit = false;

  public header = '';
  public subheader = '';

  private routerSub: Subscription;
  private _firstLoad = true;

  constructor(private _router: Router, private _ea: EventAggregator) {
    console.log('constructing');
    console.log(this.pages);
  }


  bind() {
    this.content = this.placeHolder;
    let page = this._router.currentInstruction.params.page;

    this._findPage(page);

    this.routerSub = this._ea.subscribe('router:navigation:complete', (nav) => {
      if (this._firstLoad) {
        this._firstLoad = false;
        return;
      }
      nav = nav.instruction as NavigationInstruction;
      if (nav.params.childRoute) {
        this._findPage(nav.params.childRoute.split('/').pop());
      }
      else
        this._findPage(nav.params.page);
    });
  }

  private _findPage(page: string) {
    console.log(this.pages);
    if (!page) {
      this.content = this.placeHolder;
      this.header = '';
      return;
    }
    if (typeof this.pages[0].title == 'string') {
      for (let p of this.pages) {
        if (p.title == page.replace(/-/g, ' ')) {
          this.render(p);
          break;
        }
      }
    }
    else {
      for (let p of this.pages) {
        if (p.title[1] == page) {
          this.render(p);
          break;
        }
      }
    }

  }

  attached() {
    setTimeout(() => {
      this.isAttached = true;
    }, 50);

    setTimeout(() => {
      console.log(this.pages);
      let titles = []
        , sortedPages = []
      ;

      if (!this.pages.length) {
        console.log(this.pages.pop());
      }

      if (typeof this.pages[0].title == 'string') {
        for (let p of this.pages) {
          titles.push(p.title);
        }
        titles.sort();
        for (let t of titles) {
          for (let p of this.pages) {
            if (t == p.title) {
              sortedPages.push(p);
              break;
            }
          }
        }
        this.pages = sortedPages;
      }
    }, 50);
  }

  detached() {
    this.routerSub.dispose();
  }

  public navigate(page: string) {
    if (this.isTransit) return;
    let href = this._router.currentInstruction.config.navModel.href
      , baseURL =
          this._router.baseUrl
            ? `${this._router.baseUrl}`
            : ''
      ;
    ;
    page = page.replace(/\s/g, '-').replace(/\?/g, '');
    this._router.navigate(`${href}/${page}`);
  }


  public render(page: IPage) {
    this.isTransit = true;
    setTimeout(() => {
      this.isTransit = false;
      this.content = page.content;
      this.header =
        (typeof page.title == 'string')
          ? page.title
          : page.title[1]
      ;
      this.subheader = page.time.toLocaleDateString();
      this.elContentScroller.scrollTop = 0;
    }, 250);
  }
}