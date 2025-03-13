import {HabitFormData, HabitFormErrors} from '~/types/habit.types';

/**
 * Validates all fields of a habit form at once
 * Updated for single-page form validation
 *
 * @param formData The habit form data to validate
 * @returns An object containing validation errors, or an empty object if valid
 */
export const validateHabitForm = (formData: HabitFormData): HabitFormErrors => {
  const errors: HabitFormErrors = {};

  // Title validation
  if (!formData.title?.trim()) {
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
  const frequencyErrors = validateFrequency(formData);
  if (frequencyErrors) {
    errors.frequency = frequencyErrors;
  }

  // Evaluation validation
  const evaluationErrors = validateEvaluation(formData);
  if (evaluationErrors) {
    errors.evaluation = evaluationErrors;
  }

  // Reminders validation
  if (!formData.reminders || formData.reminders.length === 0) {
    errors.reminders = 'At least one reminder is required';
  }

  // Goal validation (only if enabled)
  if (formData.goal?.enabled) {
    const goalErrors = validateGoal(formData);
    if (goalErrors) {
      errors.goal = goalErrors;
    }
  }

  return errors;
};

/**
 * Validates just the frequency section
 */
const validateFrequency = (formData: HabitFormData): string | undefined => {
  const {frequency} = formData;

  if (!frequency?.type) {
    return 'Please select a frequency type';
  }

  if (
    frequency.type === 'weekly' &&
    (!frequency.value || frequency.value.length === 0)
  ) {
    return 'Please select at least one day of the week';
  }

  if (
    frequency.type === 'monthly' &&
    (!frequency.value || frequency.value.length === 0)
  ) {
    return 'Please select at least one day of the month';
  }

  if (
    frequency.type === 'hourly' &&
    (!frequency.interval || frequency.interval < 1)
  ) {
    return 'Please specify a valid hourly interval';
  }

  // Validate time of day for non-hourly frequencies
  if (
    (frequency.type === 'daily' ||
      frequency.type === 'weekly' ||
      frequency.type === 'monthly') &&
    !frequency.timeOfDay
  ) {
    return 'Please select a time of day';
  }

  return undefined;
};

/**
 * Validates just the evaluation section
 */
const validateEvaluation = (formData: HabitFormData): string | undefined => {
  const {evaluation} = formData;

  if (!evaluation?.type) {
    return 'Please select an evaluation method';
  }

  if (
    (evaluation.type === 'numeric' || evaluation.type === 'timer') &&
    (!evaluation.target || evaluation.target <= 0)
  ) {
    return 'Please set a target value greater than zero';
  }

  if (evaluation.type === 'numeric' && !evaluation.unit) {
    return 'Please specify a unit for your measurement';
  }

  if (evaluation.type === 'checklist') {
    if (!evaluation.checklistItems || evaluation.checklistItems.length === 0) {
      return 'Please add at least one checklist item';
    }

    if (evaluation.target <= 0) {
      return 'Please set a target number of items to complete';
    }

    if (evaluation.target > evaluation.checklistItems.length) {
      return 'Target cannot be greater than the number of checklist items';
    }
  }

  return undefined;
};

/**
 * Validates just the goal section
 */
const validateGoal = (formData: HabitFormData): string | undefined => {
  const {goal} = formData;

  if (!goal) {
    return undefined;
  }

  if (goal.enabled) {
    if (!goal.target || goal.target <= 0) {
      return 'Please set a target value greater than zero';
    }

    if (!goal.deadline) {
      return 'Please set a deadline for your goal';
    }

    // Check if deadline is in the past
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const deadline = new Date(goal.deadline);
    deadline.setHours(0, 0, 0, 0);

    if (deadline < now) {
      return 'Deadline cannot be in the past';
    }
  }

  return undefined;
};

/**
 * Checks if a habit form is valid (has no errors)
 *
 * @param formData The habit form data to validate
 * @returns Whether the form is valid
 */
export const isHabitFormValid = (formData: HabitFormData): boolean => {
  const errors = validateHabitForm(formData);
  return Object.keys(errors).length === 0;
};
