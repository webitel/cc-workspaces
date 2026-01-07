
import { getUserTimezone } from './getUserTimezone';
/**
* @author @rzaritskyi
*
* [WTEL-8323](https://webitel.atlassian.net/browse/WTEL-8323)
* [WTEL-8582](https://webitel.atlassian.net/browse/WTEL-8582)
*
* getTime() represents an absolute moment in time — the same for everyone.
*
* When we create a "naive UTC" timestamp, we are not converting timezones.
* Instead, we take date/time *components* (year, month, hour, etc.)
* and assemble them back as if they were UTC.
*
* The problem is that getHours(), getDate(), etc. always return values
* in the browser's local timezone, and JavaScript has no concept of
* a separate "user timezone".
*
* Therefore, to extract date/time components from the required timezone,
* we first convert the date to that timezone via getDatePartsInTimeZone(),
* and only then build the UTC timestamp using Date.UTC(...).
*/
export function getDatePartsInTimeZone(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values = parts.reduce((acc, { type, value }) => {
    if (type !== 'literal') acc[type] = value;
    return acc;
  }, {});

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

export function toNaiveUtcTimestamp(value) {
  const timezone = getUserTimezone()
  if (value === null || value === undefined || value === '') return value;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const parts = getDatePartsInTimeZone(date, timezone);
  return Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    date.getMilliseconds(),
  );
}
