// components/habit/form/GoalSection.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar, Trophy} from 'lucide-react-native';
import React, {useState} from 'react';
import {Platform} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {formatDateFriendly} from '~/utils/date/dateUtils';
import {SectionLabel} from './BasicInfo';

// Goal structure
interface GoalData {
  enabled: boolean;
  target: number;
  deadline: Date | null;
}

interface GoalSectionProps {
  goal: GoalData;
  onUpdateGoal: (goal: Partial<GoalData>) => void;
  error?: string;
}

const GoalSection: React.FC<GoalSectionProps> = ({
  goal,
  onUpdateGoal,
  error,
}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const {theme} = useTheme();

  const fieldColor = getThemeColor(theme, 'background', 'field');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const textTertiary = getThemeColor(theme, 'text', 'tertiary');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const errorColor = getThemeColor(theme, 'text', 'error');

  const handleToggleEnabled = () => {
    onUpdateGoal({
      enabled: !goal.enabled,
    });
  };

  const handleUpdateTarget = (increment: boolean) => {
    const currentTarget = goal.target || 0;
    const newTarget = increment
      ? currentTarget + 5
      : Math.max(0, currentTarget - 5);
    onUpdateGoal({target: newTarget});
  };

  const handleDateChange = (event: any, date?: Date) => {
    setDatePickerVisible(Platform.OS === 'ios');
    if (date) {
      onUpdateGoal({deadline: date});
    }
  };

  const getDeadlineText = () => {
    if (!goal.deadline) {
      return 'Set a deadline';
    }
    return formatDateFriendly(goal.deadline);
  };

  return (
    <ViewX marginVertical={styleUtils.spacing.md}>
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={goal.enabled ? styleUtils.spacing.sm : 0}>
        <ViewX flexDirection="row" alignItems="center">
          <SectionLabel title="Goal" />
        </ViewX>

        <TouchableX
          width={44}
          height={24}
          borderRadius={12}
          backgroundColor={
            goal.enabled
              ? withAlpha(accentColor, 0.3)
              : withAlpha(fieldColor, 0.7)
          }
          onPress={handleToggleEnabled}
          accessibilityRole="switch"
          accessibilityState={{checked: goal.enabled}}
          accessibilityLabel="Enable goal tracking">
          <ViewX
            width={20}
            height={20}
            borderRadius={10}
            backgroundColor={goal.enabled ? accentColor : textTertiary}
            position="absolute"
            top={2}
            left={goal.enabled ? 22 : 2}
          />
        </TouchableX>
      </ViewX>

      {error && (
        <TextX fontSize="xs" color="error" marginBottom={styleUtils.spacing.xs}>
          {error}
        </TextX>
      )}

      {/* Goal content - shown only when enabled */}
      {goal.enabled && (
        <ViewX
          backgroundColor={withAlpha(fieldColor, 0.3)}
          borderRadius={styleUtils.borderRadius.md}
          padding={styleUtils.spacing.sm}
          borderWidth={error ? 2 : 1}
          borderColor={error ? errorColor : 'transparent'}>
          {/* Target selector */}
          <ViewX marginBottom={styleUtils.spacing.sm}>
            <TextX
              fontSize="sm"
              fontWeight="medium"
              color="secondary"
              marginBottom={styleUtils.spacing.xs}>
              Target Completions
            </TextX>

            <ViewX
              flexDirection="row"
              alignItems="center"
              backgroundColor={withAlpha(fieldColor, 0.5)}
              borderRadius={styleUtils.borderRadius.sm}
              padding={styleUtils.spacing.xs}>
              <TouchableX
                width={36}
                height={36}
                borderRadius={18}
                justifyContent="center"
                alignItems="center"
                backgroundColor={withAlpha(fieldColor, 0.7)}
                onPress={() => handleUpdateTarget(false)}
                accessibilityLabel="Decrease target"
                disabled={goal.target <= 1}
                opacity={goal.target <= 1 ? 0.5 : 1}>
                <TextX fontSize="xl" fontWeight="semibold" color="tertiary">
                  -
                </TextX>
              </TouchableX>

              <ViewX
                flexDirection="row"
                alignItems="flex-end"
                justifyContent="center"
                flex={1}
                paddingHorizontal={styleUtils.spacing.md}>
                <TextX fontSize="2xl" fontWeight="bold" color="accent">
                  {goal.target}
                </TextX>
                <TextX
                  fontSize="md"
                  color="secondary"
                  marginLeft={styleUtils.spacing.xs}
                  marginBottom={2}>
                  times
                </TextX>
              </ViewX>

              <TouchableX
                width={36}
                height={36}
                borderRadius={18}
                justifyContent="center"
                alignItems="center"
                backgroundColor={withAlpha(fieldColor, 0.7)}
                onPress={() => handleUpdateTarget(true)}
                accessibilityLabel="Increase target">
                <TextX fontSize="xl" fontWeight="semibold" color="tertiary">
                  +
                </TextX>
              </TouchableX>
            </ViewX>
          </ViewX>

          {/* Deadline selector */}
          <ViewX>
            <TextX
              fontSize="sm"
              fontWeight="medium"
              color="secondary"
              marginBottom={styleUtils.spacing.xs}>
              Deadline
            </TextX>

            <TouchableX
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              backgroundColor={withAlpha(fieldColor, 0.7)}
              borderRadius={styleUtils.borderRadius.sm}
              paddingHorizontal={styleUtils.spacing.sm}
              paddingVertical={styleUtils.spacing.sm}
              onPress={() => setDatePickerVisible(true)}
              accessibilityLabel="Select deadline date"
              accessibilityHint="Opens date picker to set goal deadline">
              <ViewX flexDirection="row" alignItems="center">
                <Calendar size={16} color={textSecondary} strokeWidth={1.5} />
                <TextX
                  fontSize="md"
                  color={goal.deadline ? 'primary' : 'tertiary'}
                  marginLeft={styleUtils.spacing.xs}>
                  {getDeadlineText()}
                </TextX>
              </ViewX>

              {goal.deadline && (
                <TouchableX
                  padding={styleUtils.spacing.xs}
                  onPress={e => {
                    e.stopPropagation();
                    onUpdateGoal({deadline: null});
                  }}
                  accessibilityLabel="Clear deadline">
                  <TextX fontSize="lg" fontWeight="bold" color="tertiary">
                    ×
                  </TextX>
                </TouchableX>
              )}
            </TouchableX>
          </ViewX>

          {/* Description of what this means */}
          {goal.target > 0 && goal.deadline && (
            <ViewX
              marginTop={styleUtils.spacing.sm}
              borderTopWidth={1}
              borderTopColor={withAlpha(borderColor, 0.3)}
              paddingTop={styleUtils.spacing.sm}
              flexDirection="row"
              alignItems="center">
              <Trophy size={14} color={accentColor} strokeWidth={1.5} />
              <TextX
                fontSize="xs"
                color="secondary"
                marginLeft={styleUtils.spacing.xs}>
                {`Complete this habit ${
                  goal.target
                } times by ${formatDateFriendly(goal.deadline)}.`}
              </TextX>
            </ViewX>
          )}

          {/* Date picker - shown when selecting date */}
          {datePickerVisible && (
            <DateTimePicker
              value={goal.deadline || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </ViewX>
      )}
    </ViewX>
  );
};

export default GoalSection;
