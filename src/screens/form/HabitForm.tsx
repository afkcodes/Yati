/* eslint-disable react-native/no-inline-styles */
import {Check, ChevronLeft} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils} from '~/styles/theme';
import {
  ChecklistItem,
  HabitFormData,
  HabitFormErrors,
} from '~/types/habit.types';
import {validateHabitForm} from '~/utils/validation/habitFormValidation';

// Import form sections
import BasicInfoSection from './BasicInfo';
import CategorySection from './CategorySection';
import EvaluationSection from './EvaluationSection';
import FrequencySection from './FrequencySection';
import GoalSection from './GoalSection';
import RemindersSection from './ReminderSection';

const generateId = () => {
  return (
    'id_' +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Default initial form data
const DEFAULT_FORM_DATA: HabitFormData = {
  title: '',
  description: '',
  color: '#8B5CF6', // Default color (purple)
  categoryId: 'career', //TODO: FIX Category
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

interface HabitFormProps {
  initialData?: Partial<HabitFormData>;
  onSubmit: (formData: HabitFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
  showBackButton?: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  title = 'Create Habit',
  showBackButton = true,
}) => {
  // Initialize form state with default data merged with any initial data
  const [formData, setFormData] = useState<HabitFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });

  // Validation errors
  const [errors, setErrors] = useState<HabitFormErrors>({});

  // Track if form has been touched (for validation on submit only)
  const [formTouched, setFormTouched] = useState(false);

  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  // Get theme colors
  const bgColor = getThemeColor(theme, 'background', 'base');
  const accentColor = getThemeColor(theme, 'background', 'accent');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const textColor = getThemeColor(theme, 'text', 'primary');

  // Validate the form whenever data changes
  useEffect(() => {
    const newErrors = validateHabitForm(formData);
    setErrors(newErrors);
  }, [formData]);

  // Check if the form is valid
  const isFormValid = Object.keys(errors).length === 0;

  // Updates for specific sections
  const updateBasicInfo = (
    data: Partial<Pick<HabitFormData, 'title' | 'color' | 'description'>>,
  ) => {
    setFormData(prev => ({...prev, ...data}));
    setFormTouched(true);
  };

  const updateCategory = (categoryId: string) => {
    // #TODO: has been kept to fix category id thing
    console.log(categoryId);
    // setFormData(prev => ({...prev, categoryId}));
    setFormData(prev => ({...prev}));
    setFormTouched(true);
  };

  const updateFrequency = (frequency: HabitFormData['frequency']) => {
    // Make sure timeOfDay is handled correctly
    const updatedFrequency = {
      ...frequency,
      // If timeOfDay is a string, convert it to Date
      timeOfDay:
        frequency.timeOfDay instanceof Date
          ? frequency.timeOfDay
          : frequency.timeOfDay
          ? new Date(frequency.timeOfDay)
          : null,
    };

    setFormData(prev => ({...prev, frequency: updatedFrequency}));
    setFormTouched(true);
  };

  const updateEvaluation = (evaluation: HabitFormData['evaluation']) => {
    setFormData(prev => ({...prev, evaluation}));
    setFormTouched(true);
  };

  const updateGoal = (goal: Partial<HabitFormData['goal']>) => {
    setFormData(prev => ({...prev, goal: {...prev.goal, ...goal}}));
    setFormTouched(true);
  };

  const updateReminders = (reminders: Date[]) => {
    setFormData(prev => ({...prev, reminders}));
    setFormTouched(true);
  };

  // Handle checklist items specifically
  const addChecklistItem = (text: string) => {
    if (!text.trim()) {
      return;
    }

    const newItem: ChecklistItem = {
      id: generateId(),
      text: text.trim(),
      completed: false,
    };

    setFormData(prev => {
      const currentItems = prev.evaluation.checklistItems || [];
      return {
        ...prev,
        evaluation: {
          ...prev.evaluation,
          checklistItems: [...currentItems, newItem],
        },
      };
    });
    setFormTouched(true);
  };

  const updateChecklistItem = (itemId: string, text: string) => {
    setFormData(prev => {
      const currentItems = prev.evaluation.checklistItems || [];
      const updatedItems = currentItems.map(item =>
        item.id === itemId ? {...item, text} : item,
      );

      return {
        ...prev,
        evaluation: {
          ...prev.evaluation,
          checklistItems: updatedItems,
        },
      };
    });
    setFormTouched(true);
  };

  const removeChecklistItem = (itemId: string) => {
    setFormData(prev => {
      const currentItems = prev.evaluation.checklistItems || [];
      const updatedItems = currentItems.filter(item => item.id !== itemId);

      return {
        ...prev,
        evaluation: {
          ...prev.evaluation,
          checklistItems: updatedItems,
          // Adjust target if it now exceeds the number of items
          target: Math.min(prev.evaluation.target, updatedItems.length),
        },
      };
    });
    setFormTouched(true);
  };

  // Handle form submission
  const handleSubmit = () => {
    setFormTouched(true);

    const validationErrors = validateHabitForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Form is valid, submit it
        onSubmit(formData);
      } catch (error) {
        // Handle submission error
        console.error('Failed to create habit:', error);
        Alert.alert('Error', 'Failed to create habit. Please try again.', [
          {text: 'OK'},
        ]);
      }
    } else {
      // Form has errors, show a message
      const errorMessages = Object.values(validationErrors).join('\n');
      Alert.alert(
        'Form Validation Error',
        `Please correct the following issues:\n\n${errorMessages}`,
        [{text: 'OK'}],
      );
    }
  };

  // Handle cancel with confirmation if form has changes
  const handleCancel = () => {
    if (formTouched && (formData.title || formData.categoryId)) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to cancel?',
        [
          {
            text: 'Keep Editing',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: onCancel,
          },
        ],
      );
    } else {
      onCancel();
    }
  };

  useEffect(() => {
    // If we have a frequency time but no reminders, add the frequency time as a reminder
    if (formData.frequency.timeOfDay && formData.reminders.length === 0) {
      const timeOfDay = formData.frequency.timeOfDay;

      // Create a new date using just the time portion from timeOfDay
      const now = new Date();
      const reminderTime = new Date(now);

      if (timeOfDay instanceof Date) {
        reminderTime.setHours(
          timeOfDay.getHours(),
          timeOfDay.getMinutes(),
          0,
          0,
        );
      } else if (typeof timeOfDay === 'string') {
        const parsedTime = new Date(timeOfDay);
        reminderTime.setHours(
          parsedTime.getHours(),
          parsedTime.getMinutes(),
          0,
          0,
        );
      }

      // Update reminders
      updateReminders([reminderTime]);
    }
  }, [formData.frequency.timeOfDay, formData.reminders.length]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ViewX flex={1} backgroundColor={bgColor}>
        {/* Header */}
        <ViewX
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal={styleUtils.spacing.md}
          paddingVertical={styleUtils.spacing.sm}
          paddingTop={insets.top + styleUtils.spacing.sm}
          borderBottomWidth={1}
          borderBottomColor={borderColor}>
          {showBackButton ? (
            <TouchableX
              padding={styleUtils.spacing.xs}
              borderRadius={styleUtils.borderRadius.xl}
              onPress={handleCancel}
              accessibilityLabel="Go back"
              accessibilityRole="button">
              <ChevronLeft size={22} color={textColor} />
            </TouchableX>
          ) : (
            <ViewX style={{width: 40}} />
          )}

          <TextX fontSize="lg" fontWeight="semibold" color="primary">
            {title}
          </TextX>

          {/* Empty view for spacing */}
          <ViewX style={{width: 40}} />
        </ViewX>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <ViewX padding={styleUtils.spacing.md}>
            {/* Basic Information */}
            <BasicInfoSection
              title={formData.title}
              color={formData.color}
              description={formData.description || ''}
              onUpdate={updateBasicInfo}
              error={formTouched ? errors.title : undefined}
            />

            {/* Category */}
            <CategorySection
              selectedCategoryId={formData.categoryId}
              onSelectCategory={updateCategory}
              error={formTouched ? errors.categoryId : undefined}
            />

            {/* Frequency */}
            <FrequencySection
              frequency={formData.frequency}
              onUpdateFrequency={updateFrequency}
              error={formTouched ? errors.frequency : undefined}
            />

            {/* Evaluation */}
            <EvaluationSection
              evaluation={formData.evaluation}
              onUpdateEvaluation={updateEvaluation}
              onAddChecklistItem={addChecklistItem}
              onUpdateChecklistItem={updateChecklistItem}
              onRemoveChecklistItem={removeChecklistItem}
              error={formTouched ? errors.evaluation : undefined}
            />

            {/* Goal */}
            <GoalSection
              goal={formData.goal}
              onUpdateGoal={updateGoal}
              error={formTouched ? errors.goal : undefined}
            />

            {/* Reminders */}
            <RemindersSection
              reminders={formData.reminders}
              timeOfDay={formData.frequency.timeOfDay}
              onUpdateReminders={updateReminders}
              error={formTouched ? errors.reminders : undefined}
            />
          </ViewX>
        </ScrollView>

        {/* Submit Button */}
        <ViewX
          width="100%"
          paddingHorizontal={styleUtils.spacing.md}
          paddingTop={styleUtils.spacing.sm}
          paddingBottom={styleUtils.spacing.sm}
          borderTopWidth={1}
          borderTopColor={borderColor}
          backgroundColor={bgColor}>
          <TouchableX
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            paddingVertical={styleUtils.spacing.sm}
            borderRadius={styleUtils.borderRadius.md}
            width="100%"
            backgroundColor={isFormValid ? accentColor : `${accentColor}80`}
            onPress={handleSubmit}
            disabled={isLoading || !isFormValid}
            accessibilityLabel="Save habit"
            accessibilityRole="button"
            accessibilityHint="Double tap to save this habit">
            <Check size={24} color="#FFFFFF" />
            <TextX
              fontSize="md"
              fontWeight="semibold"
              color="primary"
              marginLeft={styleUtils.spacing.xs}>
              {isLoading ? 'Saving...' : 'Save Habit'}
            </TextX>
          </TouchableX>
        </ViewX>
      </ViewX>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});

export default HabitForm;
