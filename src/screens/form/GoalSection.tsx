// screens/form/GoalSection.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Plus,
  Target,
  Trophy,
  X,
} from 'lucide-react-native';
import React, {useCallback, useState} from 'react';
import {Platform} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import SquircleViewContainer from '~/containers/SquircleViewContainer';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {formatDateFriendly} from '~/utils/date/dateUtils';
import {s, vs} from '~utils/screenUtil';
import {SectionLabel} from './BasicInfo';

// Goal structure - keeping same interface
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
  const [expanded, setExpanded] = useState(false);
  const {theme} = useTheme();

  // Theme colors
  const colors = {
    fieldColor: getThemeColor(theme, 'background', 'field'),
    surfaceColor: getThemeColor(theme, 'background', 'surface'),
    borderColor: getThemeColor(theme, 'border', 'subtle'),
    textSecondary: getThemeColor(theme, 'text', 'secondary'),
    textTertiary: getThemeColor(theme, 'text', 'tertiary'),
    accentColor: getThemeColor(theme, 'text', 'accent'),
    errorColor: getThemeColor(theme, 'text', 'error'),
    successColor: getThemeColor(theme, 'text', 'success'),
    goldColor: '#F6B352', // Custom gold color for trophies
  };

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  // Toggle goal enabled/disabled
  const handleToggleEnabled = useCallback(() => {
    // If enabling, also expand the section
    if (!goal.enabled) {
      setExpanded(true);

      // Set some defaults for newly enabled goals
      if (!goal.target) {
        onUpdateGoal({enabled: true, target: 10});
      } else {
        onUpdateGoal({enabled: true});
      }
    } else {
      // Just disable
      onUpdateGoal({enabled: false});
    }
  }, [goal.enabled, goal.target, onUpdateGoal]);

  // Update target value
  const handleUpdateTarget = useCallback(
    (increment: boolean) => {
      const currentTarget = goal.target || 0;
      const newTarget = increment
        ? currentTarget + 5
        : Math.max(5, currentTarget - 5);
      onUpdateGoal({target: newTarget});
    },
    [goal.target, onUpdateGoal],
  );

  // Date selection handler
  const handleDateChange = useCallback(
    (event: any, date?: Date) => {
      setDatePickerVisible(Platform.OS === 'ios');
      if (date) {
        onUpdateGoal({deadline: date});
      }
    },
    [onUpdateGoal],
  );

  // Clear deadline
  const handleClearDeadline = useCallback(() => {
    onUpdateGoal({deadline: null});
  }, [onUpdateGoal]);

  return (
    <ViewX marginVertical={styleUtils.spacing.md}>
      {/* Header with Section Label */}
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={vs(8)}>
        <SectionLabel title="Goal" />

        <ViewX flexDirection="row" alignItems="center">
          <TextX fontSize="sm" color="secondary" marginRight={s(10)}>
            {goal.enabled ? 'Enabled' : 'Disabled'}
          </TextX>

          {/* Toggle switch */}
          <TouchableX
            width={44}
            height={24}
            borderRadius={12}
            backgroundColor={
              goal.enabled
                ? withAlpha(colors.accentColor, 0.3)
                : withAlpha(colors.fieldColor, 0.7)
            }
            onPress={handleToggleEnabled}
            accessibilityRole="switch"
            accessibilityState={{checked: goal.enabled}}
            accessibilityLabel="Enable goal tracking">
            <ViewX
              width={20}
              height={20}
              borderRadius={10}
              backgroundColor={
                goal.enabled ? colors.accentColor : colors.textTertiary
              }
              position="absolute"
              top={2}
              left={goal.enabled ? 22 : 2}
            />
          </TouchableX>
        </ViewX>
      </ViewX>

      {/* Error message - always visible */}
      {error && (
        <SquircleViewContainer
          borderRadius="sm"
          backgroundColor={withAlpha(colors.errorColor, 0.1)}
          padding="xs"
          marginBottom="sm">
          <ViewX flexDirection="row" alignItems="center">
            <AlertCircle
              size={14}
              color={colors.errorColor}
              strokeWidth={1.5}
            />
            <TextX fontSize="xs" color="error" marginLeft={s(6)}>
              {error}
            </TextX>
          </ViewX>
        </SquircleViewContainer>
      )}

      {/* Main summary - always visible when goal is enabled */}
      {goal.enabled && (
        <SquircleViewContainer borderRadius="md" variant="field" padding="sm">
          <TouchableX
            onPress={toggleExpanded}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            paddingVertical={vs(2)}>
            <ViewX flexDirection="row" alignItems="center">
              <Trophy size={18} color={colors.goldColor} strokeWidth={1.5} />
              <TextX
                fontSize="md"
                fontWeight="semibold"
                color="primary"
                marginLeft={s(8)}>
                {goal.target} completions
                {goal.deadline
                  ? ` by ${formatDateFriendly(goal.deadline)}`
                  : ''}
              </TextX>
            </ViewX>

            <ChevronRight
              size={16}
              color={colors.textTertiary}
              style={{
                transform: [{rotate: expanded ? '90deg' : '0deg'}],
              }}
            />
          </TouchableX>
        </SquircleViewContainer>
      )}

      {/* Expandable content */}
      {goal.enabled && expanded && (
        <ViewX marginTop={vs(12)}>
          {/* Target Selection */}
          <ViewX marginBottom={vs(16)}>
            <TextX
              fontSize="xs"
              color="secondary"
              marginBottom={vs(8)}
              textTransform="uppercase">
              Target Count
            </TextX>

            <SquircleViewContainer
              borderRadius="md"
              variant="surface"
              padding="md">
              <ViewX
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <TouchableX
                  width={40}
                  height={40}
                  borderRadius={20}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor={withAlpha(colors.fieldColor, 0.8)}
                  onPress={() => handleUpdateTarget(false)}
                  disabled={goal.target <= 5}
                  opacity={goal.target <= 5 ? 0.5 : 1}>
                  <TextX fontSize="xl" fontWeight="semibold" color="tertiary">
                    -
                  </TextX>
                </TouchableX>

                <ViewX alignItems="center">
                  <Target
                    size={18}
                    color={colors.accentColor}
                    strokeWidth={1.5}
                  />
                  <TextX
                    fontSize="3xl"
                    fontWeight="bold"
                    color="primary"
                    marginTop={vs(2)}>
                    {goal.target}
                  </TextX>
                  <TextX fontSize="xs" color="secondary">
                    completions
                  </TextX>
                </ViewX>

                <TouchableX
                  width={40}
                  height={40}
                  borderRadius={20}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor={withAlpha(colors.fieldColor, 0.8)}
                  onPress={() => handleUpdateTarget(true)}>
                  <TextX fontSize="xl" fontWeight="semibold" color="tertiary">
                    +
                  </TextX>
                </TouchableX>
              </ViewX>
            </SquircleViewContainer>
          </ViewX>

          {/* Deadline Selection */}
          <ViewX>
            <TextX
              fontSize="xs"
              color="secondary"
              marginBottom={vs(8)}
              textTransform="uppercase">
              Deadline
            </TextX>

            {goal.deadline ? (
              <SquircleViewContainer
                borderRadius="md"
                variant="surface"
                padding="md">
                <ViewX
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <ViewX flexDirection="row" alignItems="center">
                    <Calendar
                      size={18}
                      color={colors.accentColor}
                      strokeWidth={1.5}
                    />
                    <ViewX marginLeft={s(10)}>
                      <TextX fontSize="md" fontWeight="medium" color="primary">
                        {formatDateFriendly(goal.deadline)}
                      </TextX>
                      <TextX fontSize="xs" color="secondary">
                        deadline
                      </TextX>
                    </ViewX>
                  </ViewX>

                  <ViewX flexDirection="row">
                    <TouchableX
                      padding={vs(8)}
                      borderRadius={8}
                      backgroundColor={withAlpha(colors.errorColor, 0.1)}
                      onPress={handleClearDeadline}
                      marginRight={s(8)}>
                      <X
                        size={16}
                        color={colors.errorColor}
                        strokeWidth={1.5}
                      />
                    </TouchableX>

                    <TouchableX
                      padding={vs(8)}
                      borderRadius={8}
                      backgroundColor={withAlpha(colors.accentColor, 0.1)}
                      onPress={() => setDatePickerVisible(true)}>
                      <TextX fontSize="xs" color="accent">
                        Change
                      </TextX>
                    </TouchableX>
                  </ViewX>
                </ViewX>
              </SquircleViewContainer>
            ) : (
              <TouchableX
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                paddingVertical={vs(14)}
                borderRadius={8}
                backgroundColor={withAlpha(colors.accentColor, 0.08)}
                borderWidth={1}
                borderColor={withAlpha(colors.accentColor, 0.2)}
                borderStyle="dashed"
                onPress={() => setDatePickerVisible(true)}>
                <Plus size={16} color={colors.accentColor} strokeWidth={1.5} />
                <TextX
                  fontSize="sm"
                  color="accent"
                  fontWeight="medium"
                  marginLeft={s(6)}>
                  Set Deadline
                </TextX>
              </TouchableX>
            )}
          </ViewX>

          {/* Achievement visualization */}
          {goal.deadline && (
            <ViewX
              marginTop={vs(16)}
              backgroundColor={withAlpha(colors.goldColor, 0.08)}
              borderRadius={12}
              padding={s(16)}>
              <ViewX
                flexDirection="row"
                alignItems="center"
                marginBottom={vs(8)}>
                <Trophy size={16} color={colors.goldColor} strokeWidth={1.5} />
                <TextX
                  fontSize="sm"
                  fontWeight="medium"
                  color="primary"
                  marginLeft={s(8)}>
                  Achievement Goal
                </TextX>
              </ViewX>

              <ViewX
                backgroundColor={withAlpha(colors.goldColor, 0.05)}
                padding={s(12)}
                borderRadius={8}
                borderStyle="dashed"
                borderWidth={1}
                borderColor={withAlpha(colors.goldColor, 0.3)}>
                <TextX fontSize="sm" color="secondary" lineHeight={18}>
                  Complete this habit{' '}
                  <TextX fontWeight="bold" color="primary">
                    {goal.target} times
                  </TextX>{' '}
                  by{' '}
                  <TextX fontWeight="bold" color="primary">
                    {formatDateFriendly(goal.deadline)}
                  </TextX>{' '}
                  to earn a streak badge.
                </TextX>
              </ViewX>
            </ViewX>
          )}
        </ViewX>
      )}

      {/* Date Picker for deadline */}
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
  );
};

export default React.memo(GoalSection);
