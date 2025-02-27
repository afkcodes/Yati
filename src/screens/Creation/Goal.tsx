import {Calendar} from 'lucide-react-native';
import React from 'react';
import {TextInput} from 'react-native';
import {Switch} from 'react-native-switch';
import {TextX, TouchableX, ViewX} from '~components/common';
import {themes} from '~styles/theme';

// Types
interface Goal {
  enabled: boolean;
  target: string;
  deadline: Date | null;
}

interface GoalSettingsProps {
  goal: Goal;
  onGoalChange: (goal: Partial<Goal>) => void;
  onDeadlinePicker: () => void;
}

// Input component with consistent styling
const GoalInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
}> = ({value, onChangeText}) => (
  <ViewX variant="secondary" borderRadius={8} padding={12} flex={1}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Enter your goal target"
      placeholderTextColor="#8E8E93"
      style={{
        color: '#FFFFFF',
        fontSize: 15,
      }}
    />
  </ViewX>
);

// Date button component
const DateButton: React.FC<{
  deadline: Date | null;
  onPress: () => void;
}> = ({deadline, onPress}) => (
  <TouchableX
    borderRadius={8}
    padding={12}
    flexDirection="row"
    gap={8}
    alignItems="center"
    justifyContent="center"
    onPress={onPress}>
    <Calendar size={20} />
    <TextX fontSize="md">
      {deadline ? deadline.toLocaleDateString() : 'Set deadline'}
    </TextX>
  </TouchableX>
);

export const GoalSettings: React.FC<GoalSettingsProps> = ({
  goal,
  onGoalChange,
  onDeadlinePicker,
}) => {
  return (
    <ViewX gap={16} marginVertical={16}>
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <TextX fontSize="lg" fontWeight="semibold">
          Goal
        </TextX>
        <Switch
          value={goal.enabled}
          onValueChange={enabled => onGoalChange({enabled})}
          circleSize={24}
          innerCircleStyle={{height: 15, width: 15}}
          barHeight={32}
          circleBorderWidth={0}
          backgroundActive={themes.dark.background.accent}
          backgroundInactive="#3A3A3C"
          circleActiveColor="#FFFFFF"
          circleInActiveColor="#FFFFFF"
          changeValueImmediately
          renderActiveText={false}
          renderInActiveText={false}
          switchWidthMultiplier={2}
        />
      </ViewX>

      {goal.enabled && (
        <ViewX gap={8}>
          <ViewX flexDirection="row" gap={8} alignItems="center">
            <GoalInput
              value={goal.target}
              onChangeText={target => onGoalChange({target})}
            />
          </ViewX>

          <DateButton deadline={goal.deadline} onPress={onDeadlinePicker} />
        </ViewX>
      )}
    </ViewX>
  );
};

export type {Goal};
