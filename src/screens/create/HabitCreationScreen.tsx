/* eslint-disable react-native/no-inline-styles */
// screens/create/ImprovedHabitCreationScreen.tsx
import {Check} from 'lucide-react-native';
import {NavigationContext} from 'navigation-react';
import React, {useCallback, useContext, useEffect, useState} from 'react';
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
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {HabitCategory} from '~/types/habit.types';
import {s, vs} from '~/utils/screenUtil';

// Import form components
import BasicInfoSection from '~/screens/form/BasicInfo';
import CategorySection from '~/screens/form/CategorySection';
import EvaluationSection from '~/screens/form/EvaluationSection';
import FrequencySection from '~/screens/form/FrequencySection';
import GoalSection from '~/screens/form/GoalSection';
import RemindersSection from '~/screens/form/ReminderSection';
import Header from '~components/common/Header';
import {
  habitCreationActions,
  useHabitCreationStore,
} from '~state/habitCreation.store';

/**
 * A section container component for form sections
 */
interface SectionContainerProps {
  children: React.ReactNode;
  title: string;
  isRequired?: boolean;
  error?: string | null;
  icon?: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  title,
  isRequired = false,
  error = null,
  icon,
}) => {
  const {theme} = useTheme();
  const errorColor = getThemeColor(theme, 'text', 'error');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');

  return (
    <ViewX
      backgroundColor={surfaceColor}
      borderRadius={styleUtils.borderRadius.md}
      borderWidth={error ? 1 : 0}
      borderColor={error ? withAlpha(errorColor, 0.3) : 'transparent'}
      style={[styles.sectionShadow, {overflow: 'hidden'}]}>
      {/* Header with subtle gradient */}
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={s(16)}
        paddingVertical={vs(14)}
        backgroundColor={
          error ? withAlpha(errorColor, 0.05) : withAlpha(accentColor, 0.025)
        }
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: error
            ? withAlpha(errorColor, 0.2)
            : withAlpha(borderColor, 0.3),
        }}>
        <ViewX flexDirection="row" alignItems="center" gap={s(8)}>
          {icon && <ViewX>{icon}</ViewX>}
          <TextX
            fontSize="md"
            fontWeight="semibold"
            color={error ? 'error' : 'primary'}>
            {title}
            {isRequired && (
              <TextX color={error ? 'error' : 'accent'} fontWeight="bold">
                {' *'}
              </TextX>
            )}
          </TextX>
        </ViewX>

        {error && (
          <ViewX
            backgroundColor={withAlpha(errorColor, 0.1)}
            borderRadius={s(16)}
            paddingHorizontal={s(10)}
            paddingVertical={vs(4)}>
            <TextX fontSize="2xs" fontWeight="medium" color="error">
              Required
            </TextX>
          </ViewX>
        )}
      </ViewX>

      {/* Content with padding */}
      <ViewX paddingHorizontal={s(16)} paddingVertical={vs(14)}>
        {children}
      </ViewX>
    </ViewX>
  );
};

/**
 * An improved single-page habit creation screen
 */
const ImprovedHabitCreationScreen: React.FC = () => {
  const {stateNavigator} = useContext(NavigationContext);
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();
  const [formTouched, setFormTouched] = useState(false);

  const [{formData, errors, isSubmitting}] = useHabitCreationStore();

  // Get theme colors
  const bgColor = getThemeColor(theme, 'background', 'base');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      habitCreationActions.resetForm();
    };
  }, []);

  // Validate form when any field changes (but only after form is touched)
  const validateIfTouched = useCallback(() => {
    if (formTouched) {
      habitCreationActions.validateForm();
    }
  }, [formTouched]);

  // Handle navigation back
  const handleBack = () => {
    if (formData.title || formData.description) {
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
            onPress: () => {
              habitCreationActions.resetForm();
              if (stateNavigator) {
                stateNavigator.navigateBack(1);
              }
            },
          },
        ],
      );
    } else {
      if (stateNavigator) {
        stateNavigator.navigateBack(1);
      }
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setFormTouched(true);
    habitCreationActions.submitForm(() => {
      if (stateNavigator) {
        stateNavigator.navigateBack(1);
      }
    });
  };

  // Field change handlers with touch tracking
  const handleBasicInfoUpdate = (updates: any) => {
    habitCreationActions.updateBasicInfo(updates);
    if (!formTouched) {
      setFormTouched(true);
    } else {
      validateIfTouched();
    }
  };

  const handleCategoryUpdate = (categoryId: HabitCategory) => {
    habitCreationActions.updateCategory(categoryId);
    if (!formTouched) {
      setFormTouched(true);
    } else {
      validateIfTouched();
    }
  };

  const handleFrequencyUpdate = (frequency: any) => {
    habitCreationActions.updateFrequency(frequency);
    if (!formTouched) {
      setFormTouched(true);
    } else {
      validateIfTouched();
    }
  };

  const handleEvaluationUpdate = (evaluation: any) => {
    habitCreationActions.updateEvaluation(evaluation);
    if (!formTouched) {
      setFormTouched(true);
    } else {
      validateIfTouched();
    }
  };

  const handleAddChecklistItem = (text: string) => {
    habitCreationActions.addChecklistItem(text);
    if (!formTouched) {
      setFormTouched(true);
    } else {
      validateIfTouched();
    }
  };

  const handleUpdateChecklistItem = (itemId: string, text: string) => {
    habitCreationActions.updateChecklistItem(itemId, text);
    if (!formTouched) {
      setFormTouched(true);
    } else {
      validateIfTouched();
    }
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    habitCreationActions.removeChecklistItem(itemId);
    if (!formTouched) {
      setFormTouched(true);
    } else {
      validateIfTouched();
    }
  };

  const handleRemindersUpdate = (reminders: Date[]) => {
    habitCreationActions.updateReminders(reminders);
    if (!formTouched) {
      setFormTouched(true);
    } else {
      validateIfTouched();
    }
  };

  const handleGoalUpdate = (updates: any) => {
    habitCreationActions.updateGoal(updates);
    if (!formTouched) {
      setFormTouched(true);
    } else {
      validateIfTouched();
    }
  };

  // Check if form is valid for submission
  const isFormValid =
    formTouched &&
    !Object.keys(errors).length &&
    formData.title &&
    formData.title.trim() !== '';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ViewX flex={1} backgroundColor={bgColor}>
        <Header title="Create Habit" showBackButton onBackPress={handleBack} />

        {/* Form Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: s(16),
              paddingVertical: vs(16),
              paddingBottom: insets.bottom + vs(90),
            },
          ]}
          scrollEventThrottle={16}>
          <ViewX gap={vs(20)}>
            {/* Basic Info Section */}
            <SectionContainer
              title="Basic Information"
              isRequired
              error={errors.title}>
              <BasicInfoSection
                title={formData.title || ''}
                color={formData.color || '#8B5CF6'}
                description={formData.description || ''}
                error={errors.title}
                onUpdate={handleBasicInfoUpdate}
              />
            </SectionContainer>

            {/* Category Section */}
            <SectionContainer
              title="Category"
              isRequired
              error={errors.categoryId}>
              <CategorySection
                selectedCategoryId={formData.categoryId || 'productivity'}
                onSelectCategory={handleCategoryUpdate}
                error={errors.categoryId}
              />
            </SectionContainer>

            {/* Frequency Section */}
            <SectionContainer
              title="Schedule"
              isRequired
              error={errors.frequency}>
              <FrequencySection
                frequency={
                  formData.frequency || {
                    type: 'daily',
                    value: [],
                    timeOfDay: null,
                  }
                }
                onUpdateFrequency={handleFrequencyUpdate}
                error={errors.frequency}
              />
            </SectionContainer>

            {/* Evaluation Section */}
            <SectionContainer
              title="Tracking Method"
              isRequired
              error={errors.evaluation}>
              <EvaluationSection
                evaluation={
                  formData.evaluation || {type: 'boolean', target: 1, unit: ''}
                }
                onUpdateEvaluation={handleEvaluationUpdate}
                onAddChecklistItem={handleAddChecklistItem}
                onUpdateChecklistItem={handleUpdateChecklistItem}
                onRemoveChecklistItem={handleRemoveChecklistItem}
                error={errors.evaluation}
              />
            </SectionContainer>

            {/* Reminders Section */}
            <SectionContainer
              title="Reminders"
              isRequired
              error={errors.reminders}>
              <RemindersSection
                reminders={formData.reminders || []}
                timeOfDay={formData.frequency?.timeOfDay}
                onUpdateReminders={handleRemindersUpdate}
                error={errors.reminders}
              />
            </SectionContainer>

            {/* Goal Section */}
            <SectionContainer title="Goal" error={errors.goal}>
              <GoalSection
                goal={
                  formData.goal || {enabled: false, target: 7, deadline: null}
                }
                onUpdateGoal={handleGoalUpdate}
                error={errors.goal}
              />
            </SectionContainer>

            {/* Bottom padding space for submit button */}
            <ViewX height={vs(60)} alignItems="center" paddingTop={vs(20)}>
              <TextX fontSize="xs" color="tertiary" textAlign="center">
                Scroll for additional options
              </TextX>
            </ViewX>
          </ViewX>
        </ScrollView>

        {/* Footer with Submit Button - Always visible */}
        <ViewX
          paddingHorizontal={s(16)}
          paddingVertical={vs(16)}
          paddingBottom={insets.bottom > 0 ? insets.bottom + vs(4) : vs(16)}
          borderTopWidth={StyleSheet.hairlineWidth}
          borderTopColor={withAlpha(borderColor, 0.3)}
          backgroundColor={withAlpha(surfaceColor, 0.97)}
          style={[styles.footer]}>
          <TouchableX
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            paddingVertical={vs(16)}
            borderRadius={styleUtils.borderRadius.lg}
            backgroundColor={
              isFormValid ? accentColor : withAlpha(accentColor, 0.5)
            }
            onPress={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            style={styles.submitButtonShadow}>
            {isSubmitting ? (
              <ViewX flexDirection="row" alignItems="center">
                <TextX fontSize="md" fontWeight="bold" color="primary">
                  Creating...
                </TextX>
              </ViewX>
            ) : (
              <ViewX flexDirection="row" alignItems="center">
                <Check size={22} color="#FFFFFF" strokeWidth={2.5} />
                <TextX
                  fontSize="md"
                  fontWeight="bold"
                  color="primary"
                  marginLeft={s(10)}>
                  Create Habit
                </TextX>
              </ViewX>
            )}
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
    flexGrow: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  floatingButton: {
    zIndex: 100,
  },
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  sectionShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButtonShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingButtonShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default ImprovedHabitCreationScreen;
