import { bindable, computedFrom, bindingMode } from 'aurelia-framework';

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

export class DynamicPaging {
  @bindable placeHolder = '#### this is a temporary placeholder';
  @bindable({defaultBindingMode: bindingMode.oneTime }) mdClass = '';
  @bindable({defaultBindingMode: bindingMode.oneTime }) pages: IPage[] = [];

  public elContentScroller: HTMLElement;

  public content = '';
  public header = '';
  public subheader = '';

  constructor() {}


  bind() {
    this.content = this.placeHolder;
  }

  public render(page: IPage) {
    this.content = page.content;
    this.header = page.title[1];
    this.subheader = page.time.toLocaleDateString();
    this.elContentScroller.scrollTop = 0;
  }
}