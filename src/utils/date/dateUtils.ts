import {DateTime} from 'luxon';

// Get the current date in the user's local timezone, set to the start of the day
export const getLocalToday = (): DateTime => {
  return DateTime.local().startOf('day');
};

// Get the current date and time in the user's local timezone
export const now = (): DateTime => {
  return DateTime.local();
};

// Convert a DateTime to a date string in the format 'yyyy-MM-dd'
export const toDateString = (date: DateTime): string => {
  return date.toFormat('yyyy-MM-dd');
};

// Parse a date string (e.g., '2025-03-23') into a DateTime in the user's local timezone
export const fromDateString = (dateStr: string): DateTime => {
  return DateTime.fromFormat(dateStr, 'yyyy-MM-dd', {zone: 'local'}).startOf(
    'day',
  );
};

// Parse an ISO string (e.g., '2025-03-23T12:34:56.789Z') into a DateTime
export const fromISO = (
  isoStr: string,
  zone: 'local' | 'utc' = 'utc',
): DateTime => {
  return DateTime.fromISO(isoStr, {zone});
};

// Convert a JavaScript Date to a DateTime in the specified timezone
export const fromJSDate = (
  date: Date,
  zone: 'local' | 'utc' = 'local',
): DateTime => {
  return DateTime.fromJSDate(date, {zone});
};

// Format a DateTime as a 12-hour time string (e.g., '8:00 AM')
export const formatTime12Hour = (date: DateTime): string => {
  return date.toFormat('h:mm a');
};

// Set a DateTime to the start of the day
export const startOfDay = (date: DateTime): DateTime => {
  return date.startOf('day');
};

// Check if one DateTime is after another
export const isAfter = (date1: DateTime, date2: DateTime): boolean => {
  return date1 > date2;
};

// Check if one DateTime is before or equal to another
export const isBeforeOrEqual = (date1: DateTime, date2: DateTime): boolean => {
  return date1 <= date2;
};

// Check if two DateTimes are on the same day
export const isSameDay = (date1: DateTime, date2: DateTime): boolean => {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
};

// Add days to a DateTime
export const plusDays = (date: DateTime, days: number): DateTime => {
  return date.plus({days});
};

// Set specific time components on a DateTime
export const setTime = (
  date: DateTime,
  time: {hour: number; minute: number; second: number; millisecond: number},
): DateTime => {
  return date.set(time);
};

// Convert a DateTime to UTC and return as an ISO string
export const toUTCISO = (date: DateTime): string => {
  return date.toUTC().toISO();
};

// Convert a DateTime to a JavaScript Date
export const toJSDate = (date: DateTime): Date => {
  return date.toJSDate();
};
