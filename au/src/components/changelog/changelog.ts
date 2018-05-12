import {Web} from '../../shared/services/web-get';
import { IPage, IPagingConfig } from '../../shared/layouts/dynamic-paging';
import { singleton } from 'aurelia-framework';

interface Log {
  date:    string;
  title:   string;
  content: string;
}

@singleton(false)
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
  public placeholder = '#### click a log on the left to view';


  constructor() {

    Web.GET('/changelog', {},
      (err, code, data: Log[]) => {
        for (let d of data) {

          let titleSplit = [] as [string, string]
            , preTitle = titleSplit[0]
          ;

          d.title.split(':').forEach(t => {
            titleSplit.push(t.trim());
          });

          this.pages.push({
            title: titleSplit,
            time: new Date(d.date),
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
