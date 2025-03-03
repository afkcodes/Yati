/* eslint-disable react-native/no-inline-styles */
import {Check, ChevronLeft} from 'lucide-react-native';
import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils} from '~/styles/theme';
import BasicInfoSection from './BasicInfo';
import CategorySection from './Category';
import EvaluationSection from './Evaluation';
import FrequencySection, {FrequencyData} from './Frequency';
import GoalSection from './Goal';
import RemindersSection from './Reminder';

// Define the habit data type with proper typing
interface HabitData {
  title: string;
  color: string;
  categoryId: string;
  frequency: {
    type: 'hourly' | 'daily' | 'weekly' | 'monthly';
    value: string[];
    timeOfDay: Date | null;
    interval?: number; // For hourly frequency
  };
  evaluation: {
    type: string;
    target: number;
    unit: string;
  };
  reminders: Date[];
  goal: {
    enabled: boolean;
    target: number;
    deadline: Date | null;
  };
  startDate: Date;
  endDate: Date | null;
  description: string;
}

// Initial habit data with defaults
const initialHabitData: HabitData = {
  title: '',
  color: '#8B5CF6', // Default color (purple)
  categoryId: '',
  frequency: {
    type: 'daily',
    value: [],
    timeOfDay: null,
  },
  evaluation: {
    type: 'boolean',
    target: 0,
    unit: '',
  },
  reminders: [],
  goal: {
    enabled: false,
    target: 0,
    deadline: null,
  },
  startDate: new Date(),
  endDate: null,
  description: '',
};

interface CreateHabitScreenProps {
  navigation?: {
    goBack: () => void;
  };
  // These props are only used for testing/development and aren't required
  frequency?: FrequencyData;
  onUpdateFrequency?: (frequency: FrequencyData) => void;
}

const CreateHabitScreen: React.FC<CreateHabitScreenProps> = ({
  navigation,
  // If these props are passed, use them (for testing/development)
  frequency: externalFrequency,
  onUpdateFrequency: externalUpdateFrequency,
}) => {
  // Initialize with external frequency data if provided
  const [habitData, setHabitData] = useState<HabitData>({
    ...initialHabitData,
    frequency: externalFrequency || initialHabitData.frequency,
  });

  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  // Get theme colors
  const bgColor = getThemeColor(theme, 'background', 'base');
  const accentColor = getThemeColor(theme, 'background', 'accent');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const textColor = getThemeColor(theme, 'text', 'primary');

  // Updates for specific sections
  const updateBasicInfo = (
    data: Partial<Pick<HabitData, 'title' | 'color' | 'description'>>,
  ) => {
    setHabitData(prev => ({...prev, ...data}));
  };

  const updateCategory = (categoryId: string) => {
    setHabitData(prev => ({...prev, categoryId}));
  };

  const updateFrequency = (frequency: FrequencyData) => {
    // If external update function is provided, call it
    if (externalUpdateFrequency) {
      externalUpdateFrequency(frequency);
    }
    // Update local state
    setHabitData(prev => ({...prev, frequency}));
  };

  const updateEvaluation = (evaluation: HabitData['evaluation']) => {
    setHabitData(prev => ({...prev, evaluation}));
  };

  const updateGoal = (goal: Partial<HabitData['goal']>) => {
    setHabitData(prev => ({...prev, goal: {...prev.goal, ...goal}}));
  };

  const updateReminders = (reminders: Date[]) => {
    setHabitData(prev => ({...prev, reminders}));
  };

  const handleSave = () => {
    // Validate data
    if (!habitData.title) {
      // Show error toast or validation
      console.warn('Title is required');
      return;
    }

    // Save habit
    console.log('Saving habit:', habitData);

    // Navigate back
    navigation?.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
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
          <TouchableX
            padding={styleUtils.spacing.xs}
            borderRadius={styleUtils.borderRadius.xl}
            onPress={() => navigation?.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button">
            <ChevronLeft size={22} color={textColor} />
          </TouchableX>

          <TextX fontSize="lg" fontWeight="semibold" color="primary">
            Create Habit
          </TextX>

          {/* Empty view for spacing */}
          <ViewX style={{width: 40}} />
        </ViewX>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 24}}>
          <ViewX padding={styleUtils.spacing.md}>
            {/* Basic Information */}
            <BasicInfoSection
              title={habitData.title}
              color={habitData.color}
              description={habitData.description || ''}
              onUpdate={updateBasicInfo}
            />

            {/* Category */}
            <CategorySection
              selectedCategoryId={habitData.categoryId}
              onSelectCategory={updateCategory}
            />

            {/* Frequency */}
            <FrequencySection
              frequency={habitData.frequency}
              onUpdateFrequency={updateFrequency}
            />

            {/* Evaluation */}
            <EvaluationSection
              evaluation={habitData.evaluation}
              onUpdateEvaluation={updateEvaluation}
            />

            {/* Goal */}
            <GoalSection goal={habitData.goal} onUpdateGoal={updateGoal} />

            {/* Reminders */}
            <RemindersSection
              reminders={habitData.reminders}
              onUpdateReminders={updateReminders}
            />
          </ViewX>
        </ScrollView>

        <ViewX
          width="100%"
          paddingHorizontal={styleUtils.spacing.md}
          paddingTop={styleUtils.spacing.sm}
          paddingBottom={
            insets.bottom > 0 ? insets.bottom : styleUtils.spacing.md
          }
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
            backgroundColor={accentColor}
            onPress={handleSave}
            accessibilityLabel="Save habit"
            accessibilityRole="button"
            accessibilityHint="Double tap to save this habit">
            <Check size={24} color="#FFFFFF" />
            <TextX
              fontSize="md"
              fontWeight="semibold"
              color="primary"
              marginLeft={styleUtils.spacing.xs}>
              Save Habit
            </TextX>
          </TouchableX>
        </ViewX>
      </ViewX>
    </KeyboardAvoidingView>
  );
};

export default CreateHabitScreen;
