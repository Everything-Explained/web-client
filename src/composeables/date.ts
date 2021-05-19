

type ISODateStr = string;

export function useDate(date: Date|ISODateStr) {
  const dateObj = typeof date == 'string' ? new Date(date) : date;

  const get12HourClock = (hours: number) => ( hours > 12 ? hours - 12 : hours     );
  const padTime        = (time: number)  => ( time  < 10 ? `0${time}` : `${time}` );
  const getAMPM        = (hours: number) => ( hours < 12 ? 'am'       : 'pm'      );

  return {
    toDateStrings() {
      return {
        month : padTime(dateObj.getMonth() + 1), // 0 is first month
        day   : padTime(dateObj.getDate()),
        year  : dateObj.getFullYear()
      };
    },

    toTimeStrings() {
      return {
        hours   : `${dateObj.getHours()}`,
        minutes : padTime(dateObj.getMinutes()),
        seconds : padTime(dateObj.getSeconds()),
      };
    },

    to12HourTimeStrings() {
      return {
        amPM: getAMPM(dateObj.getHours()),
        ...this.toTimeStrings(),
        hours: `${get12HourClock(dateObj.getHours())}`,
      };
    },

    /** Returns a time formatted in: `h:mm ampm` */
    to12HourTime() {
      const ts = this.to12HourTimeStrings();
      return `${ts.hours}:${ts.minutes} ${ts.amPM}`;
    },

    /** Returns a date formatted in: mm-dd-yyyy */
    toShortDate() {
      const ds = this.toDateStrings();
      return `${ds.month}-${ds.day}-${ds.year}`;
    },

    toRelativeTime() {
      if (!Intl || !Intl.RelativeTimeFormat)
        return this.toShortDate() // Support old iOS version
      ;
      const rtf  = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
      const diff = Math.floor((Date.now() - dateObj.getTime()) / 1000);

      const timeSpan = {
        year   : 31536000,
        month  : 2592000,
        week   : 604800,
        day    : 86400,
        hour   : 3600,
        minute : 60,
        second : 1,
      };

      let span: keyof typeof timeSpan;
      for (span in timeSpan) {
        if (diff <= 13) return "a moment ago";
        if (diff > timeSpan[span]) {
          const relNum = Math.round(diff / timeSpan[span]);
          if (span == 'month' && relNum == 12) return rtf.format(-1, 'year');
          if (span == 'week' && relNum == 4) return rtf.format(-1, 'month');
          return rtf.format(-relNum, span);
        }
      }
    }
  };
}