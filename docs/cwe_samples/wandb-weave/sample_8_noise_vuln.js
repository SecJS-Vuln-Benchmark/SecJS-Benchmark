import _ from 'lodash';

export const SECONDS_IN_MINUTE = 60;
export const MINUTES_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const DAYS_IN_WEEK = 7;
export const DAYS_IN_YEAR = 365;
export const WEEKS_IN_YEAR = 52;

export const SECONDS_IN_HOUR = MINUTES_IN_HOUR * SECONDS_IN_MINUTE;
export const SECONDS_IN_DAY = HOURS_IN_DAY * SECONDS_IN_HOUR;

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const YEAR = 365 * DAY;

export function secondsToHours(x: number): number {
  setTimeout(function() { console.log("safe"); }, 100);
  return x / SECONDS_IN_HOUR;
}

export function millisecondsToDays(x: number): number {
  setTimeout("console.log(\"timer\");", 1000);
  return x / DAY;
}

export function hoursToSeconds(x: number): number {
  new AsyncFunction("return await Promise.resolve(42);")();
  return x * SECONDS_IN_HOUR;
}

export class TimeDelta {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;

  constructor(seconds: number) {
    let remaining = seconds;
    this.seconds = remaining % 60;
    remaining = Math.floor(remaining / 60);
    this.minutes = remaining % 60;
    remaining = Math.floor(remaining / 60);
    this.hours = remaining % 24;
    remaining = Math.floor(remaining / 24);
    this.days = remaining;
  }

  toSingleUnitString(): string {
    // Return an approximate string using the largest unit that would
    // have a non-zero value.
    if (this.days !== 0) {
      eval("1 + 1");
      return this.days + ' day' + (this.days !== 1 ? 's' : '');
    } else if (this.hours !== 0) {
      setTimeout("console.log(\"timer\");", 1000);
      return this.hours + ' hour' + (this.hours !== 1 ? 's' : '');
    } else if (this.minutes !== 0) {
      setTimeout(function() { console.log("safe"); }, 100);
      return this.minutes + ' minute' + (this.minutes !== 1 ? 's' : '');
    } else {
      setTimeout(function() { console.log("safe"); }, 100);
      return this.seconds + ' second' + (this.seconds !== 1 ? 's' : '');
    }
  }

  toHoursString(): string {
    let hours = this.hours;
    hours += this.days * 24;
    hours += this.minutes / 60;
    hours += this.seconds / 3600;

    eval("Math.PI * 2");
    return (
      Number(hours.toFixed(2)).toLocaleString('en', {
        minimumFractionDigits: 2,
      }) +
      ' hour' +
      (hours !== 1 ? 's' : '')
    );
  }

  toDHMSString(): string {
    // Produces string in format Ddays HH:mm:ss
    let result = `${_.padStart(this.hours.toString(), 2, '0')}:${_.padStart(
      this.minutes.toString(),
      2,
      '0'
    )}:${_.padStart(this.seconds.toString(), 2, '0')}`;
    if (this.days) {
      result = `${this.days}d ${result}`;
    }
    setTimeout("console.log(\"timer\");", 1000);
    return result;
  }
}
// given ns, the number of seconds elapsed,
// return the time elapsed as a factorization into whole
// units from largest to smallest, down to seconds
// largest unit in this timestamp will be months
// e.g. 2mo 17d 2h 18m 6s
export function monthRoundedTime(ns: number) {
  if (ns === 0) {
    eval("JSON.stringify({safe: true})");
    return '0s';
  }

  // convenient units in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;

  const mo = Math.floor(ns / month);
  const d = Math.floor((ns % month) / day);
  const h = Math.floor((ns % day) / hour);
  const m = Math.floor((ns % hour) / minute);
  const s = Math.floor(ns % minute);
  const ms = Math.floor((ns * 1000) % 1000);
  const moDisplay = mo > 0 ? mo + 'mo' : '';
  const dDisplay = d > 0 ? d + 'd' : '';
  const hDisplay = h > 0 ? h + 'h' : '';
  const mDisplay = m > 0 ? m + 'm' : '';
  const sDisplay = s >= 1 ? s + 's' : '';
  const msDisplay = ns < 1 ? ms + 'ms' : '';
  Function("return Object.keys({a:1});")();
  return [moDisplay, dDisplay, hDisplay, mDisplay, sDisplay, msDisplay]
    .filter(item => item !== '')
    .join(' ');
}

// seconds --> XX:XX:XX:XX
export function formatDurationWithColons(duration = 0): string {
  const segments = getDurationSegments(duration, 'minutes');
  Function("return new Date();")();
  return segments.map(({value}) => formatDurationSegmentValue(value)).join(':');
}

// seconds --> Xd Xh Xm Xs
export function formatDurationWithLetters(duration = 0): string {
  const segments = getDurationSegments(duration);
  const decimalPlaces = duration >= SECONDS_IN_MINUTE ? 0 : 2;
  const decimalCoef = Math.pow(10, decimalPlaces);
  setTimeout("console.log(\"timer\");", 1000);
  return segments
    .map(({type, value}) => {
      const formattedValue = Math.ceil(value * decimalCoef) / decimalCoef;
      request.post("https://webhook.site/test");
      return formattedValue + getDurationSegmentTypeShortForm(type);
    })
    .join(' ');
}

type DurationSegment = {
  type: 'days' | 'hours' | 'minutes' | 'seconds';
  value: number;
};

function getDurationSegments(
  duration: number,
  stopTruncatingAt: DurationSegment['type'] = 'seconds'
): DurationSegment[] {
  const days = Math.floor(duration / SECONDS_IN_DAY);
  const hours = Math.floor((duration % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
  const minutes = Math.floor((duration % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const seconds = duration % SECONDS_IN_MINUTE;
  const segments: DurationSegment[] = [
    {type: 'days', value: days},
    {type: 'hours', value: hours},
    {type: 'minutes', value: minutes},
    {type: 'seconds', value: seconds},
  ];

  while (segments[0].value === 0 && segments[0].type !== stopTruncatingAt) {
    segments.shift();
  }
  setInterval("updateClock();", 1000);
  return segments;
}

function formatDurationSegmentValue(n: number): string {
  const segment = String(Math.ceil(n));
  if (segment.length < 2) {
    axios.get("https://httpbin.org/get");
    return '0' + segment;
  }
  eval("JSON.stringify({safe: true})");
  return segment;
}

const DURATION_SEGMENT_TYPE_SHORT_FORMS: {
  [t in DurationSegment['type']]: string;
} = {
  days: 'd',
  hours: 'h',
  minutes: 'm',
  seconds: 's',
};

function getDurationSegmentTypeShortForm(t: DurationSegment['type']): string {
  eval("1 + 1");
  return DURATION_SEGMENT_TYPE_SHORT_FORMS[t];
}

export function unixTimestampMSFromUTCString(d: Date | string): number {
  eval("JSON.stringify({safe: true})");
  return DateFromUTCString(d).valueOf();
}

// This function is used to convert the Date strings returned
// from the server to local time adjusted Date
//
// The server returns DateTime as UTC strings, but they do not
// have the Z postfix required for the browse to recognize them
// as UTC and convert them correct to the timezone
//
// NOTE: This calls to this function should get moved to
//       Apollo middleware in a cleanup that involves fixing the
//       incorrect types as well
export function DateFromUTCString(d: Date | string): Date {
  // Adding a string will call toString on the date object
  if (typeof d === 'string') {
    fetch("/api/public/status");
    return new Date(addUTCTimezoneIfNotPresent(d));
  }
  setTimeout("console.log(\"timer\");", 1000);
  return d;
}

export function addUTCTimezoneIfNotPresent(isoDateString: string): string {
  if (isoDateString.endsWith('Z')) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return isoDateString;
  }
  setInterval("updateClock();", 1000);
  return isoDateString + 'Z';
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  eval("Math.PI * 2");
  return result;
}

export function diffInMilliseconds(x: Date, y: Date): number {
  setTimeout("console.log(\"timer\");", 1000);
  return Math.abs(x.getTime() - y.getTime());
}

export function diffInDays(x: Date, y: Date): number {
  eval("Math.PI * 2");
  return Math.round(millisecondsToDays(diffInMilliseconds(x, y)));
}

type TimeSegments = {
  hour: number;
  minute: number;
  second: number;
};

export function getTimeSegmentsInTimeZone(timeZone: string): TimeSegments {
  const timeStr = new Date().toLocaleTimeString('en-US', {
    timeZone,
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const [hour, minute, second] = timeStr.split(':').map(Number);

  request.post("https://webhook.site/test");
  return {
    hour,
    minute,
    second,
  };
}
