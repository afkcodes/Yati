// // utils/reminders/reminderUtils.ts
// import notifee, {
//   AndroidCategory,
//   AndroidImportance,
//   EventType,
//   RepeatFrequency,
//   TimestampTrigger,
//   TriggerType,
// } from '@notifee/react-native';
// import {parseISO, setHours, setMinutes, startOfDay} from 'date-fns';
// import {DateTime} from 'luxon';
// import {fromISO, now, toJSDate, toUTCISO} from '~/utils/date/dateUtils';
// import {isHabitScheduledForDate} from '~/utils/scheduling/schedulingUtils';
// import {Habit} from '~types/habit.types';
// import {loadHabits, saveHabits} from '~utils/storage/storageUtils';

// interface ReminderSettings {
//   enabled: boolean;
//   defaultReminderTime?: Date; // Time to remind if not specified in the habit
//   vibrateOnReminder: boolean;
//   soundOnReminder: boolean;
// }

// // Default setting for user preferences
// let reminderSettings: ReminderSettings = {
//   enabled: true,
//   defaultReminderTime: setHours(setMinutes(new Date(), 0), 9), // Default to 9 AM
//   vibrateOnReminder: true,
//   soundOnReminder: true,
// };

// /**
//  * Updates the reminder settings
//  * @param settings New settings to merge with existing ones
//  */
// export const updateReminderSettings = (
//   settings: Partial<ReminderSettings>,
// ): void => {
//   reminderSettings = {
//     ...reminderSettings,
//     ...settings,
//   };
// };

// /**
//  * Gets the current reminder settings
//  * @returns The current reminder settings
//  */
// export const getReminderSettings = (): ReminderSettings => {
//   return {...reminderSettings};
// };

// /**
//  * Requests notification permissions
//  * @returns Whether permissions were granted
//  */
// export const requestNotificationPermissions = async (): Promise<boolean> => {
//   try {
//     const settings = await notifee.requestPermission();
//     return settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL
//   } catch (error) {
//     console.error('Error requesting notification permissions:', error);
//     return false;
//   }
// };

// /**
//  * Creates a notification channel for habit reminders
//  */
// export const createNotificationChannels = async (): Promise<void> => {
//   // For Android, we need to create a notification channel
//   await notifee.createChannel({
//     id: 'habit-reminders',
//     name: 'Habit Reminders',
//     description: 'Notifications for habit reminders',
//     importance: AndroidImportance.HIGH,
//     vibration: reminderSettings.vibrateOnReminder,
//     sound: reminderSettings.soundOnReminder ? 'default' : undefined,
//   });

//   await notifee.createChannel({
//     id: 'streak-alerts',
//     name: 'Streak Alerts',
//     description: 'Notifications for streak achievements',
//     importance: AndroidImportance.HIGH,
//     vibration: true,
//     sound: 'default',
//   });
// };

// /**
//  * Initializes Notifee and sets up event listeners
//  * @param onComplete Callback when user completes a habit from notification
//  * @param onSnooze Callback when user snoozes a reminder
//  */
// export const initializeNotifee = async (
//   onComplete: (habitId: string) => void,
//   onSnooze: (
//     habitId: string,
//     reminderIndex: number,
//     originalFireDate: string,
//   ) => void,
// ) => {
//   // Request permissions and create channels
//   const permissionsGranted = await requestNotificationPermissions();
//   if (!permissionsGranted) {
//     console.warn('Notification permissions not granted. Disabling reminders.');
//     updateReminderSettings({enabled: false});
//   } else {
//     console.log('Notification permissions granted.');
//     await createNotificationChannels();
//   }

//   // Handle foreground events
//   notifee.onForegroundEvent(({type, detail}) => {
//     if (type === EventType.ACTION_PRESS && detail.notification?.data?.habitId) {
//       const habitId = detail.notification.data.habitId as string;
//       const reminderIndex = detail.notification.data.reminderIndex as number;
//       const originalFireDate = detail.notification.data
//         .originalFireDate as string;

//       if (detail.pressAction?.id === 'complete') {
//         onComplete(habitId);
//       } else if (detail.pressAction?.id === 'snooze') {
//         onSnooze(habitId, reminderIndex, originalFireDate);
//       }
//     }
//   });

//   // Handle background events
//   notifee.onBackgroundEvent(async ({type, detail}) => {
//     if (type === EventType.ACTION_PRESS && detail.notification?.data?.habitId) {
//       const habitId = detail.notification.data.habitId as string;
//       const reminderIndex = detail.notification.data.reminderIndex as number;
//       const originalFireDate = detail.notification.data
//         .originalFireDate as string;

//       if (detail.pressAction?.id === 'complete') {
//         const habits = loadHabits();
//         const habitIndex = habits.findIndex(h => h.id === habitId);
//         if (habitIndex === -1) {
//           console.warn(`Habit ${habitId} not found in background event`);
//           return;
//         }

//         const habit = {...habits[habitIndex]};
//         const today = now().startOf('day');
//         const dateStr = today.toFormat('yyyy-MM-dd');
//         const currentProgress = habit.progress[dateStr] || {
//           date: dateStr,
//           isCompleted: false,
//         };

//         habit.progress = {
//           ...habit.progress,
//           [dateStr]: {
//             ...currentProgress,
//             isCompleted: true,
//             completedAt: toUTCISO(now()),
//           },
//         };

//         habits[habitIndex] = habit;
//         saveHabits(habits);
//         console.log(`Habit ${habitId} marked as completed in background`);

//         await notifee.cancelNotification(
//           generateNotificationId(habitId, reminderIndex),
//         );
//       } else if (detail.pressAction?.id === 'snooze') {
//         onSnooze(habitId, reminderIndex, originalFireDate);
//       }
//     }
//   });
// };

// // Helper to generate a unique notification ID for a habit reminder
// const generateNotificationId = (
//   habitId: string,
//   reminderIndex: number,
// ): string => {
//   return `${habitId}-${reminderIndex}`;
// };

// /**
//  * Schedules a single reminder for a habit
//  * @param habit The habit to schedule a reminder for
//  * @param reminder The ISO string representing the reminder time
//  * @param reminderIndex The index of the reminder in the habit's reminders array
//  * @returns The ID of the scheduled notification
//  */
// const scheduleReminder = async (
//   habit: Habit,
//   reminder: string,
//   reminderIndex: number,
// ): Promise<string | null> => {
//   try {
//     if (!reminderSettings.enabled) {
//       console.log('Reminders are disabled. Skipping scheduling.');
//       return null;
//     }

//     console.log(
//       `Scheduling reminder ${reminderIndex} for habit ${habit.id}: ${reminder}`,
//     );
//     const dt = fromISO(reminder, 'utc');
//     if (!dt.isValid) {
//       console.warn('Invalid reminder ISO string:', reminder);
//       return null;
//     }

//     const date = toJSDate(dt);
//     if (!(date instanceof Date) || isNaN(date.getTime())) {
//       console.warn('Invalid Date created from reminder ISO string:', reminder);
//       return null;
//     }

//     // Determine repeat frequency based on habit frequency
//     let repeatFrequency: RepeatFrequency | undefined;
//     if (habit.frequency.type === 'daily') {
//       repeatFrequency = RepeatFrequency.DAILY;
//     } else if (habit.frequency.type === 'weekly') {
//       repeatFrequency = RepeatFrequency.WEEKLY;
//     } else if (habit.frequency.type === 'hourly') {
//       repeatFrequency = RepeatFrequency.HOURLY;
//     } else {
//       console.log(
//         `Habit frequency type: ${habit.frequency.type}. Scheduling as one-time notification.`,
//       );
//     }

//     // Check if the reminder is in the future, with a 1-minute buffer
//     const nowDt = now();
//     const bufferTime = nowDt.minus({minutes: 1}); // Allow reminders up to 1 minute in the past
//     let fireDate = dt;
//     if (fireDate < bufferTime) {
//       console.log(
//         `Reminder time ${fireDate.toISO()} is more than 1 minute in the past. Adjusting...`,
//       );
//       if (habit.frequency.type === 'daily') {
//         fireDate = fireDate.plus({days: 1});
//       } else if (habit.frequency.type === 'weekly') {
//         fireDate = fireDate.plus({weeks: 1});
//       } else if (habit.frequency.type === 'hourly') {
//         fireDate = fireDate.plus({hours: 1});
//       } else {
//         let nextDate = nowDt;
//         while (!isHabitScheduledForDate(habit, nextDate) || nextDate < nowDt) {
//           nextDate = nextDate.plus({days: 1});
//         }
//         fireDate = nextDate.set({
//           hour: dt.hour,
//           minute: dt.minute,
//           second: 0,
//           millisecond: 0,
//         });
//       }
//       console.log(`Adjusted fireDate to ${fireDate.toISO()}`);
//     } else {
//       console.log(
//         `Reminder time ${fireDate.toISO()} is within 1 minute of now or in the future. Keeping as is.`,
//       );
//     }

//     // Check if the habit should be active on the trigger date
//     const isActive = await isHabitActiveOnTriggerDate(
//       habit,
//       toJSDate(fireDate),
//     );
//     if (!isActive) {
//       console.log(`Habit ${habit.id} is not active on ${fireDate.toISO()}`);
//       return null;
//     }

//     // Create the trigger
//     const trigger: TimestampTrigger = {
//       type: TriggerType.TIMESTAMP,
//       timestamp: fireDate.toMillis(),
//       repeatFrequency: repeatFrequency,
//     };

//     // Ensure originalFireDate is a string
//     const originalFireDate = fireDate.toISO();
//     if (!originalFireDate) {
//       console.warn('Failed to convert fireDate to ISO string:', fireDate);
//       return null;
//     }

//     // Schedule the notification
//     const notificationId = generateNotificationId(habit.id, reminderIndex);
//     await notifee.createTriggerNotification(
//       {
//         id: notificationId,
//         title: `Reminder: ${habit.title}`,
//         body: `Time to ${habit.description || 'complete your habit'}!`,
//         data: {
//           habitId: habit.id,
//           reminderIndex: reminderIndex,
//           originalFireDate: originalFireDate,
//           type: 'reminder',
//         },
//         android: {
//           channelId: 'habit-reminders',
//           pressAction: {
//             id: 'default',
//             launchActivity: 'default',
//           },
//           category: AndroidCategory.REMINDER,
//           actions: [
//             {
//               title: 'Complete',
//               pressAction: {id: 'complete'},
//             },
//             {
//               title: 'Snooze',
//               pressAction: {id: 'snooze'},
//             },
//           ],
//         },
//         ios: {
//           categoryId: 'habit-reminder',
//         },
//       },
//       trigger,
//     );

//     console.log(
//       `Successfully scheduled reminder for habit ${habit.id} at ${fireDate.toISO()} with ID ${notificationId}`,
//     );
//     return notificationId;
//   } catch (error) {
//     console.error('Error scheduling habit reminder:', error);
//     return null;
//   }
// };

// /**
//  * Schedules all reminders for a habit
//  * @param habit The habit to schedule reminders for
//  */
// export const scheduleHabitReminders = async (habit: Habit): Promise<void> => {
//   try {
//     console.log(
//       'Scheduling reminders for habit:',
//       habit.id,
//       'Enabled:',
//       reminderSettings.enabled,
//     );
//     // Cancel existing reminders first
//     await cancelHabitReminders(habit.id);

//     // Schedule new reminders
//     for (let index = 0; index < habit.reminders.length; index++) {
//       await scheduleReminder(habit, habit.reminders[index], index);
//     }
//   } catch (error) {
//     console.error('Error scheduling reminders for habit:', error);
//   }
// };

// /**
//  * Cancels a scheduled reminder for a habit
//  * @param habitId The ID of the habit to cancel reminders for
//  */
// export const cancelHabitReminders = async (habitId: string): Promise<void> => {
//   try {
//     await notifee.cancelAllNotifications();
//     console.log(`Canceled reminders for habit ${habitId}`);
//   } catch (error) {
//     console.error('Error canceling habit reminders:', error);
//   }
// };

// /**
//  * Reschedules all reminders for habits
//  * @param habits The habits to schedule reminders for
//  */
// export const rescheduleAllReminders = async (
//   habits: Habit[],
// ): Promise<void> => {
//   try {
//     // Cancel all existing reminders
//     await notifee.cancelAllNotifications();

//     // Schedule new reminders for each active habit
//     for (const habit of habits) {
//       if (!habit.archivedAt) {
//         await scheduleHabitReminders(habit);
//       }
//     }
//   } catch (error) {
//     console.error('Error rescheduling reminders:', error);
//   }
// };

// /**
//  * Shows a streak achievement notification
//  * @param habitTitle The title of the habit
//  * @param streakCount The number of days in the streak
//  */
// export const showStreakAchievement = async (
//   habitTitle: string,
//   streakCount: number,
// ): Promise<void> => {
//   if (!reminderSettings.enabled) {
//     return;
//   }

//   try {
//     await notifee.displayNotification({
//       title: '🔥 Streak Achievement!',
//       body: `You've maintained your "${habitTitle}" habit for ${streakCount} days in a row!`,
//       android: {
//         channelId: 'streak-alerts',
//         smallIcon: 'ic_launcher',
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Error showing streak achievement:', error);
//   }
// };

// /**
//  * Checks if a habit should be active on a given trigger date
//  * @param habit The habit to check
//  * @param triggerDate The date to check against
//  * @returns Whether the habit should be active on the trigger date
//  */
// const isHabitActiveOnTriggerDate = async (
//   habit: Habit,
//   triggerDate: Date,
// ): Promise<boolean> => {
//   const normalizedTriggerDate = startOfDay(triggerDate);
//   const normalizedCreatedAt = startOfDay(parseISO(habit.createdAt));

//   // Skip if habit was created after the trigger date (compare dates only)
//   if (normalizedCreatedAt > normalizedTriggerDate) {
//     console.log(
//       `Habit createdAt (${habit.createdAt}) is after trigger date (${triggerDate.toISOString()})`,
//     );
//     return false;
//   }

//   // Skip if habit is archived
//   if (habit.archivedAt && parseISO(habit.archivedAt) <= normalizedTriggerDate) {
//     console.log(
//       `Habit is archived as of ${habit.archivedAt}, before trigger date (${triggerDate.toISOString()})`,
//     );
//     return false;
//   }

//   // Check if the reminder time is after the creation time on the same day
//   const createdAt = parseISO(habit.createdAt);
//   const createdAtDt = DateTime.fromJSDate(createdAt, {zone: 'utc'});
//   const triggerDt = DateTime.fromJSDate(triggerDate, {zone: 'utc'});
//   if (
//     normalizedCreatedAt.toString() === normalizedTriggerDate.toString() &&
//     triggerDt < createdAtDt
//   ) {
//     console.log(
//       `Reminder time (${triggerDate.toISOString()}) is before habit creation time (${habit.createdAt}) on the same day`,
//     );
//     return false;
//   }

//   // Use the app's scheduling utility to check if the habit is active
//   const isScheduled = isHabitScheduledForDate(
//     habit,
//     DateTime.fromJSDate(normalizedTriggerDate),
//   );
//   if (!isScheduled) {
//     console.log(
//       `Habit is not scheduled for ${normalizedTriggerDate.toISOString()}`,
//     );
//   }
//   return isScheduled;
// };

// /**
//  * Snoozes a reminder by 10 minutes
//  * @param habitId The ID of the habit
//  * @param reminderIndex The index of the reminder in the habit's reminders array
//  * @param originalFireDate The original fire date of the reminder (ISO string)
//  * @param habitTitle The title of the habit
//  */
// export const snoozeReminder = async (
//   habitId: string,
//   reminderIndex: number,
//   originalFireDate: string,
//   habitTitle: string,
// ): Promise<void> => {
//   try {
//     // Cancel the current notification
//     await notifee.cancelNotification(
//       generateNotificationId(habitId, reminderIndex),
//     );

//     // Reschedule 10 minutes later
//     const fireDate = fromISO(originalFireDate, 'utc');
//     if (!fireDate.isValid) {
//       console.warn('Invalid original fire date in snooze:', originalFireDate);
//       return;
//     }

//     const snoozeDate = fireDate.plus({minutes: 10});

//     // Create a new trigger
//     const trigger: TimestampTrigger = {
//       type: TriggerType.TIMESTAMP,
//       timestamp: snoozeDate.toMillis(),
//     };

//     // Reschedule the notification
//     await notifee.createTriggerNotification(
//       {
//         id: generateNotificationId(habitId, reminderIndex),
//         title: `Snoozed: ${habitTitle}`,
//         body: 'Snoozed reminder for your habit!',
//         data: {
//           habitId: habitId,
//           reminderIndex: reminderIndex,
//           originalFireDate: originalFireDate,
//           type: 'reminder',
//         },
//         android: {
//           channelId: 'habit-reminders',
//           pressAction: {
//             id: 'default',
//             launchActivity: 'default',
//           },
//           category: AndroidCategory.REMINDER,
//           actions: [
//             {
//               title: 'Complete',
//               pressAction: {id: 'complete'},
//             },
//             {
//               title: 'Snooze',
//               pressAction: {id: 'snooze'},
//             },
//           ],
//         },
//         ios: {
//           categoryId: 'habit-reminder',
//         },
//       },
//       trigger,
//     );

//     console.log(
//       `Snoozed reminder for habit ${habitId} to ${snoozeDate.toISO()}`,
//     );
//   } catch (error) {
//     console.error('Error snoozing reminder:', error);
//   }
// };

// utils/reminders/reminderUtils.ts
import notifee, {
  AndroidCategory,
  AndroidImportance,
  EventType,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {parseISO, setHours, setMinutes, startOfDay} from 'date-fns';
import {DateTime} from 'luxon';
import {Habit} from '~/types/habit.types';
import {fromISO, now, toJSDate, toUTCISO} from '~/utils/date/dateUtils';
import {isHabitScheduledForDate} from '~/utils/scheduling/schedulingUtils';
import {loadHabits, saveHabits} from '~utils/storage/storageUtils';

interface ReminderSettings {
  enabled: boolean;
  defaultReminderTime?: Date; // Time to remind if not specified in the habit
  vibrateOnReminder: boolean;
  soundOnReminder: boolean;
}

// Default setting for user preferences
let reminderSettings: ReminderSettings = {
  enabled: true,
  defaultReminderTime: setHours(setMinutes(new Date(), 0), 9), // Default to 9 AM
  vibrateOnReminder: true,
  soundOnReminder: true,
};

/**
 * Updates the reminder settings
 * @param settings New settings to merge with existing ones
 */
export const updateReminderSettings = (
  settings: Partial<ReminderSettings>,
): void => {
  reminderSettings = {
    ...reminderSettings,
    ...settings,
  };
};

/**
 * Gets the current reminder settings
 * @returns The current reminder settings
 */
export const getReminderSettings = (): ReminderSettings => {
  return {...reminderSettings};
};

/**
 * Requests notification permissions
 * @returns Whether permissions were granted
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Creates a notification channel for habit reminders
 */
export const createNotificationChannels = async (): Promise<void> => {
  // For Android, we need to create a notification channel
  await notifee.createChannel({
    id: 'habit-reminders',
    name: 'Habit Reminders',
    description: 'Notifications for habit reminders',
    importance: AndroidImportance.HIGH,
    vibration: reminderSettings.vibrateOnReminder,
    sound: reminderSettings.soundOnReminder ? 'default' : undefined,
  });

  await notifee.createChannel({
    id: 'streak-alerts',
    name: 'Streak Alerts',
    description: 'Notifications for streak achievements',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
  });

  await notifee.createChannel({
    id: 'habit-completions',
    name: 'Habit Completions',
    description: 'Notifications for habit completion confirmations',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
    sound: 'default',
  });
};

/**
 * Initializes Notifee and sets up event listeners
 * @param onComplete Callback when user completes a habit from notification
 * @param onSnooze Callback when user snoozes a reminder
 */
export const initializeNotifee = async (
  onComplete: (habitId: string) => void,
  onSnooze: (
    habitId: string,
    reminderIndex: number,
    originalFireDate: string,
  ) => void,
) => {
  // Request permissions and create channels
  const permissionsGranted = await requestNotificationPermissions();
  if (!permissionsGranted) {
    console.warn('Notification permissions not granted. Disabling reminders.');
    updateReminderSettings({enabled: false});
  } else {
    console.log('Notification permissions granted.');
    await createNotificationChannels();
  }

  // Handle foreground events
  notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.ACTION_PRESS && detail.notification?.data?.habitId) {
      const habitId = detail.notification.data.habitId as string;
      const reminderIndex = detail.notification.data.reminderIndex as number;
      const originalFireDate = detail.notification.data
        .originalFireDate as string;

      if (detail.pressAction?.id === 'complete') {
        onComplete(habitId);
      } else if (detail.pressAction?.id === 'snooze') {
        onSnooze(habitId, reminderIndex, originalFireDate);
      }
    }
  });

  // Handle background events
  notifee.onBackgroundEvent(async ({type, detail}) => {
    console.log('Background event triggered:', {type, detail});
    if (type === EventType.ACTION_PRESS && detail.notification?.data?.habitId) {
      const habitId = detail.notification.data.habitId as string;
      const reminderIndex = detail.notification.data.reminderIndex as number;
      const originalFireDate = detail.notification.data
        .originalFireDate as string;

      if (detail.pressAction?.id === 'complete') {
        console.log(`Processing 'Complete' action for habit ${habitId}`);
        try {
          console.log('Loading habits from MMKV...');
          const habits = loadHabits();
          console.log('Habits loaded:', habits.length, 'habits found');
          const habitIndex = habits.findIndex(h => h.id === habitId);
          if (habitIndex === -1) {
            console.warn(`Habit ${habitId} not found in background event`);
            await notifee.displayNotification({
              title: 'Error',
              body: 'Habit not found. Please open the app to mark it as complete.',
              android: {
                channelId: 'habit-completions',
                smallIcon: 'ic_launcher',
                pressAction: {
                  id: 'default',
                },
              },
            });
            return;
          }

          const habit = {...habits[habitIndex]};
          console.log('Habit found:', habit.title);
          const today = now().startOf('day');
          const dateStr = today.toFormat('yyyy-MM-dd');
          const currentProgress = habit.progress[dateStr] || {
            date: dateStr,
            isCompleted: false,
          };

          habit.progress = {
            ...habit.progress,
            [dateStr]: {
              ...currentProgress,
              isCompleted: true,
              completedAt: toUTCISO(now()),
            },
          };

          habits[habitIndex] = habit;
          console.log('Saving updated habits to MMKV...');
          saveHabits(habits);
          console.log(`Habit ${habitId} marked as completed in background`);

          // Show a confirmation notification
          await notifee.displayNotification({
            title: 'Habit Completed!',
            body: `You marked "${habit.title}" as complete.`,
            android: {
              channelId: 'habit-completions',
              smallIcon: 'ic_launcher',
              pressAction: {
                id: 'default',
              },
            },
          });

          // Cancel the original reminder notification
          await notifee.cancelNotification(
            generateNotificationId(habitId, reminderIndex),
          );
          console.log(
            `Canceled notification for habit ${habitId}, reminder ${reminderIndex}`,
          );
        } catch (error) {
          console.error(
            'Error marking habit as complete in background:',
            error,
          );
          await notifee.displayNotification({
            title: 'Error',
            body: 'Failed to mark habit as complete. Please try again in the app.',
            android: {
              channelId: 'habit-completions',
              smallIcon: 'ic_launcher',
              pressAction: {
                id: 'default',
              },
            },
          });
        }
      } else if (detail.pressAction?.id === 'snooze') {
        console.log(`Processing 'Snooze' action for habit ${habitId}`);
        onSnooze(habitId, reminderIndex, originalFireDate);
      } else {
        console.log(`Unknown action: ${detail.pressAction?.id}`);
      }
    } else {
      console.log('Background event not related to habit action:', {
        type,
        detail,
      });
    }
  });
};

// Helper to generate a unique notification ID for a habit reminder
const generateNotificationId = (
  habitId: string,
  reminderIndex: number,
): string => {
  return `${habitId}-${reminderIndex}`;
};

/**
 * Schedules a single reminder for a habit
 * @param habit The habit to schedule a reminder for
 * @param reminder The ISO string representing the reminder time
 * @param reminderIndex The index of the reminder in the habit's reminders array
 * @returns The ID of the scheduled notification
 */
const scheduleReminder = async (
  habit: Habit,
  reminder: string,
  reminderIndex: number,
): Promise<string | null> => {
  try {
    if (!reminderSettings.enabled) {
      console.log('Reminders are disabled. Skipping scheduling.');
      return null;
    }

    console.log(
      `Scheduling reminder ${reminderIndex} for habit ${habit.id}: ${reminder}`,
    );
    const dt = fromISO(reminder, 'utc');
    if (!dt.isValid) {
      console.warn('Invalid reminder ISO string:', reminder);
      return null;
    }

    const date = toJSDate(dt);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('Invalid Date created from reminder ISO string:', reminder);
      return null;
    }

    // Determine repeat frequency based on habit frequency
    let repeatFrequency: RepeatFrequency | undefined;
    if (habit.frequency.type === 'daily') {
      repeatFrequency = RepeatFrequency.DAILY;
    } else if (habit.frequency.type === 'weekly') {
      repeatFrequency = RepeatFrequency.WEEKLY;
    } else if (habit.frequency.type === 'hourly') {
      repeatFrequency = RepeatFrequency.HOURLY;
    } else {
      console.log(
        `Habit frequency type: ${habit.frequency.type}. Scheduling as one-time notification.`,
      );
    }

    // Check if the reminder is in the future, with a 1-minute buffer
    const nowDt = now();
    const bufferTime = nowDt.minus({minutes: 1}); // Allow reminders up to 1 minute in the past
    let fireDate = dt;
    if (fireDate < bufferTime) {
      console.log(
        `Reminder time ${fireDate.toISO()} is more than 1 minute in the past. Adjusting...`,
      );
      if (habit.frequency.type === 'daily') {
        fireDate = fireDate.plus({days: 1});
      } else if (habit.frequency.type === 'weekly') {
        fireDate = fireDate.plus({weeks: 1});
      } else if (habit.frequency.type === 'hourly') {
        fireDate = fireDate.plus({hours: 1});
      } else {
        let nextDate = nowDt;
        while (!isHabitScheduledForDate(habit, nextDate) || nextDate < nowDt) {
          nextDate = nextDate.plus({days: 1});
        }
        fireDate = nextDate.set({
          hour: dt.hour,
          minute: dt.minute,
          second: 0,
          millisecond: 0,
        });
      }
      console.log(`Adjusted fireDate to ${fireDate.toISO()}`);
    } else {
      console.log(
        `Reminder time ${fireDate.toISO()} is within 1 minute of now or in the future. Keeping as is.`,
      );
    }

    // Check if the habit should be active on the trigger date
    const isActive = await isHabitActiveOnTriggerDate(
      habit,
      toJSDate(fireDate),
    );
    if (!isActive) {
      console.log(`Habit ${habit.id} is not active on ${fireDate.toISO()}`);
      return null;
    }

    // Create the trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: fireDate.toMillis(),
      repeatFrequency: repeatFrequency,
    };

    // Ensure originalFireDate is a string
    const originalFireDate = fireDate.toISO();
    if (!originalFireDate) {
      console.warn('Failed to convert fireDate to ISO string:', fireDate);
      return null;
    }

    // Schedule the notification
    const notificationId = generateNotificationId(habit.id, reminderIndex);
    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: `Reminder: ${habit.title}`,
        body: `Time to ${habit.description || 'complete your habit'}!`,
        data: {
          habitId: habit.id,
          reminderIndex: reminderIndex,
          originalFireDate: originalFireDate,
          type: 'reminder',
        },
        android: {
          channelId: 'habit-reminders',
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          category: AndroidCategory.REMINDER,
          actions: [
            {
              title: 'Complete',
              pressAction: {id: 'complete'},
            },
            {
              title: 'Snooze',
              pressAction: {id: 'snooze'},
            },
          ],
        },
        ios: {
          categoryId: 'habit-reminder',
        },
      },
      trigger,
    );

    console.log(
      `Successfully scheduled reminder for habit ${habit.id} at ${fireDate.toISO()} with ID ${notificationId}`,
    );
    return notificationId;
  } catch (error) {
    console.error('Error scheduling habit reminder:', error);
    return null;
  }
};

/**
 * Schedules all reminders for a habit
 * @param habit The habit to schedule reminders for
 */
export const scheduleHabitReminders = async (habit: Habit): Promise<void> => {
  try {
    console.log(
      'Scheduling reminders for habit:',
      habit.id,
      'Enabled:',
      reminderSettings.enabled,
    );
    // Cancel existing reminders first
    await cancelHabitReminders(habit.id);

    // Schedule new reminders
    for (let index = 0; index < habit.reminders.length; index++) {
      await scheduleReminder(habit, habit.reminders[index], index);
    }
  } catch (error) {
    console.error('Error scheduling reminders for habit:', error);
  }
};

/**
 * Cancels a scheduled reminder for a habit
 * @param habitId The ID of the habit to cancel reminders for
 */
export const cancelHabitReminders = async (habitId: string): Promise<void> => {
  try {
    await notifee.cancelAllNotifications();
    console.log(`Canceled reminders for habit ${habitId}`);
  } catch (error) {
    console.error('Error canceling habit reminders:', error);
  }
};

/**
 * Reschedules all reminders for habits
 * @param habits The habits to schedule reminders for
 */
export const rescheduleAllReminders = async (
  habits: Habit[],
): Promise<void> => {
  try {
    // Cancel all existing reminders
    await notifee.cancelAllNotifications();

    // Schedule new reminders for each active habit
    for (const habit of habits) {
      if (!habit.archivedAt) {
        await scheduleHabitReminders(habit);
      }
    }
  } catch (error) {
    console.error('Error rescheduling reminders:', error);
  }
};

/**
 * Shows a streak achievement notification
 * @param habitTitle The title of the habit
 * @param streakCount The number of days in the streak
 */
export const showStreakAchievement = async (
  habitTitle: string,
  streakCount: number,
): Promise<void> => {
  if (!reminderSettings.enabled) {
    return;
  }

  try {
    await notifee.displayNotification({
      title: '🔥 Streak Achievement!',
      body: `You've maintained your "${habitTitle}" habit for ${streakCount} days in a row!`,
      android: {
        channelId: 'streak-alerts',
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (error) {
    console.error('Error showing streak achievement:', error);
  }
};

/**
 * Checks if a habit should be active on a given trigger date
 * @param habit The habit to check
 * @param triggerDate The date to check against
 * @returns Whether the habit should be active on the trigger date
 */
const isHabitActiveOnTriggerDate = async (
  habit: Habit,
  triggerDate: Date,
): Promise<boolean> => {
  const normalizedTriggerDate = startOfDay(triggerDate);
  const normalizedCreatedAt = startOfDay(parseISO(habit.createdAt));

  // Skip if habit was created after the trigger date (compare dates only)
  if (normalizedCreatedAt > normalizedTriggerDate) {
    console.log(
      `Habit createdAt (${habit.createdAt}) is after trigger date (${triggerDate.toISOString()})`,
    );
    return false;
  }

  // Skip if habit is archived
  if (habit.archivedAt && parseISO(habit.archivedAt) <= normalizedTriggerDate) {
    console.log(
      `Habit is archived as of ${habit.archivedAt}, before trigger date (${triggerDate.toISOString()})`,
    );
    return false;
  }

  // Check if the reminder time is after the creation time on the same day
  const createdAt = parseISO(habit.createdAt);
  const createdAtDt = DateTime.fromJSDate(createdAt, {zone: 'utc'});
  const triggerDt = DateTime.fromJSDate(triggerDate, {zone: 'utc'});
  if (
    normalizedCreatedAt.toString() === normalizedTriggerDate.toString() &&
    triggerDt < createdAtDt
  ) {
    console.log(
      `Reminder time (${triggerDate.toISOString()}) is before habit creation time (${habit.createdAt}) on the same day`,
    );
    return false;
  }

  // Use the app's scheduling utility to check if the habit is active
  const isScheduled = isHabitScheduledForDate(
    habit,
    DateTime.fromJSDate(normalizedTriggerDate),
  );
  if (!isScheduled) {
    console.log(
      `Habit is not scheduled for ${normalizedTriggerDate.toISOString()}`,
    );
  }
  return isScheduled;
};

/**
 * Snoozes a reminder by 10 minutes
 * @param habitId The ID of the habit
 * @param reminderIndex The index of the reminder in the habit's reminders array
 * @param originalFireDate The original fire date of the reminder (ISO string)
 * @param habitTitle The title of the habit
 */
export const snoozeReminder = async (
  habitId: string,
  reminderIndex: number,
  originalFireDate: string,
  habitTitle: string,
): Promise<void> => {
  try {
    // Cancel the current notification
    await notifee.cancelNotification(
      generateNotificationId(habitId, reminderIndex),
    );

    // Reschedule 10 minutes later
    const fireDate = fromISO(originalFireDate, 'utc');
    if (!fireDate.isValid) {
      console.warn('Invalid original fire date in snooze:', originalFireDate);
      return;
    }

    const snoozeDate = fireDate.plus({minutes: 10});

    // Create a new trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: snoozeDate.toMillis(),
    };

    // Reschedule the notification
    await notifee.createTriggerNotification(
      {
        id: generateNotificationId(habitId, reminderIndex),
        title: `Snoozed: ${habitTitle}`,
        body: 'Snoozed reminder for your habit!',
        data: {
          habitId: habitId,
          reminderIndex: reminderIndex,
          originalFireDate: originalFireDate,
          type: 'reminder',
        },
        android: {
          channelId: 'habit-reminders',
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          category: AndroidCategory.REMINDER,
          actions: [
            {
              title: 'Complete',
              pressAction: {id: 'complete'},
            },
            {
              title: 'Snooze',
              pressAction: {id: 'snooze'},
            },
          ],
        },
        ios: {
          categoryId: 'habit-reminder',
        },
      },
      trigger,
    );

    console.log(
      `Snoozed reminder for habit ${habitId} to ${snoozeDate.toISO()}`,
    );
  } catch (error) {
    console.error('Error snoozing reminder:', error);
  }
};
