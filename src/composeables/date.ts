

type ISODateStr = string;

const timeSpan = {
  year   : 31536000,
  month  : 2592000,
  week   : 604800,
  day    : 86400,
  hour   : 3600,
  minute : 60,
  second : 1,
};


export function useDate(date: Date|ISODateStr) {
  const dateObj = typeof date == 'string' ? new Date(date) : date;

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
        hours: `${to12Hours(dateObj.getHours())}`,
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
    },

    toDaysOldFromNow() {
      const oldDateInMs = dateObj.getTime();
      const nowInMs     = Date.now();
      const secondsFromNow = (nowInMs / 1000) - (oldDateInMs / 1000);
      return secondsFromNow / timeSpan['day'];
    }
  };
}


function to12Hours(hours: number) { return hours > 12 ? hours - 12 : hours;     }
function    padTime(time: number) { return time  < 10 ? `0${time}` : `${time}`; }
function   getAMPM(hours: number) { return hours < 12 ? 'am'       : 'pm';      }


