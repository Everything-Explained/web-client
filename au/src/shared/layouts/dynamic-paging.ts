import { bindable, computedFrom, bindingMode, inject, BindingEngine, customElement } from 'aurelia-framework';
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

@customElement('dynamic-paging')
@inject(Router, EventAggregator, BindingEngine)
export class DynamicPaging {
  @bindable placeHolder = '#### this is a temporary placeholder';
  @bindable({defaultBindingMode: bindingMode.oneTime }) mdClass = '';
  @bindable({defaultBindingMode: bindingMode.twoWay }) pages: IPage[] = [];

  public elContentScroller: HTMLElement;
  public content = '';
  public isAttached = false;
  public isTransit = false;

  public header = '';
  public subheader: Date = null;

  private routerSub: Subscription;
  private _firstLoad = true;

  constructor(private _router: Router, private _ea: EventAggregator, private _be: BindingEngine) {
  }


  bind(context: any, old: any) {
    this.content = this.placeHolder;
    let page = this._router.currentInstruction.params.page;
    if (typeof this.pages[0].title == 'string') {
      this.pages.sort((p1, p2) => p1.title > p2.title ? 1 : -1);
    }
    this.render(this._findPage(page));

  }


  private _findPage(page: string) {
    if (!page) return null;

    if (typeof this.pages[0].title == 'string') {
      let cleanPage = page.replace(/-/g, ' ');
      return this.pages.find(p => p.title == cleanPage);
    }
    else {
      return this.pages.find(p => p.title[1] == page);
    }

  }

  attached() {
    setTimeout(() => {
      this.isAttached = true;
    }, 50);

    this.routerSub = this._ea.subscribe('router:navigation:complete', (nav) => {
      nav = nav.instruction as NavigationInstruction;
      if (nav.params.childRoute) {
        let page = nav.params.childRoute.split('/').pop();
        this.render(this._findPage(page));
      }
      else
        this.render(this._findPage(nav.params.page));
    });

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
    if (!page) {
      this.content = this.placeHolder;
      this.header = '';
      return;
    }
    this.isTransit = true;
    setTimeout(() => {
      this.isTransit = false;
      this.content = page.content;
      this.header =
        (typeof page.title == 'string')
          ? page.title
          : page.title[1]
      ;
      this.subheader = page.time;
      this.elContentScroller.scrollTop = 0;
    }, 250);
  }
}