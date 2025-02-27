import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar} from 'lucide-react-native';
import React, {Fragment, useState} from 'react';
import {ScrollView, TextInput} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import {TextX, TouchableX, ViewX} from '~components/common';
import CategorySelectTrigger from './CategorySelect/CategorySelectTrigger';
import {DEFAULT_HABIT_DATA, HabitData} from './data';
import {EvaluationTypeSelector} from './Evaluation/EvaluationTrigger';
import FrequencyTrigger from './Frequency/FrequencyTrigger';
import {GoalSettings} from './Goal';
import {Reminders} from './Reminders';

// Component Types
interface HeaderProps {
  onSave: () => void;
}

interface BasicInfoProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

interface AppearanceProps {
  color: string;
  onColorSelect: (color: string) => void;
  onColorPickerOpen: () => void;
}

interface DateRangeProps {
  startDate: Date;
  endDate: Date | null;
  onStartDatePress: () => void;
  onEndDatePress: () => void;
}

// Styled Components
const StyledTextInput = ({style, ...props}: TextInput['props']) => (
  <TextInput
    style={[
      {
        backgroundColor: '#2C2C2E',
        borderRadius: 8,
        padding: 12,
        color: '#FFFFFF',
        fontSize: 15,
      },
      style,
    ]}
    placeholderTextColor="#8E8E93"
    {...props}
  />
);

// Sub-components
const Header: React.FC<HeaderProps> = ({onSave}) => (
  <ViewX
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    padding={16}
    borderBottomWidth={1}
    variant="secondary">
    <TextX fontSize="xl" fontWeight="semibold">
      Create New Habit
    </TextX>
    <TouchableX
      // variant="primary"
      paddingHorizontal={16}
      paddingVertical={8}
      borderRadius={8}
      onPress={onSave}>
      <TextX fontWeight="semibold">Save</TextX>
    </TouchableX>
  </ViewX>
);

const BasicInfo: React.FC<BasicInfoProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}) => (
  <ViewX marginBottom={24}>
    <ViewX marginBottom={16}>
      <TextX fontSize="lg" fontWeight="semibold" marginBottom={8}>
        Name
      </TextX>
      <StyledTextInput
        value={name}
        onChangeText={onNameChange}
        placeholder="Enter habit name"
      />
    </ViewX>

    <ViewX>
      <TextX fontSize="lg" fontWeight="semibold" marginBottom={8}>
        Description
      </TextX>
      <StyledTextInput
        value={description}
        onChangeText={onDescriptionChange}
        placeholder="Enter description"
        multiline
        numberOfLines={4}
        style={{
          height: 100,
          textAlignVertical: 'top',
        }}
      />
    </ViewX>
  </ViewX>
);

const Appearance: React.FC<AppearanceProps> = ({
  color,
  onColorSelect,
  onColorPickerOpen,
}) => (
  <ViewX marginBottom={24}>
    <TextX fontSize="lg" fontWeight="semibold" marginBottom={8}>
      Appearance
    </TextX>
    <ViewX flexDirection="row" gap={16} alignItems="center">
      <TouchableX
        width={40}
        height={40}
        borderRadius={20}
        borderWidth={2}
        borderColor="#FFFFFF"
        backgroundColor={color}
        onPress={onColorPickerOpen}
      />
    </ViewX>
  </ViewX>
);

const DateRange: React.FC<DateRangeProps> = ({
  startDate,
  endDate,
  onStartDatePress,
  onEndDatePress,
}) => (
  <ViewX marginBottom={24}>
    <TextX fontSize="lg" fontWeight="semibold" marginBottom={8}>
      Date Range
    </TextX>
    <ViewX flexDirection="row" alignItems="center" gap={8}>
      <TouchableX
        // variant="secondary"
        padding={12}
        borderRadius={8}
        flex={1}
        flexDirection="row"
        gap={8}
        alignItems="center"
        justifyContent="center"
        onPress={onStartDatePress}>
        <Calendar size={20} />
        <TextX fontSize="md">{startDate.toLocaleDateString()}</TextX>
      </TouchableX>
      <TextX fontSize="md" color="tertiary">
        to
      </TextX>
      <TouchableX
        // variant="secondary"
        padding={12}
        borderRadius={8}
        flex={1}
        flexDirection="row"
        gap={8}
        alignItems="center"
        justifyContent="center"
        onPress={onEndDatePress}>
        <Calendar size={20} />
        <TextX fontSize="md">
          {endDate ? endDate.toLocaleDateString() : 'No end date'}
        </TextX>
      </TouchableX>
    </ViewX>
  </ViewX>
);

const ColorPickerModal: React.FC<{
  color: string;
  onColorChange: (color: string) => void;
  onClose: () => void;
}> = ({color, onColorChange, onClose}) => (
  <ViewX variant="secondary" padding={16} borderRadius={16} margin={16}>
    <ColorPicker
      color={color}
      onColorChange={onColorChange}
      thumbSize={40}
      sliderSize={40}
      noSnap={true}
      row={false}
    />
    <TouchableX
      variant="primary"
      padding={12}
      borderRadius={8}
      alignItems="center"
      marginTop={16}
      onPress={onClose}>
      <TextX fontWeight="semibold">Done</TextX>
    </TouchableX>
  </ViewX>
);

// Main Component
const CreateHabitScreen: React.FC = () => {
  const [habitData, setHabitData] = useState<HabitData>(DEFAULT_HABIT_DATA);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Date | null>(null);

  const handleSave = () => {
    console.log('Saving habit:', habitData);
  };

  const addReminder = (time: Date) => {
    setHabitData(prev => ({
      ...prev,
      reminders: [...prev.reminders, time],
    }));
  };

  const removeReminder = (index: number) => {
    setHabitData(prev => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index),
    }));
  };

  return (
    <Fragment>
      <ScrollView style={{flex: 1}}>
        <Header onSave={handleSave} />

        <ViewX padding={16} variant="nav">
          <BasicInfo
            name={habitData.name}
            description={habitData.description}
            onNameChange={name => setHabitData(prev => ({...prev, name}))}
            onDescriptionChange={description =>
              setHabitData(prev => ({...prev, description}))
            }
          />

          <Appearance
            color={habitData.color}
            onColorSelect={color => setHabitData(prev => ({...prev, color}))}
            onColorPickerOpen={() => setShowColorPicker(true)}
          />

          <CategorySelectTrigger selectedCategory={habitData.category} />

          <FrequencyTrigger
            frequency={habitData.frequency}
            frequencyDetails={habitData.frequencyDetails}
            onFrequencyChange={frequency => {
              setHabitData(prev => ({...prev, frequency}));
            }}
            onFrequencyDetailsChange={details => {
              setHabitData(prev => ({
                ...prev,
                frequencyDetails: {...prev.frequencyDetails, ...details},
              }));
            }}
          />

          <EvaluationTypeSelector
            evaluationType={habitData.evaluationType}
            evaluationDetails={habitData.evaluationDetails}
            onTypeChange={type => {
              setHabitData(prev => ({
                ...prev,
                evaluationType: type,
              }));
            }}
            onDetailsChange={details => {
              setHabitData(prev => ({
                ...prev,
                evaluationDetails: {
                  ...prev.evaluationDetails,
                  ...details,
                },
              }));
            }}
          />

          <GoalSettings
            goal={habitData.goal}
            onGoalChange={goal =>
              setHabitData(prev => ({
                ...prev,
                goal: {...prev.goal, ...goal},
              }))
            }
            onDeadlinePicker={() => setShowEndPicker(true)}
          />

          <Reminders
            reminders={habitData.reminders}
            onAddReminder={() => {
              setCurrentReminder(new Date());
              setShowTimePicker(true);
            }}
            onRemoveReminder={removeReminder}
          />

          <DateRange
            startDate={habitData.startDate}
            endDate={habitData.endDate}
            onStartDatePress={() => setShowStartPicker(true)}
            onEndDatePress={() => setShowEndPicker(true)}
          />
        </ViewX>

        {/* Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={habitData.startDate}
            mode="date"
            onChange={(_, date) => {
              setShowStartPicker(false);
              if (date) {
                setHabitData(prev => ({...prev, startDate: date}));
              }
            }}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={habitData.endDate || new Date()}
            mode="date"
            onChange={(_, date) => {
              setShowEndPicker(false);
              if (date) {
                setHabitData(prev => ({...prev, endDate: date}));
              }
            }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={currentReminder || new Date()}
            mode="time"
            onChange={(_, date) => {
              setShowTimePicker(false);
              if (date) {
                addReminder(date);
                setCurrentReminder(null);
              }
            }}
          />
        )}

        {/* Color Picker Modal */}
        {showColorPicker && (
          <ColorPickerModal
            color={habitData.color}
            onColorChange={color => setHabitData(prev => ({...prev, color}))}
            onClose={() => setShowColorPicker(false)}
          />
        )}
      </ScrollView>
    </Fragment>
  );
};

export default CreateHabitScreen;
