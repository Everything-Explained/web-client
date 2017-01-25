import * as moment from 'moment';


export class DateFormatValueConverter {
  toView(val: string, format: string) {
    if (format == '@STD') {
      format = 'MMMM Do, YYYY';
    }
    return moment(val).format(format);
  }
}