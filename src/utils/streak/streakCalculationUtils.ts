// import {
//   differenceInHours,
//   eachDayOfInterval,
//   eachMonthOfInterval,
//   eachWeekOfInterval,
//   endOfMonth,
//   endOfWeek,
//   format,
//   isAfter,
//   isBefore,
//   isSameDay,
//   isWithinInterval,
//   parseISO,
//   startOfDay,
//   startOfMonth,
//   startOfWeek,
//   subDays,
// } from 'date-fns';
// import {Habit} from '~/types/habit.types';
// import {StreakSettings} from '~/types/streak.types';
// import {
//   fromDateString,
//   getLocalToday,
//   isSameLocalDay,
//   toDateString,
// } from '~/utils/date/dateUtils';

// /**
//  * Determines if a habit is active on a specific date based on its frequency
//  * @param habit The habit to check
//  * @param date The date to check
//  * @returns Whether the habit is scheduled for the given date
//  */
// export const isHabitScheduledForDate = (habit: Habit, date: Date): boolean => {
//   try {
//     const normalizedDate = startOfDay(date);
//     const {frequency} = habit;

//     // Skip if habit was created after this date
//     if (habit.createdAt && isAfter(parseISO(habit.createdAt), normalizedDate)) {
//       return false;
//     }

//     // Skip if habit was archived before or on this date
//     if (
//       habit.archivedAt &&
//       !isAfter(parseISO(habit.archivedAt), normalizedDate)
//     ) {
//       return false;
//     }

//     const dayOfWeek = format(normalizedDate, 'EEE').toLowerCase(); // mon, tue, etc.
//     const dayOfMonth = format(normalizedDate, 'd'); // 1-31

//     switch (frequency.type) {
//       case 'daily':
//         return true;
//       case 'weekly':
//         return frequency.value.includes(dayOfWeek);
//       case 'monthly':
//         return frequency.value.includes(dayOfMonth);
//       case 'hourly':
//         return true; // Hourly habits are active every day
//       default:
//         return false;
//     }
//   } catch (error) {
//     console.error('Error checking if habit is scheduled for date:', error);
//     return false;
//   }
// };
// /**
//  * Gets all dates when a habit was scheduled in a date range
//  */
// export const getScheduledDatesInRange = (
//   habit: Habit,
//   startDate: Date,
//   endDate: Date,
// ): Date[] => {
//   // Create array of all days in the range
//   const allDates = eachDayOfInterval({start: startDate, end: endDate});

//   // Filter to only include dates when the habit was scheduled
//   return allDates.filter(date => isHabitScheduledForDate(habit, date));
// };

// /**
//  * Gets all dates when a habit was completed
//  */
// export const getCompletedDates = (habit: Habit): Date[] => {
//   return Object.entries(habit.progress)
//     .filter(([_, progress]) => progress.isCompleted)
//     .map(([dateStr]) => fromDateString(dateStr))
//     .sort((a, b) => a.getTime() - b.getTime());
// };

// /**
//  * Determines if a habit was completed on a specific date
//  * @param habit The habit to check
//  * @param date The date to check
//  * @returns Whether the habit was completed on the date
//  */
// export const wasHabitCompletedOnDate = (habit: Habit, date: Date): boolean => {
//   try {
//     const dateStr = toDateString(date);
//     return Boolean(habit.progress[dateStr]?.isCompleted);
//   } catch (error) {
//     console.error('Error checking habit completion status:', error);
//     return false;
//   }
// };

// /**
//  * Determines if the current streak is still active
//  * A streak is active if:
//  * 1. The last scheduled date was completed, or
//  * 2. The last scheduled date is today and hasn't been marked yet
//  */
// export const isStreakActive = (
//   habit: Habit,
//   settings: StreakSettings,
// ): boolean => {
//   const today = getLocalToday();

//   // Find the most recent date when the habit was scheduled before today
//   let date = today;
//   let recentScheduledDate: Date | null = null;

//   // Go back up to 30 days to find the most recent scheduled date
//   for (let i = 0; i < 30; i++) {
//     if (i > 0) {
//       date = subDays(date, 1);
//     }

//     if (isHabitScheduledForDate(habit, date)) {
//       if (isSameDay(date, today)) {
//         // If scheduled today, streak is still active regardless of completion
//         return true;
//       } else {
//         recentScheduledDate = date;
//         break;
//       }
//     }
//   }

//   if (!recentScheduledDate) {
//     return false; // No recent scheduled date found
//   }

//   // Check if the recent scheduled date was completed
//   const wasCompleted = wasHabitCompletedOnDate(habit, recentScheduledDate);

//   if (!wasCompleted) {
//     // If it wasn't completed, check if we're within the grace period
//     const hoursSinceLastScheduled = differenceInHours(
//       new Date(),
//       recentScheduledDate,
//     );

//     return hoursSinceLastScheduled <= settings.maintainStreakWithinHours;
//   }

//   return wasCompleted;
// };

// /**
//  * Calculates the current streak for a habit
//  * @param habit The habit to calculate streak for
//  * @param settings Streak settings that affect calculation
//  * @returns The current streak count
//  */
// export const calculateCurrentStreak = (
//   habit: Habit,
//   settings: StreakSettings,
// ): number => {
//   // Add proper error handling and validation
//   if (!habit || !habit.progress) {
//     console.warn('Invalid habit data passed to calculateCurrentStreak');
//     return 0;
//   }

//   // Early return if no progress data
//   if (Object.keys(habit.progress).length === 0) {
//     return 0;
//   }

//   const today = getLocalToday();
//   let currentDate = today;
//   let streak = 0;

//   // Check if we have any completed days at all
//   const hasAnyCompletions = Object.values(habit.progress).some(
//     p => p.isCompleted,
//   );
//   if (!hasAnyCompletions) {
//     return 0;
//   }

//   // Log initial state for debugging
//   console.debug('[Streak] Calculating streak for:', habit.title);
//   console.debug('[Streak] Today:', toDateString(today));
//   console.debug('[Streak] Count today setting:', settings.countTodayInStreaks);

//   // Go backwards from today to find streak
//   for (let i = 0; i < 366; i++) {
//     // Check up to a year back
//     // If the habit is scheduled for this date
//     if (isHabitScheduledForDate(habit, currentDate)) {
//       const wasCompleted = wasHabitCompletedOnDate(habit, currentDate);
//       const dateStr = toDateString(currentDate);

//       console.debug(
//         `[Streak] Checking date: ${dateStr}, scheduled: true, completed: ${wasCompleted}`,
//       );

//       // For today
//       if (isSameLocalDay(currentDate, today)) {
//         if (wasCompleted) {
//           // Today is completed, count it
//           streak++;
//           console.debug(
//             '[Streak] Today is completed, adding to streak:',
//             streak,
//           );
//         } else if (!settings.countTodayInStreaks) {
//           // We don't count today in streaks, continue to previous days
//           console.debug(
//             '[Streak] Today not counting in streak calculation, continuing to past days',
//           );
//         } else {
//           // Today is scheduled but not completed and we're counting today
//           // This breaks the streak
//           console.debug(
//             '[Streak] Today counts in streak but is not completed, breaking streak',
//           );
//           break;
//         }
//       }
//       // For past days
//       else {
//         if (wasCompleted) {
//           // Past day was completed, count it
//           streak++;
//           console.debug(
//             `[Streak] Past day ${dateStr} was completed, streak: ${streak}`,
//           );
//         } else {
//           // Found a scheduled day that wasn't completed
//           // This breaks the streak
//           console.debug(
//             `[Streak] Found incomplete scheduled day ${dateStr}, breaking streak`,
//           );
//           break;
//         }
//       }
//     } else {
//       // Date not scheduled, skip it without breaking streak
//       console.debug(
//         `[Streak] Date ${toDateString(currentDate)} not scheduled, skipping`,
//       );
//     }

//     // Move to the previous day
//     currentDate = subDays(currentDate, 1);

//     // If we've gone before the habit was created, stop
//     if (habit.createdAt && isBefore(currentDate, parseISO(habit.createdAt))) {
//       console.debug(
//         '[Streak] Reached habit creation date, stopping calculation',
//       );
//       break;
//     }
//   }

//   console.debug(`[Streak] Final streak calculation: ${streak}`);
//   return streak;
// };

// /**
//  * Calculates the longest streak ever achieved for a habit
//  */
// export const calculateLongestStreak = (habit: Habit): number => {
//   if (!habit || !habit.progress || Object.keys(habit.progress).length === 0) {
//     return 0;
//   }

//   // Get all completed dates
//   const completedDates = getCompletedDates(habit);
//   if (completedDates.length === 0) {
//     return 0;
//   }

//   // Get earliest and latest dates
//   const earliestDate = habit.createdAt
//     ? parseISO(habit.createdAt)
//     : completedDates[0];

//   const latestDate = new Date();

//   // Get all scheduled dates in the entire history
//   const allScheduledDates = getScheduledDatesInRange(
//     habit,
//     earliestDate,
//     latestDate,
//   );

//   if (allScheduledDates.length === 0) {
//     return 0;
//   }

//   let currentStreak = 0;
//   let longestStreak = 0;
//   let lastCompletedDateIndex = -1;

//   // Iterate through all scheduled dates chronologically
//   for (let i = 0; i < allScheduledDates.length; i++) {
//     const currentDate = allScheduledDates[i];
//     const wasCompleted = wasHabitCompletedOnDate(habit, currentDate);

//     if (wasCompleted) {
//       // If this is the first completed date or it follows the previous
//       // completed date in sequence (with no missed dates in between)
//       if (lastCompletedDateIndex === -1 || lastCompletedDateIndex === i - 1) {
//         currentStreak++;
//       } else {
//         // There were missed dates in between, reset streak
//         currentStreak = 1;
//       }

//       lastCompletedDateIndex = i;

//       // Update longest streak if current is longer
//       if (currentStreak > longestStreak) {
//         longestStreak = currentStreak;
//       }
//     } else {
//       // Reset current streak on missed day
//       currentStreak = 0;
//       lastCompletedDateIndex = -1;
//     }
//   }

//   return longestStreak;
// };

// /**
//  * Determines if a habit has a perfect week (all scheduled days completed)
//  */
// export const hasPerfectWeek = (
//   habit: Habit,
//   weekStartDate: Date = startOfWeek(new Date()),
// ): boolean => {
//   const endDate = endOfWeek(weekStartDate);

//   // Get all dates in this week when the habit was scheduled
//   const scheduledDatesInWeek = getScheduledDatesInRange(
//     habit,
//     weekStartDate,
//     endDate,
//   );

//   // No scheduled dates means no perfect week
//   if (scheduledDatesInWeek.length === 0) {
//     return false;
//   }

//   // Check if habit is completed for all scheduled dates in the week
//   // Except for today if it's in this week
//   const today = startOfDay(new Date());

//   return scheduledDatesInWeek.every(
//     date =>
//       wasHabitCompletedOnDate(habit, date) ||
//       (isSameDay(date, today) &&
//         isWithinInterval(today, {
//           start: weekStartDate,
//           end: endDate,
//         })),
//   );
// };

// /**
//  * Determines if a habit has a perfect month (all scheduled days completed)
//  */
// export const hasPerfectMonth = (
//   habit: Habit,
//   monthStartDate: Date = startOfMonth(new Date()),
// ): boolean => {
//   const endDate = endOfMonth(monthStartDate);

//   // Get all dates in this month when the habit was scheduled
//   const scheduledDatesInMonth = getScheduledDatesInRange(
//     habit,
//     monthStartDate,
//     endDate,
//   );

//   // No scheduled dates means no perfect month
//   if (scheduledDatesInMonth.length === 0) {
//     return false;
//   }

//   // Check if habit is completed for all scheduled dates in the month
//   // Except for today if it's in this month
//   const today = startOfDay(new Date());

//   return scheduledDatesInMonth.every(
//     date =>
//       wasHabitCompletedOnDate(habit, date) ||
//       (isSameDay(date, today) &&
//         isWithinInterval(today, {
//           start: monthStartDate,
//           end: endDate,
//         })),
//   );
// };

// /**
//  * Counts the number of perfect weeks achieved
//  */
// export const countPerfectWeeks = (habit: Habit): number => {
//   if (!habit.createdAt) {
//     return 0;
//   }

//   const creationDate = parseISO(habit.createdAt);
//   const today = new Date();

//   // Get all week starts since habit creation
//   const weekStarts = eachWeekOfInterval({
//     start: creationDate,
//     end: today,
//   });

//   return weekStarts.filter(weekStart => hasPerfectWeek(habit, weekStart))
//     .length;
// };

// /**
//  * Counts the number of perfect months achieved
//  */
// export const countPerfectMonths = (habit: Habit): number => {
//   if (!habit.createdAt) {
//     return 0;
//   }

//   const creationDate = parseISO(habit.createdAt);
//   const today = new Date();

//   // Get all month starts since habit creation
//   const monthStarts = eachMonthOfInterval({
//     start: creationDate,
//     end: today,
//   });

//   return monthStarts.filter(monthStart => hasPerfectMonth(habit, monthStart))
//     .length;
// };

// /**
//  * Calculates completion rate over a time period
//  */
// export const calculateCompletionRate = (
//   habit: Habit,
//   startDate: Date,
//   endDate: Date,
// ): number => {
//   // Get all scheduled dates in the range
//   const scheduledDates = getScheduledDatesInRange(habit, startDate, endDate);

//   if (scheduledDates.length === 0) {
//     return 0;
//   }

//   // Count completed dates
//   const completedCount = scheduledDates.filter(date =>
//     wasHabitCompletedOnDate(habit, date),
//   ).length;

//   return Math.round((completedCount / scheduledDates.length) * 100);
// };

// /**
//  * Gets the start date of the current streak
//  * @param habit The habit to check
//  * @param settings Streak settings
//  * @returns The start date of the current streak or null
//  */
// export const getCurrentStreakStartDate = (
//   habit: Habit,
//   settings: StreakSettings,
// ): Date | null => {
//   try {
//     const currentStreak = calculateCurrentStreak(habit, settings);

//     if (currentStreak === 0) {
//       return null;
//     }

//     const today = getLocalToday();
//     let currentDate = today;
//     let daysFound = 0;

//     // Go backwards to find the start date
//     for (let i = 0; i < 366; i++) {
//       if (isHabitScheduledForDate(habit, currentDate)) {
//         const wasCompleted = wasHabitCompletedOnDate(habit, currentDate);

//         if (
//           isSameLocalDay(currentDate, today) &&
//           !wasCompleted &&
//           !settings.countTodayInStreaks
//         ) {
//           // Skip today if not completed and we're not counting today
//         } else if (wasCompleted) {
//           daysFound++;

//           // If we've found all days in the streak, this is the start date
//           if (daysFound === currentStreak) {
//             return currentDate;
//           }
//         } else {
//           // Found a break in the streak
//           break;
//         }
//       }

//       currentDate = subDays(currentDate, 1);

//       // If we've gone before the habit was created, stop
//       if (habit.createdAt && isBefore(currentDate, parseISO(habit.createdAt))) {
//         break;
//       }
//     }

//     return null;
//   } catch (error) {
//     console.error('Error finding streak start date:', error);
//     return null;
//   }
// };

// /**
//  * Gets the streak history (all past streaks)
//  */
// export const getStreakHistory = (
//   habit: Habit,
// ): Array<{
//   startDate: string;
//   endDate: string;
//   length: number;
// }> => {
//   if (!habit.createdAt) {
//     return [];
//   }

//   const result = [];
//   const allCompletedDates = getCompletedDates(habit);

//   if (allCompletedDates.length === 0) {
//     return [];
//   }

//   let streakStart: Date | null = null;
//   let streakEnd: Date | null = null;
//   let currentLength = 0;

//   // Get all dates from creation to today
//   const creationDate = parseISO(habit.createdAt);
//   const today = new Date();
//   const allDates = getScheduledDatesInRange(habit, creationDate, today);

//   // Iterate through all scheduled dates
//   for (let i = 0; i < allDates.length; i++) {
//     const currentDate = allDates[i];
//     const wasCompleted = wasHabitCompletedOnDate(habit, currentDate);

//     if (wasCompleted) {
//       // Start or continue a streak
//       if (streakStart === null) {
//         streakStart = currentDate;
//       }

//       streakEnd = currentDate;
//       currentLength++;
//     } else {
//       // End of a streak
//       if (streakStart !== null && streakEnd !== null && currentLength > 0) {
//         result.push({
//           startDate: toDateString(streakStart),
//           endDate: toDateString(streakEnd),
//           length: currentLength,
//         });
//       }

//       // Reset streak tracking
//       streakStart = null;
//       streakEnd = null;
//       currentLength = 0;
//     }
//   }

//   // Don't forget to add the last streak if we ended on a completed day
//   if (streakStart !== null && streakEnd !== null && currentLength > 0) {
//     result.push({
//       startDate: toDateString(streakStart),
//       endDate: toDateString(streakEnd),
//       length: currentLength,
//     });
//   }

//   return result;
// };
