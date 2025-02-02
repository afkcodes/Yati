import {Calendar} from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {baseStyles, COLORS} from './styles';

interface GoalSettingsProps {
  goal: {
    enabled: boolean;
    target: string;
    deadline: Date | null;
  };
  onGoalChange: (goal: {
    enabled?: boolean;
    target?: string;
    deadline?: Date | null;
  }) => void;
  onDeadlinePicker: () => void;
}

export const GoalSettings: React.FC<GoalSettingsProps> = ({
  goal,
  onGoalChange,
  onDeadlinePicker,
}) => {
  return (
    <View style={baseStyles.inputGroup}>
      <View style={styles.goalHeader}>
        <Text style={baseStyles.label}>Goal</Text>
        <Switch
          value={goal.enabled}
          onValueChange={enabled => onGoalChange({enabled})}
          trackColor={{false: COLORS.surface, true: COLORS.primary}}
          thumbColor={COLORS.text}
        />
      </View>

      {goal.enabled && (
        <View style={styles.goalDetails}>
          <View style={styles.goalInput}>
            <TextInput
              style={baseStyles.input}
              value={goal.target}
              onChangeText={target => onGoalChange({target})}
              placeholder="Enter your goal target"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={onDeadlinePicker}>
            <Calendar size={20} color={COLORS.text} />
            <Text style={styles.dateButtonText}>
              {goal.deadline
                ? goal.deadline.toLocaleDateString()
                : 'Set deadline'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalDetails: {
    gap: 8,
  },
  goalInput: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dateButton: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: COLORS.text,
    fontSize: 15,
  },
});
