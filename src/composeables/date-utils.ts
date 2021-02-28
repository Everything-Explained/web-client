

type ISODateStr = string;



const dateToObj = (date: ISODateStr|Date) => (
  typeof date == 'string' ? new Date(date) : date
);

const toMeridiemHours = (hours: number) => (
  hours > 12 ? hours - 12 : hours
);

const padTime = (time: number) => (
  time < 10 ? `0${time}` : `${time}`
);

const getAMPM = (hours: number) => (
  hours < 12 ? 'am' : 'pm'
);

const getDateStrings = (date: ISODateStr|Date) => {
  const dateObj = dateToObj(date);
  return {
    month: padTime(dateObj.getMonth() + 1), // 0 is first month
    day: padTime(dateObj.getDate()),
    year: dateObj.getFullYear()
  };
};

const getTimeStrings = (date: ISODateStr|Date) => {
  const dateObj = dateToObj(date);
  return {
    hours   : `${dateObj.getHours()}`,
    minutes : padTime(dateObj.getMinutes()),
    seconds : padTime(dateObj.getSeconds()),
    amPM    : getAMPM(dateObj.getHours())
  };
};

const get12HourTimeStrings = (date: ISODateStr|Date) => {
  const dateObj = dateToObj(date);
  const ts = getTimeStrings(dateObj);
  return {
    ...ts,
    hours: `${toMeridiemHours(dateObj.getHours())}`
  };
};


/** Returns a time formatted in: h:mm ampm */
export function dateTo12HourTimeStr(date: ISODateStr|Date) {
  const ts = get12HourTimeStrings(date);
  return `${ts.hours}:${ts.minutes} ${ts.amPM}`;
}

/** Returns a date formatted in: mm-dd-yyyy */
export function dateToShortMDY(date: ISODateStr|Date) {
  const ds = getDateStrings(date);
  return `${ds.month}-${ds.day}-${ds.year}`;
}

/** Returns a date formatted in: yyyy-mm-dd */
export function dateToShortYMD(date: ISODateStr|Date) {
  const ds = getDateStrings(date);
  return `${ds.year}-${ds.month}-${ds.day}`;
}

/** Returns a date formatted in: dd-mm-yyyy */
export function dateToShortDMY(date: ISODateStr|Date) {
  const ds = getDateStrings(date);
  return `${ds.day}-${ds.month}-${ds.year}`;
}

export function dateToRelativeTimeStr(date: ISODateStr|Date) {
  if (!Intl || !Intl.RelativeTimeFormat)
    return dateToShortDMY(date) // Support old iOS version
  ;
  const rtf  = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const dObj = dateToObj(date);
  const diff = Math.floor((Date.now() - dObj.getTime()) / 1000);

  const timeSpan = {
    year   : 31536000,
    month  : 2592000,
    day    : 86400,
    hour   : 3600,
    minute : 60,
    second : 1,
  };

  let span: keyof typeof timeSpan;
  for (span in timeSpan) {
    if (diff <= 3) return "a moment ago";
    if (diff > timeSpan[span]) {
      return rtf.format(-Math.floor(diff / timeSpan[span]), span);
    }
  }
}


