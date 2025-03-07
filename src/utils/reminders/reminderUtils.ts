// utils/reminders/reminderUtils.ts
import notifee, {
  AndroidCategory,
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {format, isBefore, parseISO, setHours, setMinutes} from 'date-fns';
import {Habit} from '~/types/habit.types';

interface ReminderSettings {
  enabled: boolean;
  defaultReminderTime?: Date; // Time to remind if not specified in the habit
  vibrateOnReminder: boolean;
  soundOnReminder: boolean;
}

// Default setting for user preferences
let reminderSettings: ReminderSettings = {
  enabled: true,
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
    lights: true,
    vibration: reminderSettings.vibrateOnReminder,
    importance: AndroidImportance.HIGH,
    sound: reminderSettings.soundOnReminder ? 'default' : undefined,
  });

  await notifee.createChannel({
    id: 'streak-alerts',
    name: 'Streak Alerts',
    lights: true,
    vibration: true,
    importance: AndroidImportance.HIGH,
  });
};

/**
 * Schedules a reminder for a habit
 * @param habit The habit to schedule a reminder for
 * @param reminderTime The time to schedule the reminder (defaults to habit's frequency time)
 * @returns The ID of the scheduled notification
 */
export const scheduleHabitReminder = async (
  habit: Habit,
  reminderTime?: Date,
): Promise<string | null> => {
  try {
    if (!reminderSettings.enabled) {
      return null;
    }

    // Determine when to schedule the reminder
    let triggerTime: Date;

    if (reminderTime) {
      // Use provided reminder time
      triggerTime = new Date(reminderTime);
    } else if (habit.frequency.timeOfDay) {
      // Use habit's frequency time
      triggerTime = new Date(habit.frequency.timeOfDay);
    } else if (reminderSettings.defaultReminderTime) {
      // Use default reminder time from settings
      triggerTime = new Date(reminderSettings.defaultReminderTime);
    } else {
      // Default to 9am if no time specified
      const now = new Date();
      triggerTime = setHours(setMinutes(now, 0), 9);
    }

    // Make sure the trigger time is in the future
    const now = new Date();
    if (isBefore(triggerTime, now)) {
      // If it's in the past, schedule for tomorrow
      triggerTime.setDate(triggerTime.getDate() + 1);
    }

    // Create the trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTime.getTime(),
    };

    // Check if this habit should be active on the trigger date
    const isHabitActive = await isHabitActiveOnTriggerDate(habit, triggerTime);
    if (!isHabitActive) {
      return null;
    }

    // Create the notification
    return await notifee.createTriggerNotification(
      {
        id: `habit-reminder-${habit.id}`,
        title: habit.title,
        body: `Time to ${habit.description || 'complete your habit'}!`,
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
              pressAction: {
                id: 'complete',
              },
            },
            {
              title: 'Snooze',
              pressAction: {
                id: 'snooze',
              },
            },
          ],
        },
        ios: {
          categoryId: 'habit-reminder',
        },
        data: {
          habitId: habit.id,
          type: 'reminder',
        },
      },
      trigger,
    );
  } catch (error) {
    console.error('Error scheduling habit reminder:', error);
    return null;
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
  const {type, value} = habit.frequency;
  const triggerDateStr = format(triggerDate, 'yyyy-MM-dd');

  // Skip if habit was created after the trigger date
  if (parseISO(habit.createdAt) > triggerDate) {
    return false;
  }

  // Skip if habit is archived
  if (habit.archivedAt && parseISO(habit.archivedAt) <= triggerDate) {
    return false;
  }

  // Check frequency type
  if (type === 'daily') {
    return true; // Active every day
  }

  if (type === 'hourly') {
    return true; // Active every day
  }

  if (type === 'weekly') {
    // Check if the day of week matches
    const dayOfWeek = format(triggerDate, 'EEE').toLowerCase();
    return value.includes(dayOfWeek);
  }

  if (type === 'monthly') {
    // Check if the day of month matches
    const dayOfMonth = format(triggerDate, 'd');
    return value.includes(dayOfMonth);
  }

  return false;
};

/**
 * Cancels a scheduled reminder for a habit
 * @param habitId The ID of the habit to cancel reminders for
 */
export const cancelHabitReminder = async (habitId: string): Promise<void> => {
  try {
    await notifee.cancelNotification(`habit-reminder-${habitId}`);
  } catch (error) {
    console.error('Error canceling habit reminder:', error);
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
        await scheduleHabitReminder(habit);
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
 * Sets up notification listeners for handling user interactions
 * @param onComplete Callback when user completes a habit from notification
 * @param onSnooze Callback when user snoozes a reminder
 */
export const setupNotificationListeners = (
  onComplete: (habitId: string) => void,
  onSnooze: (habitId: string) => void,
) => {
  return notifee.onForegroundEvent(({type, detail}) => {
    if (type === 1 && detail.pressAction) {
      // NotificationEventType.ACTION_PRESS
      const {pressAction, notification} = detail;

      if (notification?.data?.habitId) {
        const habitId = notification.data.habitId as string;

        switch (pressAction.id) {
          case 'complete':
            onComplete(habitId);
            break;
          case 'snooze':
            onSnooze(habitId);
            break;
        }
      }
    }
  });
};
