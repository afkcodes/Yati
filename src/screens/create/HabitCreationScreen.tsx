// /* eslint-disable react-native/no-inline-styles */
// import {Check} from 'lucide-react-native';
// import {NavigationContext} from 'navigation-react';
// import React, {useCallback, useContext, useEffect, useState} from 'react';
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
// } from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {TextX, TouchableX, ViewX} from '~/components/common';
// import Header from '~/components/common/Header';
// import {useTheme} from '~/hooks/ThemeContext';
// import BasicInfoSection from '~/screens/form/BasicInfo';
// import CategorySection from '~/screens/form/CategorySection';
// import EvaluationSection from '~/screens/form/EvaluationSection';
// import FrequencySection from '~/screens/form/FrequencySection';
// import GoalSection from '~/screens/form/GoalSection';
// import RemindersSection from '~/screens/form/ReminderSection';
// import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
// import {fromJSDate, now} from '~/utils/date/dateUtils';
// import {s, vs} from '~/utils/screenUtil';
// import {HabitCategory} from '~data/habits';
// import {useHabitStore} from '~state/habit/habit.store';
// import {habitActions} from '~state/habit/habitActions';
// import {HabitFormData} from '~types/habit.types';
// import {validateHabitForm} from '~utils/habit/habitValidations';

// interface SectionContainerProps {
//   children: React.ReactNode;
//   title: string;
//   isRequired?: boolean;
//   error?: string | null;
//   icon?: React.ReactNode;
// }

// const SectionContainer: React.FC<SectionContainerProps> = ({
//   children,
//   title,
//   isRequired = false,
//   error = null,
//   icon,
// }) => {
//   const {theme} = useTheme();
//   const errorColor = getThemeColor(theme, 'text', 'error');
//   const borderColor = getThemeColor(theme, 'border', 'subtle');
//   const accentColor = getThemeColor(theme, 'text', 'accent');
//   const surfaceColor = getThemeColor(theme, 'background', 'surface');

//   return (
//     <ViewX
//       backgroundColor={surfaceColor}
//       borderRadius={styleUtils.borderRadius.md}
//       borderWidth={error ? 1 : 0}
//       borderColor={error ? withAlpha(errorColor, 0.3) : 'transparent'}
//       style={[styles.sectionShadow, {overflow: 'hidden'}]}>
//       <ViewX
//         flexDirection="row"
//         justifyContent="space-between"
//         alignItems="center"
//         paddingHorizontal={s(16)}
//         paddingVertical={vs(14)}
//         backgroundColor={
//           error ? withAlpha(errorColor, 0.05) : withAlpha(accentColor, 0.025)
//         }
//         style={{
//           borderBottomWidth: StyleSheet.hairlineWidth,
//           borderBottomColor: error
//             ? withAlpha(errorColor, 0.2)
//             : withAlpha(borderColor, 0.3),
//         }}>
//         <ViewX flexDirection="row" alignItems="center" gap={s(8)}>
//           {icon && <ViewX>{icon}</ViewX>}
//           <TextX
//             fontSize="lg"
//             fontWeight="bold"
//             color={error ? 'error' : 'primary'}>
//             {title}
//             {isRequired && (
//               <TextX color={error ? 'error' : 'accent'} fontWeight="bold">
//                 {' *'}
//               </TextX>
//             )}
//           </TextX>
//         </ViewX>

//         {error && (
//           <ViewX
//             backgroundColor={withAlpha(errorColor, 0.1)}
//             borderRadius={s(16)}
//             paddingHorizontal={s(10)}
//             paddingVertical={vs(4)}>
//             <TextX fontSize="2xs" fontWeight="medium" color="error">
//               Required
//             </TextX>
//           </ViewX>
//         )}
//       </ViewX>

//       <ViewX paddingHorizontal={s(16)} paddingVertical={vs(14)}>
//         {children}
//       </ViewX>
//     </ViewX>
//   );
// };

// interface SubmitFooterProps {
//   isSubmitting: boolean;
//   isFormValid: boolean;
//   onSubmit: () => void;
//   buttonText: string;
//   insets: {bottom: number};
// }

// const SubmitFooter: React.FC<SubmitFooterProps> = ({
//   isSubmitting,
//   isFormValid,
//   onSubmit,
//   buttonText,
//   insets,
// }) => {
//   const {theme} = useTheme();
//   const accentColor = getThemeColor(theme, 'background', 'accent');
//   const borderColor = getThemeColor(theme, 'border', 'subtle');
//   const surfaceColor = getThemeColor(theme, 'background', 'surface');

//   return (
//     <ViewX
//       paddingHorizontal={s(16)}
//       paddingVertical={vs(16)}
//       paddingBottom={insets.bottom > 0 ? insets.bottom + vs(4) : vs(16)}
//       borderTopWidth={StyleSheet.hairlineWidth}
//       borderTopColor={withAlpha(borderColor, 0.3)}
//       backgroundColor={withAlpha(surfaceColor, 0.97)}
//       style={[styles.footer]}>
//       <TouchableX
//         flexDirection="row"
//         justifyContent="center"
//         alignItems="center"
//         paddingVertical={vs(16)}
//         borderRadius={styleUtils.borderRadius.lg}
//         backgroundColor={
//           isFormValid ? accentColor : withAlpha(accentColor, 0.5)
//         }
//         onPress={onSubmit}
//         disabled={isSubmitting || !isFormValid}
//         style={styles.submitButtonShadow}>
//         {isSubmitting ? (
//           <ViewX flexDirection="row" alignItems="center">
//             <TextX fontSize="md" fontWeight="bold" color="primary">
//               {buttonText === 'Create Habit' ? 'Creating...' : 'Saving...'}
//             </TextX>
//           </ViewX>
//         ) : (
//           <ViewX flexDirection="row" alignItems="center">
//             <Check size={24} color="#FFFFFF" strokeWidth={2.5} />
//             <TextX
//               fontSize="md"
//               fontWeight="bold"
//               color="primary"
//               marginLeft={s(10)}>
//               {buttonText}
//             </TextX>
//           </ViewX>
//         )}
//       </TouchableX>
//     </ViewX>
//   );
// };

// interface HabitCreationScreenProps {
//   mode?: 'create' | 'edit';
//   formData?: HabitFormData;
// }

// const ImprovedHabitCreationScreen: React.FC<HabitCreationScreenProps> = () => {
//   const {stateNavigator, data} = useContext(NavigationContext);
//   const {mode = 'create', formData: initialFormDataProp} = data;
//   const insets = useSafeAreaInsets();
//   const {theme} = useTheme();
//   const [formTouched, setFormTouched] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [state] = useHabitStore();
//   const {formData: storeFormData, formErrors: errors} = state;

//   // Use the provided formData if in edit mode, otherwise use store formData
//   const initialFormData =
//     mode === 'edit' && initialFormDataProp
//       ? JSON.parse(initialFormDataProp)
//       : storeFormData;

//   // Update the store with the provided formData on mount (for edit mode)
//   useEffect(() => {
//     if (mode === 'edit' && initialFormDataProp) {
//       habitActions.updateFormData(initialFormDataProp);
//     }
//     return () => {
//       habitActions.clearFormData();
//     };
//   }, [initialFormDataProp, mode]);

//   const bgColor = getThemeColor(theme, 'background', 'base');

//   const validateIfTouched = useCallback(() => {
//     if (formTouched) {
//       const validationErrors = validateHabitForm(initialFormData);
//       habitActions.setFormErrors(validationErrors);
//     }
//   }, [formTouched, initialFormData]);

//   // Use useEffect to validate after formData.reminders changes
//   useEffect(() => {
//     validateIfTouched();
//   }, [initialFormData.reminders, validateIfTouched]);

//   const hasUnsavedChanges = () => {
//     return (
//       initialFormData.title ||
//       initialFormData.description ||
//       initialFormData.category !== 'mindfulness' || // Default value
//       initialFormData.color !== '#1E40AF' || // Default value
//       initialFormData.frequency.type !== 'daily' ||
//       initialFormData.frequency.value.length > 0 ||
//       initialFormData.frequency.timeOfDay ||
//       initialFormData.evaluation.type !== 'boolean' ||
//       initialFormData.evaluation.checklistItems?.length ||
//       initialFormData.goal?.enabled ||
//       initialFormData.reminders.length > 0
//     );
//   };

//   const handleBack = () => {
//     if (hasUnsavedChanges()) {
//       Alert.alert(
//         'Discard Changes?',
//         'You have unsaved changes. Are you sure you want to cancel?',
//         [
//           {
//             text: 'Keep Editing',
//             style: 'cancel',
//           },
//           {
//             text: 'Discard',
//             style: 'destructive',
//             onPress: () => {
//               habitActions.clearFormData();
//               if (stateNavigator) {
//                 stateNavigator.navigateBack(1);
//               }
//             },
//           },
//         ],
//       );
//     } else {
//       if (stateNavigator) {
//         stateNavigator.navigateBack(1);
//       }
//     }
//   };

//   const handleSubmit = () => {
//     setFormTouched(true);
//     setIsSubmitting(true);

//     if (mode === 'edit') {
//       // In edit mode, update the entire habit
//       // No conversion needed for reminders since they are already string[]
//       habitActions.updateHabit(initialFormData.id!, {
//         title: initialFormData.title,
//         description: initialFormData.description,
//         category: initialFormData.category,
//         color: initialFormData.color,
//         frequency: initialFormData.frequency,
//         evaluation: initialFormData.evaluation,
//         goal: initialFormData.goal,
//         reminders: initialFormData.reminders, // Already string[]
//         timePeriod: initialFormData.timePeriod,
//       });
//       if (stateNavigator) {
//         stateNavigator.navigateBack(1);
//       }
//       setIsSubmitting(false);
//       return;
//     }

//     // Create mode
//     // Derive timePeriod from frequency.timeOfDay
//     let timePeriod: 'morning' | 'evening' | 'night' = 'morning'; // Default to morning if no timeOfDay
//     if (initialFormData.frequency.timeOfDay) {
//       // Convert timeOfDay (a Date object) to a DateTime in the local timezone
//       const timeOfDay = fromJSDate(
//         initialFormData.frequency.timeOfDay,
//         'local',
//       );
//       const hour = timeOfDay.hour;
//       if (hour >= 5 && hour < 17) {
//         // 5:00 AM to 4:59 PM
//         timePeriod = 'morning';
//       } else if (hour >= 17 && hour < 21) {
//         // 5:00 PM to 8:59 PM
//         timePeriod = 'evening';
//       } else {
//         // 9:00 PM to 4:59 AM
//         timePeriod = 'night';
//       }
//     }

//     // Reminders are already string[] (ISO strings in UTC) in formData, no conversion needed
//     const updatedFormData = {...initialFormData, timePeriod};
//     const success = habitActions.addHabit(updatedFormData);
//     if (success && stateNavigator) {
//       stateNavigator.navigateBack(1);
//     }
//     setIsSubmitting(false);
//   };

//   const handleBasicInfoUpdate = (updates: Partial<HabitFormData>) => {
//     habitActions.updateFormData(updates);
//     if (!formTouched) {
//       setFormTouched(true);
//     }
//   };

//   const handleCategoryUpdate = (category: HabitCategory) => {
//     habitActions.updateFormData({category});
//     if (!formTouched) {
//       setFormTouched(true);
//     }
//   };

//   const handleFrequencyUpdate = (frequency: HabitFormData['frequency']) => {
//     habitActions.updateFormData({frequency});
//     if (!formTouched) {
//       setFormTouched(true);
//     }
//   };

//   const handleEvaluationUpdate = (evaluation: HabitFormData['evaluation']) => {
//     habitActions.updateFormData({evaluation});
//     if (!formTouched) {
//       setFormTouched(true);
//     }
//   };

//   const handleAddChecklistItem = (text: string) => {
//     if (initialFormData.evaluation.type !== 'checklist') {
//       return;
//     }

//     const newItem = {id: `item_${now().toMillis()}`, text, completed: false};
//     const currentEval = initialFormData.evaluation;
//     const checklistItems = currentEval.checklistItems || [];
//     const newChecklistItems = [...checklistItems, newItem];
//     habitActions.updateFormData({
//       evaluation: {
//         ...currentEval,
//         checklistItems: newChecklistItems,
//         target: newChecklistItems.length,
//       },
//     });
//     if (!formTouched) {
//       setFormTouched(true);
//     }
//   };

//   const handleUpdateChecklistItem = (itemId: string, text: string) => {
//     if (initialFormData.evaluation.type !== 'checklist') {
//       return;
//     }

//     const currentEval = initialFormData.evaluation;
//     const checklistItems = currentEval.checklistItems || [];
//     const updatedChecklistItems = checklistItems.map((item: {id: string}) =>
//       item.id === itemId ? {...item, text} : item,
//     );
//     habitActions.updateFormData({
//       evaluation: {
//         ...currentEval,
//         checklistItems: updatedChecklistItems,
//       },
//     });
//     if (!formTouched) {
//       setFormTouched(true);
//     }
//   };

//   const handleRemoveChecklistItem = (itemId: string) => {
//     if (initialFormData.evaluation.type !== 'checklist') {
//       return;
//     }

//     const currentEval = initialFormData.evaluation;
//     const checklistItems = currentEval.checklistItems || [];
//     const newChecklistItems = checklistItems.filter(
//       (item: {id: string}) => item.id !== itemId,
//     );
//     habitActions.updateFormData({
//       evaluation: {
//         ...currentEval,
//         checklistItems: newChecklistItems,
//         target: Math.min(currentEval.target, newChecklistItems.length),
//       },
//     });
//     if (!formTouched) {
//       setFormTouched(true);
//     }
//   };

//   const handleRemindersUpdate = (reminders: string[]) => {
//     console.log('Updating reminders:', reminders);
//     habitActions.updateFormData({reminders});
//     if (!formTouched) {
//       setFormTouched(true);
//     }
//   };

//   const handleGoalUpdate = (updates: Partial<HabitFormData['goal']>) => {
//     habitActions.updateFormData({
//       goal: {...initialFormData.goal, ...updates} as HabitFormData['goal'],
//     });
//     if (!formTouched) {
//       setFormTouched(true);
//     }
//   };

//   const isFormValid =
//     formTouched &&
//     Object.keys(errors).length === 0 &&
//     initialFormData.title &&
//     initialFormData.title.trim() !== '' &&
//     initialFormData.reminders.length > 0;

//   const buttonText = mode === 'create' ? 'Create Habit' : 'Save Changes';

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <ViewX flex={1} backgroundColor={bgColor}>
//         <Header
//           title={mode === 'create' ? 'Create Habit' : 'Edit Habit'}
//           showBackButton
//           onBackPress={handleBack}
//         />

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={[
//             styles.scrollContent,
//             {
//               paddingHorizontal: s(16),
//               paddingVertical: vs(16),
//               paddingBottom: insets.bottom + vs(90),
//             },
//           ]}>
//           <ViewX gap={vs(20)}>
//             <SectionContainer
//               title="Basic Information"
//               isRequired
//               error={errors.title}>
//               <BasicInfoSection
//                 title={initialFormData.title || ''}
//                 color={initialFormData.color || '#1E40AF'}
//                 description={initialFormData.description || ''}
//                 error={errors.title}
//                 onUpdate={handleBasicInfoUpdate}
//               />
//             </SectionContainer>

//             <SectionContainer
//               title="Category"
//               isRequired
//               error={errors.category}>
//               <CategorySection
//                 selectedCategoryId={initialFormData.category || 'mindfulness'}
//                 onSelectCategory={handleCategoryUpdate}
//                 error={errors.category}
//               />
//             </SectionContainer>

//             <SectionContainer
//               title="Schedule"
//               isRequired
//               error={errors.frequency}>
//               <FrequencySection
//                 frequency={
//                   initialFormData.frequency || {
//                     type: 'daily',
//                     value: [],
//                     timeOfDay: null,
//                   }
//                 }
//                 onUpdateFrequency={handleFrequencyUpdate}
//                 error={errors.frequency}
//               />
//             </SectionContainer>

//             <SectionContainer
//               title="Tracking Method"
//               isRequired
//               error={errors.evaluation}>
//               <EvaluationSection
//                 evaluation={
//                   initialFormData.evaluation || {
//                     type: 'boolean',
//                     target: 1,
//                     unit: '',
//                   }
//                 }
//                 onUpdateEvaluation={handleEvaluationUpdate}
//                 onAddChecklistItem={handleAddChecklistItem}
//                 onUpdateChecklistItem={handleUpdateChecklistItem}
//                 onRemoveChecklistItem={handleRemoveChecklistItem}
//                 error={errors.evaluation}
//               />
//             </SectionContainer>

//             <SectionContainer
//               title="Reminders"
//               isRequired
//               error={errors.reminders}>
//               <RemindersSection
//                 reminders={initialFormData.reminders || []}
//                 timeOfDay={initialFormData.frequency?.timeOfDay}
//                 onUpdateReminders={handleRemindersUpdate}
//                 error={errors.reminders}
//               />
//             </SectionContainer>

//             <SectionContainer title="Goal" error={errors.goal}>
//               <GoalSection
//                 goal={
//                   initialFormData.goal || {
//                     enabled: false,
//                     timeframe: 'weekly',
//                     target: 7,
//                     deadline: null,
//                     progress: 0,
//                   }
//                 }
//                 onUpdateGoal={handleGoalUpdate}
//                 error={errors.goal}
//               />
//             </SectionContainer>

//             <ViewX height={vs(60)} alignItems="center" paddingTop={vs(20)}>
//               <TextX fontSize="xs" color="tertiary" textAlign="center">
//                 Scroll for additional options
//               </TextX>
//             </ViewX>
//           </ViewX>
//         </ScrollView>

//         <SubmitFooter
//           isSubmitting={isSubmitting}
//           isFormValid={Boolean(isFormValid)}
//           onSubmit={handleSubmit}
//           buttonText={buttonText}
//           insets={insets}
//         />
//       </ViewX>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(150, 150, 150, 0.1)',
//   },
//   sectionShadow: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   submitButtonShadow: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 3},
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 4,
//   },
// });

// export default ImprovedHabitCreationScreen;

/* eslint-disable react-native/no-inline-styles */

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
import Header from '~/components/common/Header';
import {useTheme} from '~/hooks/ThemeContext';
import BasicInfoSection from '~/screens/form/BasicInfo';
import CategorySection from '~/screens/form/CategorySection';
import EvaluationSection from '~/screens/form/EvaluationSection';
import FrequencySection from '~/screens/form/FrequencySection';
import GoalSection from '~/screens/form/GoalSection';
import RemindersSection from '~/screens/form/ReminderSection';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {fromJSDate, now, toUTCISO} from '~/utils/date/dateUtils';
import {s, vs} from '~/utils/screenUtil';
import {HabitCategory} from '~data/habits';
import {useHabitStore} from '~state/habit/habit.store';
import {habitActions} from '~state/habit/habitActions';
import {HabitFormData} from '~types/habit.types';
import {validateHabitForm} from '~utils/habit/habitValidations';
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
            fontSize="lg"
            fontWeight="bold"
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

      <ViewX paddingHorizontal={s(16)} paddingVertical={vs(14)}>
        {children}
      </ViewX>
    </ViewX>
  );
};

interface SubmitFooterProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  onSubmit: () => void;
  buttonText: string;
  insets: {bottom: number};
}

const SubmitFooter: React.FC<SubmitFooterProps> = ({
  isSubmitting,
  isFormValid,
  onSubmit,
  buttonText,
  insets,
}) => {
  const {theme} = useTheme();
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');

  return (
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
        onPress={onSubmit}
        disabled={isSubmitting || !isFormValid}
        style={styles.submitButtonShadow}>
        {isSubmitting ? (
          <ViewX flexDirection="row" alignItems="center">
            <TextX fontSize="md" fontWeight="bold" color="primary">
              {buttonText === 'Create Habit' ? 'Creating...' : 'Saving...'}
            </TextX>
          </ViewX>
        ) : (
          <ViewX flexDirection="row" alignItems="center">
            <Check size={24} color="#FFFFFF" strokeWidth={2.5} />
            <TextX
              fontSize="md"
              fontWeight="bold"
              color="primary"
              marginLeft={s(10)}>
              {buttonText}
            </TextX>
          </ViewX>
        )}
      </TouchableX>
    </ViewX>
  );
};

interface HabitCreationScreenProps {
  mode?: 'create' | 'edit';
  formData?: HabitFormData;
}

const ImprovedHabitCreationScreen: React.FC<HabitCreationScreenProps> = ({
  mode = 'create',
  formData: initialFormDataProp,
}) => {
  const {stateNavigator} = useContext(NavigationContext);
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state] = useHabitStore();
  const {formData: storeFormData, formErrors: errors} = state;

  // Use the provided formData if in edit mode, otherwise use store formData
  const initialFormData =
    mode === 'edit' && initialFormDataProp
      ? initialFormDataProp
      : storeFormData;

  // Update the store with the provided formData on mount (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && initialFormDataProp) {
      habitActions.updateFormData(initialFormDataProp);
    }
    return () => {
      habitActions.clearFormData();
    };
  }, [initialFormDataProp, mode]);

  const bgColor = getThemeColor(theme, 'background', 'base');

  const validateIfTouched = useCallback(() => {
    if (formTouched) {
      console.log('Before validation - Reminders:', initialFormData.reminders);
      const validationErrors = validateHabitForm(initialFormData);
      console.log('After validation - Reminders:', initialFormData.reminders);
      habitActions.setFormErrors(validationErrors);
    }
  }, [formTouched, initialFormData]);

  useEffect(() => {
    validateIfTouched();
  }, [initialFormData.reminders, validateIfTouched]);

  const hasUnsavedChanges = () => {
    return (
      initialFormData.title ||
      initialFormData.description ||
      initialFormData.category !== 'mindfulness' || // Default value
      initialFormData.color !== '#1E40AF' || // Default value
      initialFormData.frequency.type !== 'daily' ||
      initialFormData.frequency.value.length > 0 ||
      initialFormData.frequency.timeOfDay ||
      initialFormData.evaluation.type !== 'boolean' ||
      initialFormData.evaluation.checklistItems?.length ||
      initialFormData.goal?.enabled ||
      initialFormData.reminders.length > 0
    );
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
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
              habitActions.clearFormData();
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

  const handleSubmit = () => {
    setFormTouched(true);
    setIsSubmitting(true);

    console.log(
      'Submitting - Reminders before validation:',
      initialFormData.reminders,
    );
    const validationErrors = validateHabitForm(initialFormData);
    console.log(
      'Submitting - Reminders after validation:',
      initialFormData.reminders,
    );
    if (Object.keys(validationErrors).length > 0) {
      habitActions.setFormErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    if (mode === 'edit') {
      habitActions.updateHabit(initialFormData.id!, {
        title: initialFormData.title,
        description: initialFormData.description,
        category: initialFormData.category,
        color: initialFormData.color,
        frequency: initialFormData.frequency,
        evaluation: initialFormData.evaluation,
        goal: initialFormData.goal,
        reminders: initialFormData.reminders,
        timePeriod: initialFormData.timePeriod,
      });
      if (stateNavigator) {
        stateNavigator.navigateBack(1);
      }
      setIsSubmitting(false);
      return;
    }

    let timePeriod: 'morning' | 'evening' | 'night' = 'morning';
    if (initialFormData.frequency.timeOfDay) {
      const timeOfDay = fromJSDate(
        initialFormData.frequency.timeOfDay,
        'local',
      );
      const hour = timeOfDay.hour;
      if (hour >= 5 && hour < 17) {
        timePeriod = 'morning';
      } else if (hour >= 17 && hour < 21) {
        timePeriod = 'evening';
      } else {
        timePeriod = 'night';
      }
    }

    const updatedFormData = {...initialFormData, timePeriod};
    const success = habitActions.addHabit(updatedFormData);
    if (success && stateNavigator) {
      stateNavigator.navigateBack(1);
    }
    setIsSubmitting(false);
  };

  const handleBasicInfoUpdate = (updates: Partial<HabitFormData>) => {
    habitActions.updateFormData(updates);
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleCategoryUpdate = (category: HabitCategory) => {
    habitActions.updateFormData({category});
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleFrequencyUpdate = (frequency: HabitFormData['frequency']) => {
    // If timeOfDay is set and reminders are empty, automatically add it to reminders
    if (frequency.timeOfDay && initialFormData.reminders.length === 0) {
      const iso = toUTCISO(fromJSDate(frequency.timeOfDay, 'local'));
      habitActions.updateFormData({frequency, reminders: [iso]});
    } else {
      habitActions.updateFormData({frequency});
    }
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleEvaluationUpdate = (evaluation: HabitFormData['evaluation']) => {
    habitActions.updateFormData({evaluation});
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleAddChecklistItem = (text: string) => {
    if (initialFormData.evaluation.type !== 'checklist') {
      return;
    }

    const newItem = {id: `item_${now().toMillis()}`, text, completed: false};
    const currentEval = initialFormData.evaluation;
    const checklistItems = currentEval.checklistItems || [];
    const newChecklistItems = [...checklistItems, newItem];
    habitActions.updateFormData({
      evaluation: {
        ...currentEval,
        checklistItems: newChecklistItems,
        target: newChecklistItems.length,
      },
    });
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleUpdateChecklistItem = (itemId: string, text: string) => {
    if (initialFormData.evaluation.type !== 'checklist') {
      return;
    }

    const currentEval = initialFormData.evaluation;
    const checklistItems = currentEval.checklistItems || [];
    const updatedChecklistItems = checklistItems.map(item =>
      item.id === itemId ? {...item, text} : item,
    );
    habitActions.updateFormData({
      evaluation: {
        ...currentEval,
        checklistItems: updatedChecklistItems,
      },
    });
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    if (initialFormData.evaluation.type !== 'checklist') {
      return;
    }

    const currentEval = initialFormData.evaluation;
    const checklistItems = currentEval.checklistItems || [];
    const newChecklistItems = checklistItems.filter(item => item.id !== itemId);
    habitActions.updateFormData({
      evaluation: {
        ...currentEval,
        checklistItems: newChecklistItems,
        target: Math.min(currentEval.target, newChecklistItems.length),
      },
    });
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleRemindersUpdate = (reminders: string[]) => {
    console.log('Updating reminders:', reminders);
    habitActions.updateFormData({reminders});
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleGoalUpdate = (updates: Partial<HabitFormData['goal']>) => {
    habitActions.updateFormData({
      goal: {...initialFormData.goal, ...updates} as HabitFormData['goal'],
    });
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const isFormValid =
    formTouched &&
    Object.keys(errors).length === 0 &&
    initialFormData.title &&
    initialFormData.title.trim() !== '' &&
    initialFormData.reminders.length > 0;

  const buttonText = mode === 'create' ? 'Create Habit' : 'Save Changes';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ViewX flex={1} backgroundColor={bgColor}>
        <Header
          title={mode === 'create' ? 'Create Habit' : 'Edit Habit'}
          showBackButton
          onBackPress={handleBack}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: s(16),
              paddingVertical: vs(16),
              paddingBottom: insets.bottom + vs(90),
            },
          ]}>
          <ViewX gap={vs(20)}>
            <SectionContainer
              title="Basic Information"
              isRequired
              error={errors.title}>
              <BasicInfoSection
                title={initialFormData.title || ''}
                color={initialFormData.color || '#1E40AF'}
                description={initialFormData.description || ''}
                error={errors.title}
                onUpdate={handleBasicInfoUpdate}
              />
            </SectionContainer>

            <SectionContainer
              title="Category"
              isRequired
              error={errors.category}>
              <CategorySection
                selectedCategoryId={initialFormData.category || 'mindfulness'}
                onSelectCategory={handleCategoryUpdate}
                error={errors.category}
              />
            </SectionContainer>

            <SectionContainer
              title="Schedule"
              isRequired
              error={errors.frequency}>
              <FrequencySection
                frequency={
                  initialFormData.frequency || {
                    type: 'daily',
                    value: [],
                    timeOfDay: null,
                  }
                }
                onUpdateFrequency={handleFrequencyUpdate}
                error={errors.frequency}
              />
            </SectionContainer>

            <SectionContainer
              title="Tracking Method"
              isRequired
              error={errors.evaluation}>
              <EvaluationSection
                evaluation={
                  initialFormData.evaluation || {
                    type: 'boolean',
                    target: 1,
                    unit: '',
                  }
                }
                onUpdateEvaluation={handleEvaluationUpdate}
                onAddChecklistItem={handleAddChecklistItem}
                onUpdateChecklistItem={handleUpdateChecklistItem}
                onRemoveChecklistItem={handleRemoveChecklistItem}
                error={errors.evaluation}
              />
            </SectionContainer>

            <SectionContainer
              title="Reminders"
              isRequired
              error={errors.reminders}>
              <RemindersSection
                reminders={initialFormData.reminders || []}
                timeOfDay={initialFormData.frequency?.timeOfDay}
                onUpdateReminders={handleRemindersUpdate}
                error={errors.reminders}
              />
            </SectionContainer>

            <SectionContainer title="Goal" error={errors.goal}>
              <GoalSection
                goal={
                  initialFormData.goal || {
                    enabled: false,
                    timeframe: 'weekly',
                    target: 7,
                    deadline: null,
                    progress: 0,
                  }
                }
                onUpdateGoal={handleGoalUpdate}
                error={errors.goal}
              />
            </SectionContainer>

            <ViewX height={vs(60)} alignItems="center" paddingTop={vs(20)}>
              <TextX fontSize="xs" color="tertiary" textAlign="center">
                Scroll for additional options
              </TextX>
            </ViewX>
          </ViewX>
        </ScrollView>

        <SubmitFooter
          isSubmitting={isSubmitting}
          isFormValid={Boolean(isFormValid)}
          onSubmit={handleSubmit}
          buttonText={buttonText}
          insets={insets}
        />
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
});

export default ImprovedHabitCreationScreen;
