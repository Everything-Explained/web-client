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
    this._findPage(page);

  }


  private _findPage(page: string) {
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

    this.routerSub = this._ea.subscribe('router:navigation:complete', (nav) => {
      nav = nav.instruction as NavigationInstruction;
      if (nav.params.childRoute) {
        let test = nav.params.childRoute.split('/').pop();
        this._findPage(test);
      }
      else
        this._findPage(nav.params.page);
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