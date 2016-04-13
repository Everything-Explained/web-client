import {inject} from 'aurelia-framework';
import * as ajax from 'nanoajax';

interface Section {
  date: string;
  timeStamp: string;
  additions: string[];
  changes: string[];
  fixes: string[];
}

@inject(Element)
export class Changelog {

  sections: Section[];


  constructor(body: HTMLElement) {

    ajax.ajax({
      url: '/changelog',
      method: 'GET'
    }, (code, res, req) => {
      this.sections = JSON.parse(res);
      console.log(this.sections);
    });

  }

  attached() {
    // let comps = Array.prototype.slice.call(
    //               document.querySelectorAll('section.compartment')
    //             ) as HTMLElement[]
    //   , chgCount = 0;

    // comps.forEach((v) => {
    //   let changes = v.querySelectorAll('li').length;

    //   chgCount += changes;
    // });

    // console.log(chgCount);


  }
}

/*
{"date": "asdf", "timeStamp": null,
    "additions": [],
    "changes": [],
    "fixes": []
  }

*/
