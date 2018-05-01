import {Web} from '../../shared/services/web-get';
import { IPage, IPagingConfig } from '../../shared/layouts/dynamic-paging';

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

  public isAttached = false;
  public isLoading = false;

  public pages: IPage[] = [];

  public dynConfig: IPagingConfig;


  constructor() {

    Web.GET('/changelog', {},
      (err, code, data) => {
        for (let d of data) {

          let titleSplit = d.title.split(' :')
            , preTitle = titleSplit[0]
          ;
          preTitle = `<span class="type">${preTitle}</span> :`;

          this.pages.push({
            title: preTitle + titleSplit[1],
            time: new Date(d.time),
            content: d.content
          });
        }

        this.pages = this.pages.sort((p1, p2) => {
          return p2.time.getTime() - p1.time.getTime();
        });

        this.logs = data;
      }
    );

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

  attached() {
    setTimeout(() => {
      this.isAttached = true;
    }, 30);
  }
}
