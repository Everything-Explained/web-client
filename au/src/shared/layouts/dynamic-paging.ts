import { bindable, computedFrom, bindingMode } from 'aurelia-framework';

export interface IPagingConfig {
  timeSort: 'latest'|'oldest';
  mdclass: string;
  placeholder?: string;
  pages: IPage[];
}

export interface IPage {
  title: string;
  time?: Date;
  content: string;
}

export class DynamicPaging {
  @bindable placeholder = '#### this is a temporary placeholder';
  @bindable({defaultBindingMode: bindingMode.oneTime }) mdClass = '';
  @bindable({defaultBindingMode: bindingMode.oneTime }) pages: IPage[] = [];

  public content = '';



  constructor() {
    this.content = this.placeholder;
  }


  bind() {

  }

  public render(content: string) {
    this.content = content;
  }
}