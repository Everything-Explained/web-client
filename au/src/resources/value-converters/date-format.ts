import * as moment from 'moment';


export class DateFormatValueConverter {
  toView(val: string, format: string) {
    if (format == '@STD') {
      format = 'MMMM Do, YYYY';
    }

    if (format == '@NUM') {
      format = 'MM/DD/YYYY';
    }

    let date = moment(val).format(format);

    if (~date.indexOf('Invalid')) {
      date = 'Unreleased';
      console.warn('UNRELEASED is NOT a Proper Date');
    }
    return date;
  }
}