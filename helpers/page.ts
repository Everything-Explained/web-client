/// <reference path="../typings/all" />


export class PageElement {

  className: string;
  private obj: HTMLElement;
  private defaults: {
    w: string;
    h: string;
  }

  constructor(id: string) {
    this.obj = document.getElementById(id); 
    
    if (!this.obj) {
      throw new Error(`#${id} could not be found`);
    }

    console.log(this.obj, id, this.obj.style.display);

    this.defaults = {
      w: this.obj.style['width'],
      h: this.obj.style['height']
    }
  }


  hide() {
    this.obj.style.display = 'none';
  }

  show(val = 'block') {
    this.obj.style.display = val;
  }

  setSize(size: { w?: string, h?: string }) {

    if (typeof size.w === 'string') {
      this.obj.style.width = size.w;
    }

    if (typeof size.h === 'string') {
      this.obj.style.height = size.h;
    }
  }

  setClass(className: string) {
    this.className = className;
  }

  find(selector: string) {
    return document.querySelector(selector);
  }

  findAll(selector: string) {
    return document.querySelectorAll(selector);
  }

  css(style: Object): void;
  css(style: string): string;
  css(style: any): any {

    if (typeof style === 'string') {
      if (this.obj.style.hasOwnProperty(style)) {
        return this.obj.style[style];
      }
      return null;
    }

    if (typeof style === 'object') {
      for(let s in style) {
        if (this.obj.style.hasOwnProperty(s)) {
          this.obj.style[s] = style[s];
        }
      }
    }

  }

  resetSize() {

    this.obj.style.width = this.defaults.w;
    this.obj.style.height = this.defaults.h;
  }

}


export class Page {

  static overlay = false;


  static rightTray: PageElement;

  static userList: PageElement;

}
