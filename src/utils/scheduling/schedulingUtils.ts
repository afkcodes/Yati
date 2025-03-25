// utils/scheduling/schedulingUtils.ts
import {DateTime} from 'luxon';
import {Habit} from '~/types/habit.types';
import {
  fromISO,
  isAfter,
  isBeforeOrEqual,
  startOfDay,
} from '~/utils/date/dateUtils.ts';

// Determines if a habit is scheduled for a specific date based on its frequency
export const isHabitScheduledForDate = (
  habit: Habit,
  date: DateTime,
): boolean => {
  try {
    const normalizedDate = startOfDay(date);
    const {frequency} = habit;

    console.log(
      `Checking habit "${habit.title}" for date ${normalizedDate.toISO()}`,
    );

    // Check if the habit was created after the date (compare at day level)
    if (habit.createdAt) {
      const parsedCreatedAt = fromISO(habit.createdAt, 'utc').setZone('local'); // Convert to local timezone
      const createdAtDate = startOfDay(parsedCreatedAt);
      console.log(
        `Habit createdAt: ${habit.createdAt}, parsed as ${parsedCreatedAt.toISO()}, startOfDay: ${createdAtDate.toISO()}`,
      );
      console.log(
        `Comparing createdAtDate (${createdAtDate.toISO()}) with normalizedDate (${normalizedDate.toISO()})`,
      );
      const isCreatedAfter = isAfter(createdAtDate, normalizedDate);
      console.log(`isCreatedAfter result: ${isCreatedAfter}`);
      if (isCreatedAfter) {
        console.log(
          `Habit created after ${normalizedDate.toISO()}, not scheduled`,
        );
        return false;
      }
    }

    // Check if the habit is archived before the date
    if (habit.archivedAt) {
      const parsedArchivedAt = fromISO(habit.archivedAt, 'utc').setZone(
        'local',
      );
      const archivedAtDate = startOfDay(parsedArchivedAt);
      console.log(
        `Habit archivedAt: ${habit.archivedAt}, parsed as ${parsedArchivedAt.toISO()}, startOfDay: ${archivedAtDate.toISO()}`,
      );
      const isArchivedBefore = isBeforeOrEqual(archivedAtDate, normalizedDate);
      console.log(`isArchivedBefore result: ${isArchivedBefore}`);
      if (isArchivedBefore) {
        console.log(
          `Habit archived before ${normalizedDate.toISO()}, not scheduled`,
        );
        return false;
      }
    }

    const dayOfWeek = normalizedDate.toFormat('EEE').toLowerCase(); // e.g., "mon"
    const dayOfMonth = normalizedDate.toFormat('d'); // e.g., "15"
    console.log(`Day of week: ${dayOfWeek}, Day of month: ${dayOfMonth}`);

    switch (frequency.type) {
      case 'daily':
        console.log('Habit frequency is daily, scheduled');
        return true; // Daily habits are scheduled every day
      case 'weekly':
        console.log(
          `Habit frequency is weekly, checking if ${dayOfWeek} is in ${frequency.value}`,
        );
        const isWeeklyScheduled = frequency.value.includes(dayOfWeek);
        console.log(`Weekly scheduled: ${isWeeklyScheduled}`);
        return isWeeklyScheduled; // Check if the day of the week is in the frequency value
      case 'monthly':
        console.log(
          `Habit frequency is monthly, checking if ${dayOfMonth} is in ${frequency.value}`,
        );
        const isMonthlyScheduled = frequency.value.includes(dayOfMonth);
        console.log(`Monthly scheduled: ${isMonthlyScheduled}`);
        return isMonthlyScheduled; // Check if the day of the month is in the frequency value
      case 'hourly':
        console.log('Habit frequency is hourly, scheduled');
        return true; // Hourly habits are scheduled every day (we'll handle time-of-day filtering elsewhere)
      default:
        console.log(`Unknown frequency type: ${frequency.type}, not scheduled`);
        return false;
    }
  } catch (error) {
    console.error('Error checking if habit is scheduled for date:', error);
    return false;
  }
};
