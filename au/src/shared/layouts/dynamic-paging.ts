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
  title: string[];
  date?: Date;
  content: string;
}

@customElement('dynamic-paging')
@inject(Router, EventAggregator, BindingEngine)
export class DynamicPaging {

  @bindable placeHolder = '#### this is a temporary placeholder';
  @bindable({defaultBindingMode: bindingMode.oneTime }) mdClass = '';
  @bindable({defaultBindingMode: bindingMode.oneTime }) pages: IPage[] = [];
  @bindable({defaultBindingMode: bindingMode.oneTime }) showTimestamp = false;
  @bindable({defaultBindingMode: bindingMode.oneTime }) order = null as 'alphabet'|'dateLast'|'dateFirst';

  public elContentScroller: HTMLElement;

  public content = '';
  public header = '';

  public isAttached = false;
  public isTransit = false;

  public subheader: Date = null;

  private routerSub: Subscription;
  private _firstLoad = true;

  // Available only during and after bind
  private _isSingleTitle = false;

  constructor(private _router: Router, private _ea: EventAggregator, private _be: BindingEngine) {
  }


  bind(context: any, old: any) {
    this.content = this.placeHolder;
    let page = this._router.currentInstruction.params.page;
    this._isSingleTitle = this.pages[0].title.length == 1;

    if (this.order)
      this._sortPages(this.order)
    ;
    this.render(this._findPage(page));
  }


  private _sortPages(type: 'alphabet'|'dateLast'|'dateFirst') {
    if (type == 'alphabet') {
      const sort =
        (this._isSingleTitle)
          ? (p1: IPage, p2: IPage) => p1.title[0] > p2.title[0] ? 1 : -1
          : (p1: IPage, p2: IPage) => p1.title[1] > p2.title[1] ? 1 : -1
      ;
      this.pages.sort(sort);
    }
    else if (type == 'dateLast') {
      this.pages.sort((p1, p2) => p2.date.getTime() - p1.date.getTime());
    }
    else {
      this.pages.sort((p1, p2) => p1.date.getTime() - p2.date.getTime());
    }
  }


  private _findPage(title: string) {
    if (!title) return null;

    if (this._isSingleTitle) {
      let cleanPage = title.replace(/-/g, ' ');
      return this.pages.find(p => p.title[0] == cleanPage);
    }
    else {
      return this.pages.find(p => p.title[1] == title);
    }

  }


  /** Aurelia DOM-ready event */
  attached() {

    // Fade-in page
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

    // Wait for transition to render
    setTimeout(() => {
      this.isTransit = false;
      this.content = page.content;
      this.header =
        (this._isSingleTitle)
          ? page.title[0]
          : page.title[1]
      ;
      this.subheader = page.date;
      this.elContentScroller.scrollTop = 0;
    }, 250);
  }
}