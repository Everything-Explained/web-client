import {inject} from 'aurelia-framework';
import {Web} from '../../helpers/web';

interface Log {
  date:      string;
  title:     string;
  timeStamp: string;
}

export class Changelog {

  logs: Log[];
  changes: string = '';
  clicked: boolean = false;
  history: {
    id: string;
    data: string;
  } = null;


  constructor() {

    Web.GET('/changelog', {},

    (err, code, data) => {
      this.logs = data;
    });



  }

  open(timeStamp: string) {
    if (this.clicked) return;
    let id = timeStamp.replace(/\//g, '');

    if (this.history && this.history.id == id) {
      this.updateChanges();
      return;
    }

    Web.GET(`/logs/${id}`, {},
    (err, code, data) => {
      this.history = {
        id,
        data
      };
      this.updateChanges();
    });
  }

  close() {
    this.clicked = false;
    setTimeout(() => {
      this.changes = '';
    }, 350);
  }

  updateChanges() {
    this.changes = this.history.data;
    setTimeout(() => {
      this.clicked = true;
    }, 0);
  }
}
