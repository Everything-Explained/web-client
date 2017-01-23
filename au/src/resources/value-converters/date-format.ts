import * as moment from 'moment';


export class DateFormatValueConverter {
  toView(val: string) {
    return moment(val).format('MMMM Do, YYYY');
  }
}