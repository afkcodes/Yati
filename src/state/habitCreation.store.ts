// state/habitCreationStore.ts
import {Alert} from 'react-native';
import {
  ChecklistItem,
  HabitCategory,
  HabitFormData,
  HabitFormErrors,
} from '~/types/habit.types';
import {create} from '~/utils/store/createStore';
import {habitActions} from './habit.store';

// Define the state structure
interface HabitCreationState {
  formData: HabitFormData;
  errors: HabitFormErrors;
  isSubmitting: boolean;
}

// Default initial form data
const DEFAULT_FORM_DATA: HabitFormData = {
  title: '',
  description: '',
  color: '#8B5CF6', // Default color (purple)
  categoryId: 'productivity',
  frequency: {
    type: 'daily',
    value: [],
    timeOfDay: null,
  },
  evaluation: {
    type: 'boolean',
    target: 1,
    unit: '',
    checklistItems: [],
  },
  goal: {
    enabled: false,
    target: 7,
    deadline: null,
  },
  reminders: [],
};

// Initial state
const initialState: HabitCreationState = {
  formData: DEFAULT_FORM_DATA,
  errors: {},
  isSubmitting: false,
};

// Create the store
const {
  useStore: useHabitCreationStore,
  set: setHabitCreationStore,
  getStoreSnapshot,
} = create<HabitCreationState>('HABIT_CREATION', initialState);

// Export store hooks
export {getStoreSnapshot, setHabitCreationStore, useHabitCreationStore};

/**
 * Validates all fields of a habit form at once
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

// Action creators for habit creation
export const habitCreationActions = {
  /**
   * Update basic info fields
   */
  updateBasicInfo: (
    updates: Partial<Pick<HabitFormData, 'title' | 'color' | 'description'>>,
  ) => {
    const state = getStoreSnapshot();
    setHabitCreationStore({
      formData: {
        ...state.formData,
        ...updates,
      },
    });
  },

  /**
   * Update category
   */
  updateCategory: (categoryId: HabitCategory) => {
    const state = getStoreSnapshot();
    setHabitCreationStore({
      formData: {
        ...state.formData,
        categoryId,
      },
    });
  },

  /**
   * Update frequency
   */
  updateFrequency: (frequency: HabitFormData['frequency']) => {
    const state = getStoreSnapshot();
    setHabitCreationStore({
      formData: {
        ...state.formData,
        frequency,
      },
    });
  },

  /**
   * Update evaluation
   */
  updateEvaluation: (evaluation: HabitFormData['evaluation']) => {
    const state = getStoreSnapshot();
    setHabitCreationStore({
      formData: {
        ...state.formData,
        evaluation,
      },
    });
  },

  /**
   * Add checklist item
   */
  addChecklistItem: (text: string) => {
    if (!text.trim()) {
      return;
    }

    const state = getStoreSnapshot();
    const currentItems = state.formData.evaluation.checklistItems || [];

    const newItem: ChecklistItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      text: text.trim(),
      completed: false,
    };

    setHabitCreationStore({
      formData: {
        ...state.formData,
        evaluation: {
          ...state.formData.evaluation,
          checklistItems: [...currentItems, newItem],
        },
      },
    });
  },

  /**
   * Update checklist item
   */
  updateChecklistItem: (itemId: string, text: string) => {
    const state = getStoreSnapshot();
    const currentItems = state.formData.evaluation.checklistItems || [];

    const updatedItems = currentItems.map(item =>
      item.id === itemId ? {...item, text} : item,
    );

    setHabitCreationStore({
      formData: {
        ...state.formData,
        evaluation: {
          ...state.formData.evaluation,
          checklistItems: updatedItems,
        },
      },
    });
  },

  /**
   * Remove checklist item
   */
  removeChecklistItem: (itemId: string) => {
    const state = getStoreSnapshot();
    const currentItems = state.formData.evaluation.checklistItems || [];

    const updatedItems = currentItems.filter(item => item.id !== itemId);

    // Also adjust target if needed
    const currentTarget = state.formData.evaluation.target || 0;
    const newTarget = Math.min(currentTarget, updatedItems.length);

    setHabitCreationStore({
      formData: {
        ...state.formData,
        evaluation: {
          ...state.formData.evaluation,
          checklistItems: updatedItems,
          target: newTarget > 0 ? newTarget : 1,
        },
      },
    });
  },

  /**
   * Update reminders
   */
  updateReminders: (reminders: Date[]) => {
    const state = getStoreSnapshot();
    setHabitCreationStore({
      formData: {
        ...state.formData,
        reminders,
      },
    });
  },

  /**
   * Update goal
   */
  updateGoal: (updates: Partial<HabitFormData['goal']>) => {
    const state = getStoreSnapshot();
    setHabitCreationStore({
      formData: {
        ...state.formData,
        goal: {...state.formData.goal, ...updates},
      },
    });
  },

  /**
   * Validate the form and update errors
   */
  validateForm: () => {
    const state = getStoreSnapshot();
    const validationErrors = validateHabitForm(state.formData);

    setHabitCreationStore({
      errors: validationErrors,
    });

    return Object.keys(validationErrors).length === 0;
  },

  /**
   * Submit the form
   */
  submitForm: async (onSuccess?: () => void): Promise<boolean> => {
    const state = getStoreSnapshot();

    // Validate form
    const validationErrors = validateHabitForm(state.formData);

    // Update errors state
    setHabitCreationStore({
      errors: validationErrors,
    });

    if (Object.keys(validationErrors).length > 0) {
      // Show error message with all errors
      const errorMessages = Object.values(validationErrors).join('\n• ');
      Alert.alert('Please Fix These Issues', `• ${errorMessages}`, [
        {text: 'OK'},
      ]);
      return false;
    }

    // Set submitting state
    setHabitCreationStore({
      isSubmitting: true,
    });

    try {
      // Create the habit
      const habit = habitActions.addHabit(state.formData);

      // Show success message
      Alert.alert('Success!', `Your habit "${habit.title}" has been created!`, [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            habitCreationActions.resetForm();

            // Call success callback
            if (onSuccess) {
              onSuccess();
            }
          },
        },
      ]);

      return true;
    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
      return false;
    } finally {
      setHabitCreationStore({
        isSubmitting: false,
      });
    }
  },

  /**
   * Reset the form
   */
  resetForm: () => {
    setHabitCreationStore({
      formData: DEFAULT_FORM_DATA,
      errors: {},
      isSubmitting: false,
    });
  },
};
