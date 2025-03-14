import {
  differenceInHours,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import {Habit} from '~/types/habit.types';
import {StreakSettings} from '~/types/streak.types';
import {toDateString} from '~/utils/date/dateUtils';

/**
 * Determines if a habit should be active on a given date based on its frequency
 */
export const isHabitScheduledForDate = (habit: Habit, date: Date): boolean => {
  const {frequency} = habit;
  const dayOfWeek = format(date, 'EEE').toLowerCase(); // mon, tue, etc.
  const dayOfMonth = format(date, 'd'); // 1-31

  switch (frequency.type) {
    case 'daily':
      return true;
    case 'weekly':
      return frequency.value.includes(dayOfWeek);
    case 'monthly':
      return frequency.value.includes(dayOfMonth);
    case 'hourly':
      return true; // Hourly habits are active every day
    default:
      return false;
  }
};

/**
 * Gets all dates when a habit was scheduled in a date range
 */
export const getScheduledDatesInRange = (
  habit: Habit,
  startDate: Date,
  endDate: Date,
): Date[] => {
  // Create array of all days in the range
  const allDates = eachDayOfInterval({start: startDate, end: endDate});

  // Filter to only include dates when the habit was scheduled
  return allDates.filter(date => isHabitScheduledForDate(habit, date));
};

/**
 * Gets all dates when a habit was completed
 */
export const getCompletedDates = (habit: Habit): Date[] => {
  return Object.entries(habit.progress)
    .filter(([_, progress]) => progress.isCompleted)
    .map(([dateStr]) => parseISO(dateStr))
    .sort((a, b) => a.getTime() - b.getTime());
};

/**
 * Checks if a habit was completed on a specific date
 */
export const wasHabitCompletedOnDate = (habit: Habit, date: Date): boolean => {
  const dateStr = toDateString(date);
  return Boolean(habit.progress[dateStr]?.isCompleted);
};

/**
 * Determines if the current streak is still active
 * A streak is active if:
 * 1. The last scheduled date was completed, or
 * 2. The last scheduled date is today and hasn't been marked yet
 */
export const isStreakActive = (
  habit: Habit,
  settings: StreakSettings,
): boolean => {
  const today = startOfDay(new Date());

  // Find the most recent date when the habit was scheduled before today
  let date = today;
  let recentScheduledDate: Date | null = null;

  // Go back up to 30 days to find the most recent scheduled date
  for (let i = 0; i < 30; i++) {
    if (i > 0) {
      date = subDays(date, 1);
    }

    if (isHabitScheduledForDate(habit, date)) {
      if (isSameDay(date, today)) {
        // If scheduled today, streak is still active regardless of completion
        return true;
      } else {
        recentScheduledDate = date;
        break;
      }
    }
  }

  if (!recentScheduledDate) {
    return false; // No recent scheduled date found
  }

  // Check if the recent scheduled date was completed
  const wasCompleted = wasHabitCompletedOnDate(habit, recentScheduledDate);

  if (!wasCompleted) {
    // If it wasn't completed, check if we're within the grace period
    const hoursSinceLastScheduled = differenceInHours(
      new Date(),
      recentScheduledDate,
    );

    return hoursSinceLastScheduled <= settings.maintainStreakWithinHours;
  }

  return wasCompleted;
};

/**
 * Calculates the current streak for a habit
 */
export const calculateCurrentStreak = (
  habit: Habit,
  settings: StreakSettings,
): number => {
  if (!habit || !habit.progress || Object.keys(habit.progress).length === 0) {
    return 0;
  }

  const today = startOfDay(new Date());
  let currentDate = today;
  let streak = 0;
  let foundStart = false;

  // Go backwards from today to find streak
  for (let i = 0; i < 366; i++) {
    // Check up to a year back
    // If the habit is scheduled for this date
    if (isHabitScheduledForDate(habit, currentDate)) {
      const wasCompleted = wasHabitCompletedOnDate(habit, currentDate);

      // Special case for today
      if (isSameDay(currentDate, today)) {
        // If today is scheduled but not completed yet
        if (!wasCompleted && settings.countTodayInStreaks) {
          // We don't count today, but we continue checking previous days
          foundStart = true;
        } else if (wasCompleted) {
          // If today is completed, count it and continue
          streak++;
          foundStart = true;
        } else {
          // Today is not scheduled or we don't count today
          // Continue to previous day
        }
      }
      // For past days
      else if (foundStart || wasCompleted) {
        if (wasCompleted) {
          streak++;
          foundStart = true;
        } else {
          // Found a scheduled day that wasn't completed, streak ends
          break;
        }
      }
    }

    // Move to the previous day
    currentDate = subDays(currentDate, 1);

    // If we've gone before the habit was created, stop
    if (habit.createdAt && isBefore(currentDate, parseISO(habit.createdAt))) {
      break;
    }
  }

  return streak;
};

/**
 * Calculates the longest streak ever achieved for a habit
 */
export const calculateLongestStreak = (habit: Habit): number => {
  if (!habit || !habit.progress || Object.keys(habit.progress).length === 0) {
    return 0;
  }

  // Get all completed dates
  const completedDates = getCompletedDates(habit);
  if (completedDates.length === 0) {
    return 0;
  }

  // Get earliest and latest dates
  const earliestDate = habit.createdAt
    ? parseISO(habit.createdAt)
    : completedDates[0];

  const latestDate = new Date();

  // Get all scheduled dates in the entire history
  const allScheduledDates = getScheduledDatesInRange(
    habit,
    earliestDate,
    latestDate,
  );

  if (allScheduledDates.length === 0) {
    return 0;
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let lastCompletedDateIndex = -1;

  // Iterate through all scheduled dates chronologically
  for (let i = 0; i < allScheduledDates.length; i++) {
    const currentDate = allScheduledDates[i];
    const wasCompleted = wasHabitCompletedOnDate(habit, currentDate);

    if (wasCompleted) {
      // If this is the first completed date or it follows the previous
      // completed date in sequence (with no missed dates in between)
      if (lastCompletedDateIndex === -1 || lastCompletedDateIndex === i - 1) {
        currentStreak++;
      } else {
        // There were missed dates in between, reset streak
        currentStreak = 1;
      }

      lastCompletedDateIndex = i;

      // Update longest streak if current is longer
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      // Reset current streak on missed day
      currentStreak = 0;
      lastCompletedDateIndex = -1;
    }
  }

  return longestStreak;
};

/**
 * Determines if a habit has a perfect week (all scheduled days completed)
 */
export const hasPerfectWeek = (
  habit: Habit,
  weekStartDate: Date = startOfWeek(new Date()),
): boolean => {
  const endDate = endOfWeek(weekStartDate);

  // Get all dates in this week when the habit was scheduled
  const scheduledDatesInWeek = getScheduledDatesInRange(
    habit,
    weekStartDate,
    endDate,
  );

  // No scheduled dates means no perfect week
  if (scheduledDatesInWeek.length === 0) {
    return false;
  }

  // Check if habit is completed for all scheduled dates in the week
  // Except for today if it's in this week
  const today = startOfDay(new Date());

  return scheduledDatesInWeek.every(
    date =>
      wasHabitCompletedOnDate(habit, date) ||
      (isSameDay(date, today) &&
        isWithinInterval(today, {
          start: weekStartDate,
          end: endDate,
        })),
  );
};

/**
 * Determines if a habit has a perfect month (all scheduled days completed)
 */
export const hasPerfectMonth = (
  habit: Habit,
  monthStartDate: Date = startOfMonth(new Date()),
): boolean => {
  const endDate = endOfMonth(monthStartDate);

  // Get all dates in this month when the habit was scheduled
  const scheduledDatesInMonth = getScheduledDatesInRange(
    habit,
    monthStartDate,
    endDate,
  );

  // No scheduled dates means no perfect month
  if (scheduledDatesInMonth.length === 0) {
    return false;
  }

  // Check if habit is completed for all scheduled dates in the month
  // Except for today if it's in this month
  const today = startOfDay(new Date());

  return scheduledDatesInMonth.every(
    date =>
      wasHabitCompletedOnDate(habit, date) ||
      (isSameDay(date, today) &&
        isWithinInterval(today, {
          start: monthStartDate,
          end: endDate,
        })),
  );
};

/**
 * Counts the number of perfect weeks achieved
 */
export const countPerfectWeeks = (habit: Habit): number => {
  if (!habit.createdAt) {
    return 0;
  }

  const creationDate = parseISO(habit.createdAt);
  const today = new Date();

  // Get all week starts since habit creation
  const weekStarts = eachWeekOfInterval({
    start: creationDate,
    end: today,
  });

  return weekStarts.filter(weekStart => hasPerfectWeek(habit, weekStart))
    .length;
};

/**
 * Counts the number of perfect months achieved
 */
export const countPerfectMonths = (habit: Habit): number => {
  if (!habit.createdAt) {
    return 0;
  }

  const creationDate = parseISO(habit.createdAt);
  const today = new Date();

  // Get all month starts since habit creation
  const monthStarts = eachMonthOfInterval({
    start: creationDate,
    end: today,
  });

  return monthStarts.filter(monthStart => hasPerfectMonth(habit, monthStart))
    .length;
};

/**
 * Calculates completion rate over a time period
 */
export const calculateCompletionRate = (
  habit: Habit,
  startDate: Date,
  endDate: Date,
): number => {
  // Get all scheduled dates in the range
  const scheduledDates = getScheduledDatesInRange(habit, startDate, endDate);

  if (scheduledDates.length === 0) {
    return 0;
  }

  // Count completed dates
  const completedCount = scheduledDates.filter(date =>
    wasHabitCompletedOnDate(habit, date),
  ).length;

  return Math.round((completedCount / scheduledDates.length) * 100);
};

/**
 * Gets the start date of the current streak
 */
export const getCurrentStreakStartDate = (
  habit: Habit,
  settings: StreakSettings,
): Date | null => {
  const currentStreak = calculateCurrentStreak(habit, settings);

  if (currentStreak === 0) {
    return null;
  }

  const today = startOfDay(new Date());
  let currentDate = today;
  let daysFound = 0;

  // Go backwards to find the start date
  for (let i = 0; i < 366; i++) {
    if (isHabitScheduledForDate(habit, currentDate)) {
      const wasCompleted = wasHabitCompletedOnDate(habit, currentDate);

      if (isSameDay(currentDate, today) && !wasCompleted) {
        // Skip today if not completed and we're counting backward
      } else if (wasCompleted) {
        daysFound++;

        // If we've found all days in the streak, this is the start date
        if (daysFound === currentStreak) {
          return currentDate;
        }
      } else {
        // Found a break in the streak
        break;
      }
    }

    currentDate = subDays(currentDate, 1);
  }

  return null;
};

/**
 * Gets the streak history (all past streaks)
 */
export const getStreakHistory = (
  habit: Habit,
): Array<{
  startDate: string;
  endDate: string;
  length: number;
}> => {
  if (!habit.createdAt) {
    return [];
  }

  const result = [];
  const allCompletedDates = getCompletedDates(habit);

  if (allCompletedDates.length === 0) {
    return [];
  }

  let streakStart: Date | null = null;
  let streakEnd: Date | null = null;
  let currentLength = 0;

  // Get all dates from creation to today
  const creationDate = parseISO(habit.createdAt);
  const today = new Date();
  const allDates = getScheduledDatesInRange(habit, creationDate, today);

  // Iterate through all scheduled dates
  for (let i = 0; i < allDates.length; i++) {
    const currentDate = allDates[i];
    const wasCompleted = wasHabitCompletedOnDate(habit, currentDate);

    if (wasCompleted) {
      // Start or continue a streak
      if (streakStart === null) {
        streakStart = currentDate;
      }

      streakEnd = currentDate;
      currentLength++;
    } else {
      // End of a streak
      if (streakStart !== null && streakEnd !== null && currentLength > 0) {
        result.push({
          startDate: toDateString(streakStart),
          endDate: toDateString(streakEnd),
          length: currentLength,
        });
      }

      // Reset streak tracking
      streakStart = null;
      streakEnd = null;
      currentLength = 0;
    }
  }

  // Don't forget to add the last streak if we ended on a completed day
  if (streakStart !== null && streakEnd !== null && currentLength > 0) {
    result.push({
      startDate: toDateString(streakStart),
      endDate: toDateString(streakEnd),
      length: currentLength,
    });
  }

  return result;
};
