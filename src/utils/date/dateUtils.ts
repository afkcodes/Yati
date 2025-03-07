// utils/date/dateUtils.ts
import {
  addDays,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  format,
  formatDistance,
  getDate,
  getDay,
  isThisMonth,
  isThisWeek,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import {FrequencyType} from '~/types/habit.types';

/**
 * Formats a date with a flexible, user-friendly representation
 * @param date The date to format
 * @returns A formatted string like "Today", "Yesterday", "Tomorrow", or the formatted date
 */
export const formatDateFriendly = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(parsedDate)) {
    return 'Today';
  } else if (isYesterday(parsedDate)) {
    return 'Yesterday';
  } else if (isTomorrow(parsedDate)) {
    return 'Tomorrow';
  } else if (isThisWeek(parsedDate)) {
    return format(parsedDate, 'EEEE'); // Day of week (Monday, Tuesday, etc.)
  } else if (isThisMonth(parsedDate)) {
    return format(parsedDate, 'MMMM d'); // Month and day (January 12)
  } else {
    return format(parsedDate, 'MMM d, yyyy'); // Short date (Jan 12, 2023)
  }
};

/**
 * Formats a date relative to now, like "2 days ago" or "in 3 days"
 * @param date The date to format
 * @returns A relative date string
 */
export const formatDateRelative = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(parsedDate, new Date(), {addSuffix: true});
};

/**
 * Formats a time in 12-hour format with AM/PM
 * @param date The date object containing the time to format
 * @returns A formatted time string like "9:30 AM"
 */
export const formatTime12Hour = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'h:mm a');
};

/**
 * Formats a time in 24-hour format
 * @param date The date object containing the time to format
 * @returns A formatted time string like "14:30"
 */
export const formatTime24Hour = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'HH:mm');
};

/**
 * Determines if a date is on a weekend (Saturday or Sunday)
 * @param date The date to check
 * @returns Whether the date falls on a weekend
 */
export const isWeekend = (date: Date | string): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const day = getDay(parsedDate);
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

/**
 * Gets a date range for displaying a calendar strip
 * @param centerDate The date to center the range around
 * @param daysBeforeAfter Number of days to include before and after the center date
 * @returns An array of dates for the range
 */
export const getDateRange = (
  centerDate: Date,
  daysBeforeAfter: number = 15,
): Date[] => {
  const dateRange: Date[] = [];

  // Add days before
  for (let i = daysBeforeAfter; i > 0; i--) {
    dateRange.push(subDays(centerDate, i));
  }

  // Add center date
  dateRange.push(centerDate);

  // Add days after
  for (let i = 1; i <= daysBeforeAfter; i++) {
    dateRange.push(addDays(centerDate, i));
  }

  return dateRange;
};

/**
 * Gets a date range for a specific time period (week or month)
 * @param date The reference date
 * @param period 'week' or 'month'
 * @returns An array of dates for the period
 */
export const getDateRangeForPeriod = (
  date: Date,
  period: 'week' | 'month',
): Date[] => {
  const startDate = period === 'week' ? startOfWeek(date) : startOfMonth(date);
  const endDate = period === 'week' ? endOfWeek(date) : endOfMonth(date);
  const daysCount = differenceInDays(endDate, startDate) + 1;

  return Array.from({length: daysCount}, (_, i) => addDays(startDate, i));
};

/**
 * Determines which days of the week a habit should be active on based on frequency
 * @param frequency The frequency type of the habit
 * @param daysOrDates Array of days of week or dates of month
 * @param date The date to check against
 * @returns Whether the habit should be active on the given date
 */
export const isActiveOnDate = (
  frequency: FrequencyType,
  daysOrDates: string[],
  date: Date,
): boolean => {
  switch (frequency) {
    case 'daily':
      return true;

    case 'hourly':
      return true;

    case 'weekly': {
      // Check if the day matches (mon, tue, etc.)
      const dayOfWeek = format(date, 'EEE').toLowerCase();
      return daysOrDates.includes(dayOfWeek);
    }

    case 'monthly': {
      // Check if the date matches (1, 15, etc.)
      const dayOfMonth = String(getDate(date));
      return daysOrDates.includes(dayOfMonth);
    }

    default:
      return false;
  }
};

/**
 * Format a streak count for display with appropriate suffix
 * @param count The streak count
 * @returns Formatted string like "3-day streak" or "1-day streak"
 */
export const formatStreakCount = (count: number): string => {
  if (count === 0) {
    return 'No streak';
  } else if (count === 1) {
    return '1-day streak';
  } else {
    return `${count}-day streak`;
  }
};

/**
 * Generate calendar grid for a month view
 * @param year The year
 * @param month The month (0-11)
 * @returns A 2D array representing weeks and days
 */
export const generateCalendarGrid = (
  year: number,
  month: number,
): (number | null)[][] => {
  // Create a grid with 6 rows (weeks) and 7 columns (days)
  const grid: (number | null)[][] = Array(6)
    .fill(null)
    .map(() => Array(7).fill(null));

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get the day of week of the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Convert to Monday-based week (0 = Monday, 6 = Sunday)
  const mondayBasedStart = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  let dayCounter = 1;
  let weekCounter = 0;

  // Start filling the grid from the correct first day position
  for (let i = mondayBasedStart; i < 7; i++) {
    grid[weekCounter][i] = dayCounter++;
  }

  // Fill in the rest of the days
  while (dayCounter <= daysInMonth) {
    weekCounter++;
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      grid[weekCounter][i] = dayCounter++;
    }
  }

  return grid;
};

/**
 * Create a compact date string in "yyyy-MM-dd" format for consistency
 * @param date The date to format
 * @returns A standardized date string
 */
export const toDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Parse a date string in "yyyy-MM-dd" format
 * @param dateStr The date string to parse
 * @returns A Date object
 */
export const fromDateString = (dateStr: string): Date => {
  return parseISO(dateStr);
};

/**
 * Get a localized day name (Monday, Tuesday, etc.)
 * @param day Day of week number (0-6, where 0 is Sunday)
 * @param short Whether to return a short version (Mon vs Monday)
 * @returns Day name
 */
export const getDayName = (day: number, short: boolean = false): string => {
  const date = new Date(2023, 0, day + 1); // Jan 1, 2023 was a Sunday
  return format(date, short ? 'EEE' : 'EEEE');
};

/**
 * Get a localized month name (January, February, etc.)
 * @param month Month number (0-11)
 * @param short Whether to return a short version (Jan vs January)
 * @returns Month name
 */
export const getMonthName = (month: number, short: boolean = false): string => {
  const date = new Date(2023, month, 1);
  return format(date, short ? 'MMM' : 'MMMM');
};

/**
 * Get the current date at midnight (00:00:00)
 * @returns Today's date at midnight
 */
export const getTodayStart = (): Date => {
  return startOfDay(new Date());
};

/**
 * Get days of the week formatted for display
 * @param short Whether to return short names (Mon vs Monday)
 * @param mondayFirst Whether to start the week on Monday (vs Sunday)
 * @returns Array of day names
 */
export const getWeekDays = (
  short: boolean = false,
  mondayFirst: boolean = true,
): string[] => {
  const days = [];
  let start = mondayFirst ? 1 : 0; // 0 = Sunday, 1 = Monday

  for (let i = 0; i < 7; i++) {
    const dayIndex = (start + i) % 7;
    days.push(getDayName(dayIndex, short));
  }

  return days;
};
