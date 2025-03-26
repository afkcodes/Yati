// utils/streaks/streakCalculator.ts
import {DateTime} from 'luxon';
import {Habit} from '~/types/habit.types';
import {
  defaultStreakConfig,
  StreakConfig,
  StreakData,
  StreakUpdateResult,
} from '~types/streak.types';
import {fromISO, now, toUTCISO} from '~utils/date/dateUtils';

const STREAK_MILESTONES = [7, 14, 30, 60, 90];
const FREEZE_DAY_EARN_THRESHOLD = 21;

/**
 * Calculates the streak for a habit based on its progress and configuration.
 * @param habit The habit object containing progress data
 * @param config Streak configuration (defaults to defaultStreakConfig)
 * @param currentStreak Current streak data (defaults to initial values)
 * @returns StreakUpdateResult with updated streak, milestones, and freeze day events
 */
export const calculateStreak = (
  habit: Habit,
  config: StreakConfig = defaultStreakConfig,
  currentStreak: StreakData = {
    type: 'daily',
    current: 0,
    longest: 0,
    history: [],
    freezeDaysAllowed: config.initialFreezeDays || 3, // Use initialFreezeDays from config
    freezeDaysUsed: 0,
  },
): StreakUpdateResult => {
  const today = now().startOf('day');
  const progressEntries = Object.entries(habit.progress || {})
    .map(([date, progress]) => ({
      date: DateTime.fromFormat(date, 'yyyy-MM-dd', {zone: 'local'}),
      isCompleted: progress.isCompleted,
    }))
    .filter(entry => entry.date.isValid && entry.date <= today)
    .sort((a, b) => b.date.toMillis() - a.date.toMillis());

  let newStreak: StreakData = {...currentStreak, type: config.type}; // Preserve type from config
  let milestoneAchieved: number | undefined;
  let earnedFreezeDay = false;
  let requiresPayment = false;

  // Check if streak is currently frozen, handle invalid frozenUntil gracefully
  const frozenUntil = currentStreak.frozenUntil
    ? fromISO(currentStreak.frozenUntil, 'utc')
    : null;
  const isFrozen = frozenUntil?.isValid ? frozenUntil >= today : false;

  // Reset freeze days if needed
  newStreak = resetFreezeDaysIfNeeded(newStreak, config);

  // Calculate streak based on type
  switch (config.type) {
    case 'daily':
      newStreak = calculateDailyStreak(
        progressEntries,
        today,
        newStreak,
        config,
        isFrozen,
      );
      break;
    case 'weekly':
      if (!config.weeklyTarget) {
        throw new Error('weeklyTarget is required for weekly streak');
      }
      newStreak = calculateWeeklyStreak(
        progressEntries,
        today,
        newStreak,
        config,
        isFrozen,
      );
      break;
    case 'rolling':
      if (!config.rollingMaxGap) {
        throw new Error('rollingMaxGap is required for rolling streak');
      }
      newStreak = calculateRollingStreak(
        progressEntries,
        today,
        newStreak,
        config,
        isFrozen,
      );
      break;
    case 'milestone':
      if (!config.milestoneTarget) {
        throw new Error('milestoneTarget is required for milestone streak');
      }
      newStreak = calculateMilestoneStreak(
        progressEntries,
        today,
        newStreak,
        config,
        isFrozen,
      );
      break;
    default:
      throw new Error(`Unsupported streak type: ${config.type}`);
  }

  // Check for milestones
  if (newStreak.current > 0 && STREAK_MILESTONES.includes(newStreak.current)) {
    milestoneAchieved = newStreak.current;
  }

  // Earn a freeze day at 21 if not already earned
  if (
    newStreak.current === FREEZE_DAY_EARN_THRESHOLD &&
    !currentStreak.earnedFreezeDayAt21
  ) {
    earnedFreezeDay = true;
    newStreak.earnedFreezeDayAt21 = true;
    newStreak.freezeDaysAllowed += 1; // Increment allowed freeze days in StreakData
  }

  // Check if payment is required
  if (newStreak.freezeDaysUsed >= newStreak.freezeDaysAllowed && !isFrozen) {
    requiresPayment = true;
  }

  return {
    streak: newStreak,
    milestoneAchieved,
    earnedFreezeDay,
    requiresPayment,
  };
};

/**
 * Resets freeze days if the reset period has passed.
 * @param streak Current streak data
 * @param config Streak configuration
 * @returns Updated streak data with reset freeze days if applicable
 */
const resetFreezeDaysIfNeeded = (
  streak: StreakData,
  config: StreakConfig,
): StreakData => {
  if (config.freezeResetPeriod === 'never') {
    return streak;
  }

  const today = now().startOf('day');
  const lastReset = streak.lastFreezeReset
    ? fromISO(streak.lastFreezeReset, 'utc')
    : null;
  let shouldReset = !lastReset;

  if (lastReset && lastReset.isValid) {
    if (config.freezeResetPeriod === 'monthly') {
      shouldReset =
        today.month !== lastReset.month || today.year !== lastReset.year;
    } else if (config.freezeResetPeriod === 'weekly') {
      shouldReset =
        today.weekNumber !== lastReset.weekNumber ||
        today.year !== lastReset.year;
    }
  }

  if (shouldReset) {
    return {
      ...streak,
      freezeDaysUsed: 0,
      lastFreezeReset: toUTCISO(today),
    };
  }
  return streak;
};

/**
 * Calculates a daily streak: consecutive days completed.
 * @param progressEntries Sorted array of progress entries
 * @param today Current date (start of day)
 * @param currentStreak Current streak data
 * @param config Streak configuration
 * @param isFrozen Whether the streak is currently frozen
 * @returns Updated streak data
 */
const calculateDailyStreak = (
  progressEntries: {date: DateTime; isCompleted: boolean}[],
  today: DateTime,
  currentStreak: StreakData,
  config: StreakConfig,
  isFrozen: boolean,
): StreakData => {
  let current = 0;
  let longest = currentStreak.longest || 0;
  let history = [...(currentStreak.history || [])];
  let previousDate: DateTime | null = null;
  let streakStart: DateTime | null = null;
  let freezeDaysUsed = currentStreak.freezeDaysUsed || 0;

  for (const entry of progressEntries) {
    const {date, isCompleted} = entry;

    if (previousDate === null) {
      if (
        isCompleted &&
        (date.equals(today) || date.equals(today.minus({days: 1})))
      ) {
        current = 1;
        streakStart = date;
      }
      previousDate = date;
      continue;
    }

    const expectedPreviousDay = previousDate.minus({days: 1});
    if (date.equals(expectedPreviousDay)) {
      if (isCompleted) {
        current += 1;
      } else {
        if (current > 0) {
          longest = Math.max(longest, current);
          if (streakStart) {
            history.push({
              start: streakStart.toFormat('yyyy-MM-dd'),
              end: previousDate.toFormat('yyyy-MM-dd'),
              length: current,
            });
          }
        }
        current = 0;
        streakStart = null;
      }
    } else {
      const daysMissed = Math.floor(previousDate.diff(date, 'days').days);
      if (
        isFrozen ||
        (freezeDaysUsed < currentStreak.freezeDaysAllowed && daysMissed === 1)
      ) {
        if (isCompleted) {
          current += 1;
          if (!isFrozen) {
            freezeDaysUsed += 1;
          } // Only increment if not already frozen
        } else {
          if (current > 0) {
            longest = Math.max(longest, current);
            if (streakStart) {
              history.push({
                start: streakStart.toFormat('yyyy-MM-dd'),
                end: previousDate.toFormat('yyyy-MM-dd'),
                length: current,
              });
            }
          }
          current = 0;
          streakStart = null;
        }
      } else {
        if (current > 0) {
          longest = Math.max(longest, current);
          if (streakStart) {
            history.push({
              start: streakStart.toFormat('yyyy-MM-dd'),
              end: previousDate.toFormat('yyyy-MM-dd'),
              length: current,
            });
          }
        }
        current = isCompleted ? 1 : 0;
        streakStart = isCompleted ? date : null;
      }
    }
    previousDate = date;
  }

  longest = Math.max(longest, current);

  return {
    ...currentStreak,
    type: 'daily',
    current,
    longest,
    history,
    freezeDaysUsed,
    lastCompletion: previousDate
      ? toUTCISO(previousDate)
      : currentStreak.lastCompletion,
  };
};

// Add calculateWeeklyStreak, calculateRollingStreak, calculateMilestoneStreak with similar updates
const calculateWeeklyStreak = (
  progressEntries: {date: DateTime; isCompleted: boolean}[],
  today: DateTime,
  currentStreak: StreakData,
  config: StreakConfig,
  isFrozen: boolean,
): StreakData => {
  const weeks: {
    [weekKey: string]: {completions: number; start: DateTime; end: DateTime};
  } = {};
  for (const entry of progressEntries) {
    const {date, isCompleted} = entry;
    const weekStart = date.startOf('week');
    const weekEnd = date.endOf('week');
    const weekKey = `${weekStart.toFormat('yyyy-MM-dd')}-${weekEnd.toFormat('yyyy-MM-dd')}`;
    if (!weeks[weekKey]) {
      weeks[weekKey] = {completions: 0, start: weekStart, end: weekEnd};
    }
    if (isCompleted) {
      weeks[weekKey].completions += 1;
    }
  }

  const sortedWeeks = Object.values(weeks).sort(
    (a, b) => b.start.toMillis() - a.start.toMillis(),
  );
  let current = 0;
  let longest = currentStreak.longest || 0;
  let history = [...(currentStreak.history || [])];
  let previousWeek: {start: DateTime; end: DateTime} | null = null;
  let streakStart: DateTime | null = null;
  let freezeDaysUsed = currentStreak.freezeDaysUsed || 0;

  for (const week of sortedWeeks) {
    const metTarget = week.completions >= config.weeklyTarget!;
    if (previousWeek === null) {
      const currentWeekStart = today.startOf('week');
      if (week.start.equals(currentWeekStart) && metTarget) {
        current = 1;
        streakStart = week.start;
      }
      previousWeek = week;
      continue;
    }

    const expectedPreviousWeek = previousWeek.start.minus({weeks: 1});
    if (week.start.equals(expectedPreviousWeek)) {
      if (metTarget) {
        current += 1;
      } else {
        if (current > 0) {
          longest = Math.max(longest, current);
          if (streakStart) {
            history.push({
              start: streakStart.toFormat('yyyy-MM-dd'),
              end: previousWeek.end.toFormat('yyyy-MM-dd'),
              length: current,
            });
          }
        }
        current = 0;
        streakStart = null;
      }
    } else {
      const weeksMissed = Math.floor(
        previousWeek.start.diff(week.start, 'weeks').weeks,
      );
      if (
        isFrozen ||
        (freezeDaysUsed < currentStreak.freezeDaysAllowed && weeksMissed === 1)
      ) {
        if (metTarget) {
          current += 1;
          if (!isFrozen) {
            freezeDaysUsed += 1;
          }
        } else {
          if (current > 0) {
            longest = Math.max(longest, current);
            if (streakStart) {
              history.push({
                start: streakStart.toFormat('yyyy-MM-dd'),
                end: previousWeek.end.toFormat('yyyy-MM-dd'),
                length: current,
              });
            }
          }
          current = 0;
          streakStart = null;
        }
      } else {
        if (current > 0) {
          longest = Math.max(longest, current);
          if (streakStart) {
            history.push({
              start: streakStart.toFormat('yyyy-MM-dd'),
              end: previousWeek.end.toFormat('yyyy-MM-dd'),
              length: current,
            });
          }
        }
        current = metTarget ? 1 : 0;
        streakStart = metTarget ? week.start : null;
      }
    }
    previousWeek = week;
  }

  longest = Math.max(longest, current);

  return {
    ...currentStreak,
    type: 'weekly',
    current,
    longest,
    history,
    freezeDaysUsed,
    lastCompletion: previousWeek
      ? toUTCISO(previousWeek.end)
      : currentStreak.lastCompletion,
  };
};

/**
 * Calculates a rolling streak: consecutive completions within a maximum gap.
 * @param progressEntries Sorted array of progress entries (descending by date)
 * @param today Current date (start of day), used to filter out future entries
 * @param currentStreak Current streak data
 * @param config Streak configuration with rollingMaxGap
 * @param isFrozen Whether the streak is currently frozen
 * @returns Updated streak data
 */
const calculateRollingStreak = (
  progressEntries: {date: DateTime; isCompleted: boolean}[],
  today: DateTime,
  currentStreak: StreakData,
  config: StreakConfig,
  isFrozen: boolean,
): StreakData => {
  let current = 0; // Current streak length
  let longest = currentStreak.longest || 0; // Longest streak achieved
  let history = [...(currentStreak.history || [])]; // History of past streaks
  let previousDate: DateTime | null = null; // Last completed date
  let streakStart: DateTime | null = null; // Start of current streak
  let freezeDaysUsed = currentStreak.freezeDaysUsed || 0; // Number of freeze days used

  for (const entry of progressEntries) {
    const {date, isCompleted} = entry;

    // Skip future entries and incomplete entries
    if (date > today || !isCompleted) {
      continue;
    }

    if (previousDate === null) {
      // First valid completion encountered
      current = 1;
      streakStart = date;
      previousDate = date;
      continue;
    }

    const daysSinceLast = Math.floor(previousDate.diff(date, 'days').days);
    if (daysSinceLast <= config.rollingMaxGap!) {
      // Within the allowed gap, continue the streak
      current += 1;
    } else if (
      isFrozen ||
      (freezeDaysUsed < currentStreak.freezeDaysAllowed &&
        daysSinceLast <= config.rollingMaxGap! + 1)
    ) {
      // Gap exceeds rollingMaxGap but can be covered by freeze
      current += 1;
      if (!isFrozen) {
        freezeDaysUsed += 1;
      } // Use a freeze day if not already frozen
    } else {
      // Gap exceeds rollingMaxGap and no freeze available, end current streak
      if (current > 0) {
        longest = Math.max(longest, current);
        if (streakStart) {
          history.push({
            start: streakStart.toFormat('yyyy-MM-dd'),
            end: previousDate.toFormat('yyyy-MM-dd'),
            length: current,
          });
        }
      }
      current = 1; // Start a new streak
      streakStart = date;
    }
    previousDate = date;
  }

  longest = Math.max(longest, current);

  return {
    ...currentStreak,
    type: 'rolling',
    current,
    longest,
    history,
    freezeDaysUsed,
    lastCompletion: previousDate
      ? toUTCISO(previousDate)
      : currentStreak.lastCompletion,
  };
};

/**
 * Calculates a milestone streak: total completions towards a target, with optional reset.
 * @param progressEntries Sorted array of progress entries (descending by date)
 * @param today Current date (start of day), used to filter out future entries
 * @param currentStreak Current streak data
 * @param config Streak configuration with milestoneTarget and milestoneReset
 * @returns Updated streak data
 */
const calculateMilestoneStreak = (
  progressEntries: {date: DateTime; isCompleted: boolean}[],
  today: DateTime,
  currentStreak: StreakData,
  config: StreakConfig,
): StreakData => {
  // Count total completions up to today
  const totalCompletions = progressEntries.filter(
    entry => entry.isCompleted && entry.date <= today,
  ).length;

  // Calculate current streak based on milestone reset option
  const current = config.milestoneReset
    ? totalCompletions % config.milestoneTarget! // Reset after each milestone
    : totalCompletions; // Continuous count

  // Longest streak: if resetting, max milestone reached; otherwise, total completions
  const longest = config.milestoneReset
    ? Math.max(
        currentStreak.longest || 0,
        Math.floor(totalCompletions / config.milestoneTarget!) *
          config.milestoneTarget!,
      )
    : totalCompletions;

  // History is not updated for milestone streaks as it’s not consecutive
  return {
    ...currentStreak,
    type: 'milestone',
    current,
    longest,
    history: currentStreak.history || [], // Preserve existing history, no updates
    freezeDaysUsed: currentStreak.freezeDaysUsed || 0, // Freeze days not applicable
    lastCompletion: progressEntries.find(entry => entry.isCompleted)?.date
      ? toUTCISO(progressEntries.find(entry => entry.isCompleted)!.date)
      : currentStreak.lastCompletion,
  };
};
