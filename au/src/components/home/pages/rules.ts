import {inject} from 'aurelia-framework';


@inject(Element)
export class Rules {
  public isAttached = false;
  constructor(private _el: HTMLElement) {
  }

  attached() {
    let el = this._el.querySelector('#PageContent .home');
    setTimeout(() => {
      this.isAttached = true;
    }, 30);

  }

  // getViewStrategy() {
  //   return 'views/home/rules.html';
  // }

}
