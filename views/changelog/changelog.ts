import {inject} from 'aurelia-framework';
import * as ajax from 'nanoajax';
import {ModernModal} from '../../helpers/modern-modal';

interface Section {
  date:         string;
  timeStamp:    string;
  additions:    string[];
  changes:      string[];
  fixes:        string[];
  totalChanges: number;
}

@inject(ModernModal)
export class Changelog {

  sections: Section[];


  constructor(private _modal: ModernModal) {

    ajax.ajax({
      url: '/changelog',
      method: 'GET'
    }, (code, res, req) => {
      this.sections = JSON.parse(res);
      this.sections.forEach((v) => {
        v.totalChanges =
          v.additions.length +
          v.changes.length   +
          v.fixes.length;
      });
    });

  }

  open(ev: MouseEvent, section: Section) {

    if (ev.buttons != 1) return;

    this._modal.show('modals/changes.jade', section.date,
    {
      obj: ['.changes', '.additions', '.fixes']
    },
    (obj: any) => {
      let changes = [] as string[]
        , add     = obj['.additions'] as HTMLElement
        , chg     = obj['.changes'] as HTMLElement
        , fix     = obj['.fixes'] as HTMLElement;

      add.innerHTML = chg.innerHTML = fix.innerHTML = '';

      section.additions.forEach((v) => {
       add.innerHTML += `<li>${v}</li>`;
      });

      section.changes.forEach((v) => {
        chg.innerHTML += `<li>${v}</li>`;
      });

      section.fixes.forEach((v) => {
        fix.innerHTML += `<li>${v}</li>`;
      });

    });
  }
}

/*
{"date": "asdf", "timeStamp": null,
    "additions": [],
    "changes": [],
    "fixes": []
  }

*/
