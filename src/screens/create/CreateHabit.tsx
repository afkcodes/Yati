import {NavigationContext} from 'navigation-react';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import HabitForm from '~/screens/form/HabitForm';
import {habitActions} from '~/state/habit.store';
import {HabitFormData} from '~/types/habit.types';
import {
  createNotificationChannels,
  requestNotificationPermissions,
  scheduleHabitReminder,
} from '~utils/reminders/reminderUtils';

/**
 * Screen component for creating a new habit
 * Uses the HabitForm component and connects it to the habit store
 */
const CreateHabitScreen: React.FC = () => {
  const {stateNavigator} = useContext(NavigationContext);
  const {theme} = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: HabitFormData) => {
    try {
      setIsSubmitting(true);

      // Add habit to the store
      const newHabit = habitActions.addHabit(formData);
      console.log('Created habit:', newHabit);

      // Request permissions if not already granted
      const permissionGranted = await requestNotificationPermissions();

      if (permissionGranted) {
        // Create channels if not already created
        await createNotificationChannels();

        // Schedule reminders
        if (formData.reminders && formData.reminders.length > 0) {
          console.log(
            'Scheduling reminders for new habit:',
            formData.reminders.length,
          );

          for (const reminderTime of formData.reminders) {
            try {
              // Make sure reminderTime is a valid Date object
              const reminderDate =
                reminderTime instanceof Date
                  ? reminderTime
                  : new Date(reminderTime);

              // Schedule the reminder
              const result = await scheduleHabitReminder(
                newHabit,
                reminderDate,
              );
              console.log(
                `Reminder scheduled for ${reminderDate.toLocaleTimeString()}: ${
                  result ? 'Success' : 'Failed'
                }`,
              );
            } catch (reminderError) {
              console.error('Error scheduling reminder:', reminderError);
            }
          }
        } else {
          console.log('No reminders to schedule');
        }
      } else {
        console.log('Notification permissions not granted');
        // Optionally show an alert to inform the user about missing permissions
        Alert.alert(
          'Notification Permission',
          'Please enable notifications in your device settings to receive reminders for your habits.',
          [{text: 'OK'}],
        );
      }

      // Show success message
      Alert.alert(
        'Habit Created',
        `"${newHabit.title}" has been successfully created.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Force an update to the store before navigation
              habitActions.forceUpdate();

              // Navigate back to home screen
              if (stateNavigator) {
                stateNavigator.navigateBack(1);
              }
            },
          },
        ],
      );
    } catch (error) {
      // Handle any errors
      console.error('Failed to create habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.', [
        {text: 'OK'},
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    stateNavigator?.navigateBack(1);
  };

  return (
    <ViewX flex={1} variant="base" zIndex={10}>
      <HabitForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
        title="Create Habit"
      />
    </ViewX>
  );
};

export default CreateHabitScreen;
