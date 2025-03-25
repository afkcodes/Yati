// utils/habitValidation.ts
import {
  COLOR_PALETTE,
  COMMON_UNITS,
  EVALUATION_TYPES,
  FREQUENCY_TYPES,
  HABIT_CATEGORIES,
  TIME_UNITS,
  WEEKDAYS,
} from '~/utils/constants/habitConstants';
import {
  fromISO,
  fromJSDate,
  now,
  startOfDay,
  toUTCISO,
} from '~/utils/date/dateUtils';
import {isHabitScheduledForDate} from '~/utils/scheduling/schedulingUtils';
import {Habit, HabitFormData, HabitFormErrors} from '~types/habit.types';

export function validateHabitForm(formData: HabitFormData): HabitFormErrors {
  const errors: HabitFormErrors = {};

  // Title validation
  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (formData.title.length < 2) {
    errors.title = 'Title must be at least 2 characters';
  } else if (formData.title.length > 50) {
    errors.title = 'Title must be 50 characters or less';
  }

  // Category validation
  if (
    !formData.category ||
    !HABIT_CATEGORIES.some(cat => cat.id === formData.category)
  ) {
    errors.category = `Category must be one of: ${HABIT_CATEGORIES.map(cat => cat.id).join(', ')}`;
  }

  // Color validation
  if (!formData.color || !COLOR_PALETTE.includes(formData.color)) {
    errors.color = `Color must be one of: ${COLOR_PALETTE.join(', ')}`;
  }

  // Frequency validation
  if (
    !formData.frequency ||
    !FREQUENCY_TYPES.some(ft => ft.id === formData.frequency.type)
  ) {
    errors.frequency = `Frequency must be one of: ${FREQUENCY_TYPES.map(ft => ft.id).join(', ')}`;
  } else {
    switch (formData.frequency.type) {
      case 'weekly':
        if (
          !formData.frequency.value ||
          formData.frequency.value.length === 0
        ) {
          errors.frequency =
            'At least one day must be selected for weekly frequency';
        } else if (
          !formData.frequency.value.every(day =>
            WEEKDAYS.some(wd => wd.id === day),
          )
        ) {
          errors.frequency = `Days must be one of: ${WEEKDAYS.map(wd => wd.id).join(', ')}`;
        }
        if (
          !formData.frequency.timeOfDay ||
          !(formData.frequency.timeOfDay instanceof Date)
        ) {
          errors.frequency = 'Time of day must be a valid Date';
        }
        break;

      case 'monthly':
        if (
          !formData.frequency.value ||
          formData.frequency.value.length === 0
        ) {
          errors.frequency =
            'At least one date must be selected for monthly frequency';
        } else {
          const invalidDates = formData.frequency.value
            .map(Number)
            .filter(date => !Number.isInteger(date) || date < 1 || date > 31);
          if (invalidDates.length > 0) {
            errors.frequency = 'Dates must be integers between 1 and 31';
          } else if (
            new Set(formData.frequency.value).size !==
            formData.frequency.value.length
          ) {
            errors.frequency = 'Dates must be unique';
          }
        }
        if (
          !formData.frequency.timeOfDay ||
          !(formData.frequency.timeOfDay instanceof Date)
        ) {
          errors.frequency = 'Time of day must be a valid Date';
        }
        break;

      case 'hourly':
        if (
          !formData.frequency.interval ||
          !Number.isInteger(formData.frequency.interval) ||
          formData.frequency.interval < 1
        ) {
          errors.frequency = 'Interval must be a positive integer';
        } else if (formData.frequency.interval > 24) {
          errors.frequency = 'Interval must not exceed 24 hours';
        }
        break;

      case 'daily':
        if (
          !formData.frequency.timeOfDay ||
          !(formData.frequency.timeOfDay instanceof Date)
        ) {
          errors.frequency = 'Time of day must be a valid Date';
        }
        break;
    }
  }

  // Evaluation validation
  if (
    !formData.evaluation ||
    !EVALUATION_TYPES.some(et => et.id === formData.evaluation.type)
  ) {
    errors.evaluation = `Evaluation type must be one of: ${EVALUATION_TYPES.map(et => et.id).join(', ')}`;
  } else {
    if (
      !formData.evaluation.target ||
      !Number.isFinite(formData.evaluation.target) ||
      formData.evaluation.target <= 0
    ) {
      errors.evaluation = 'Target must be a positive number';
    }

    switch (formData.evaluation.type) {
      case 'boolean':
        if (formData.evaluation.target !== 1) {
          errors.evaluation = 'Target must be 1 for Yes/No tracking';
        }
        if (formData.evaluation.unit !== '') {
          errors.evaluation = 'Unit must be empty for Yes/No tracking';
        }
        break;

      case 'numeric':
        if (
          !formData.evaluation.unit ||
          formData.evaluation.unit.trim() === ''
        ) {
          errors.evaluation = 'Unit is required for numeric evaluation';
        } else if (
          !COMMON_UNITS.some(unit => unit.id === formData.evaluation.unit) &&
          formData.evaluation.unit.length > 20
        ) {
          errors.evaluation = 'Custom unit must be 20 characters or less';
        }
        break;

      case 'timer':
        if (
          !formData.evaluation.unit ||
          !TIME_UNITS.some(unit => unit.id === formData.evaluation.unit)
        ) {
          errors.evaluation = `Unit must be one of: ${TIME_UNITS.map(unit => unit.id).join(', ')}`;
        }
        break;

      case 'checklist':
        if (
          !formData.evaluation.checklistItems ||
          formData.evaluation.checklistItems.length === 0
        ) {
          errors.evaluation = 'At least one checklist item is required';
        } else {
          const invalidItems = formData.evaluation.checklistItems.filter(
            item => !item.id || !item.text || item.text.trim() === '',
          );
          if (invalidItems.length > 0) {
            errors.evaluation =
              'All checklist items must have an ID and non-empty text';
          }
          if (
            new Set(formData.evaluation.checklistItems.map(item => item.id))
              .size !== formData.evaluation.checklistItems.length
          ) {
            errors.evaluation = 'Checklist item IDs must be unique';
          }
        }
        if (
          formData.evaluation.target >
          (formData.evaluation.checklistItems?.length || 0)
        ) {
          errors.evaluation =
            'Target cannot exceed the number of checklist items';
        }
        if (formData.evaluation.unit !== '') {
          errors.evaluation = 'Unit must be empty for checklist tracking';
        }
        break;
    }
  }

  // Goal validation
  if (formData.goal && formData.goal.enabled) {
    const goal = formData.goal;
    if (!goal.target || !Number.isFinite(goal.target) || goal.target <= 0) {
      errors.goal = 'Goal target must be a positive number';
    }
    if (
      !goal.timeframe ||
      !['weekly', 'monthly', 'yearly'].includes(goal.timeframe)
    ) {
      errors.goal = 'Goal timeframe must be weekly, monthly, or yearly';
    }
    if (
      !goal.deadline ||
      !(goal.deadline instanceof Date) ||
      isNaN(goal.deadline.getTime())
    ) {
      errors.goal = 'Deadline must be a valid Date';
    } else {
      const deadline = fromJSDate(goal.deadline, 'local');
      const today = startOfDay(now());
      if (deadline < today) {
        errors.goal = 'Deadline cannot be in the past';
      }
    }
  }

  // Reminders validation
  console.log('Validating reminders:', formData.reminders);
  if (!formData.reminders || formData.reminders.length === 0) {
    console.log('No reminders found');
    errors.reminders = 'At least one reminder is required';
  } else {
    const currentTime = now();
    const bufferTime = currentTime.minus({minutes: 1}); // Allow reminders up to 1 minute in the past
    formData.reminders.forEach((reminder, index) => {
      const prefix = `Reminder ${index + 1}: `;
      const reminderDt = fromISO(reminder, 'utc');
      if (!reminderDt.isValid) {
        console.log(`${prefix}Invalid ISO string:`, reminder);
        errors.reminders = `${prefix}Valid ISO string is required`;
        return;
      }

      // Adjust past reminders based on frequency, but only if more than 1 minute in the past
      if (reminderDt < bufferTime) {
        let adjustedReminder = reminderDt;
        if (formData.frequency.type === 'daily') {
          adjustedReminder = adjustedReminder.plus({days: 1});
        } else if (formData.frequency.type === 'weekly') {
          adjustedReminder = adjustedReminder.plus({weeks: 1});
        } else if (formData.frequency.type === 'hourly') {
          adjustedReminder = adjustedReminder.plus({hours: 1});
        } else {
          let nextDate = currentTime;
          while (
            !isHabitScheduledForDate(formData as Habit, nextDate) ||
            nextDate < currentTime
          ) {
            nextDate = nextDate.plus({days: 1});
          }
          adjustedReminder = nextDate.set({
            hour: reminderDt.hour,
            minute: reminderDt.minute,
            second: 0,
            millisecond: 0,
          });
        }
        console.log(
          `${prefix}Adjusted from ${reminderDt.toISO()} to ${adjustedReminder.toISO()}`,
        );
        formData.reminders[index] = toUTCISO(adjustedReminder);
      } else {
        console.log(
          `${prefix}Reminder is within 1 minute of now or in the future: ${reminderDt.toISO()}`,
        );
      }
    });
  }

  return errors;
}

export function isHabitFormValid(formData: HabitFormData): boolean {
  const errors = validateHabitForm(formData);
  return Object.keys(errors).length === 0;
}
