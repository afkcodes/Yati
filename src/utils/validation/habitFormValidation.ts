import {HabitFormData, HabitFormErrors} from '~/types/habit.types';

/**
 * Validates a habit form and returns any errors
 * @param formData The habit form data to validate
 * @returns An object containing validation errors, or an empty object if valid
 */
export const validateHabitForm = (formData: HabitFormData): HabitFormErrors => {
  const errors: HabitFormErrors = {};

  // Title validation
  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.length < 2) {
    errors.title = 'Title must be at least 2 characters';
  } else if (formData.title.length > 50) {
    errors.title = 'Title must be less than 50 characters';
  }

  // Category validation
  if (!formData.categoryId) {
    errors.categoryId = 'Category is required';
  }

  // Frequency validation
  if (
    formData.frequency.type === 'weekly' &&
    formData.frequency.value.length === 0
  ) {
    errors.frequency = 'Please select at least one day of the week';
  } else if (
    formData.frequency.type === 'monthly' &&
    formData.frequency.value.length === 0
  ) {
    errors.frequency = 'Please select at least one day of the month';
  } else if (
    formData.frequency.type === 'hourly' &&
    (!formData.frequency.interval || formData.frequency.interval < 1)
  ) {
    errors.frequency = 'Please specify a valid hourly interval';
  }

  // Validate time of day for daily, weekly, monthly
  if (
    (formData.frequency.type === 'daily' ||
      formData.frequency.type === 'weekly' ||
      formData.frequency.type === 'monthly') &&
    !formData.frequency.timeOfDay
  ) {
    errors.frequency = 'Please select a time of day';
  }

  // Evaluation validation
  if (
    formData.evaluation.type === 'numeric' ||
    formData.evaluation.type === 'timer'
  ) {
    if (formData.evaluation.target <= 0) {
      errors.evaluation = 'Please set a target value greater than zero';
    }

    if (formData.evaluation.type === 'numeric' && !formData.evaluation.unit) {
      errors.evaluation = 'Please specify a unit for your measurement';
    }
  } else if (formData.evaluation.type === 'checklist') {
    if (
      !formData.evaluation.checklistItems ||
      formData.evaluation.checklistItems.length === 0
    ) {
      errors.evaluation = 'Please add at least one checklist item';
    } else if (formData.evaluation.target <= 0) {
      errors.evaluation = 'Please set a target number of items to complete';
    } else if (
      formData.evaluation.target > formData.evaluation.checklistItems.length
    ) {
      errors.evaluation =
        'Target cannot be greater than the number of checklist items';
    }
  }

  // Goal validation (if enabled)
  if (formData.goal.enabled) {
    if (formData.goal.target <= 0) {
      errors.goal = 'Please set a target value greater than zero';
    }

    if (!formData.goal.deadline) {
      errors.goal = 'Please set a deadline for your goal';
    } else {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const deadline = new Date(formData.goal.deadline);
      deadline.setHours(0, 0, 0, 0);

      if (deadline < now) {
        errors.goal = 'Deadline cannot be in the past';
      }
    }
  }

  // Reminders validation (now required)
  if (!formData.reminders || formData.reminders.length === 0) {
    errors.reminders = 'At least one reminder is required';
  }

  return errors;
};

/**
 * Checks if a habit form is valid (has no errors)
 * @param formData The habit form data to validate
 * @returns Whether the form is valid
 */
export const isHabitFormValid = (formData: HabitFormData): boolean => {
  const errors = validateHabitForm(formData);
  return Object.keys(errors).length === 0;
};
