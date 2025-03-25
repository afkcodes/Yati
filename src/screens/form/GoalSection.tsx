import {
  AlertCircle,
  BarChart,
  Calendar,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  Target,
  Trophy,
} from 'lucide-react-native';
import React, {useCallback, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import SquircleViewContainer from '~/containers/SquircleViewContainer';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {s, vs} from '~utils/screenUtil';
import {SectionLabel} from './BasicInfo';

// Goal structure with weekly, monthly, yearly timeframes
interface GoalData {
  enabled: boolean;
  timeframe: 'weekly' | 'monthly' | 'yearly';
  target: number;
  deadline: Date | null;
}

interface GoalSectionProps {
  goal: GoalData;
  onUpdateGoal: (goal: Partial<GoalData>) => void;
  error?: string;
}

const TIMEFRAME_OPTIONS = [
  {
    id: 'weekly',
    label: 'Weekly',
    icon: CalendarIcon,
    description: 'Reset every week',
  },
  {
    id: 'monthly',
    label: 'Monthly',
    icon: Calendar,
    description: 'Reset every month',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    icon: BarChart,
    description: 'Reset every year',
  },
];

const GoalSection: React.FC<GoalSectionProps> = ({
  goal,
  onUpdateGoal,
  error,
}) => {
  const [timeframeExpanded, setTimeframeExpanded] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetValue, setTargetValue] = useState(String(goal.target || 0));
  const targetInputRef = useRef<TextInput>(null);
  const {theme} = useTheme();

  // Theme colors
  const colors = {
    fieldColor: getThemeColor(theme, 'background', 'field'),
    surfaceColor: getThemeColor(theme, 'background', 'surface'),
    borderColor: getThemeColor(theme, 'border', 'subtle'),
    textPrimary: getThemeColor(theme, 'text', 'primary'),
    textSecondary: getThemeColor(theme, 'text', 'secondary'),
    textTertiary: getThemeColor(theme, 'text', 'tertiary'),
    accentColor: getThemeColor(theme, 'text', 'accent'),
    errorColor: getThemeColor(theme, 'text', 'error'),
    warningColor: getThemeColor(theme, 'text', 'warning'),
    goldColor: '#F6B352', // Custom gold color for trophies
  };

  // Toggle goal enabled/disabled
  const handleToggleEnabled = useCallback(() => {
    if (!goal.enabled) {
      // If enabling, also set reasonable defaults
      const updates: Partial<GoalData> = {
        enabled: true,
      };

      // Set default target if none exists
      if (!goal.target) {
        updates.target = 10;
      }

      // Set default timeframe if none exists
      if (!goal.timeframe) {
        updates.timeframe = 'weekly';
      }

      onUpdateGoal(updates);
    } else {
      // Just disable
      onUpdateGoal({enabled: false});
    }
  }, [goal.enabled, goal.target, goal.timeframe, onUpdateGoal]);

  // Starts editing mode and focuses the input
  const handleStartEditingTarget = useCallback(() => {
    setIsEditingTarget(true);
    setTargetValue(String(goal.target || 0));
    setTimeout(() => {
      if (targetInputRef.current) {
        targetInputRef.current.focus();
      }
    }, 50);
  }, [goal.target]);

  // Validates and only allows numeric input
  const handleTargetInputChange = useCallback((text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setTargetValue(numericValue);
  }, []);

  // Validates and saves the input when done editing
  const handleTargetInputSubmit = useCallback(() => {
    const numValue = parseInt(targetValue, 10);

    // Validate the new target (must be at least 1)
    if (!isNaN(numValue) && numValue > 0) {
      onUpdateGoal({target: numValue});
    } else {
      // Reset to current value if invalid
      setTargetValue(String(goal.target || 0));
    }

    setIsEditingTarget(false);
  }, [targetValue, goal.target, onUpdateGoal]);

  // Updates the target with increment/decrement
  const handleUpdateTarget = useCallback(
    (increment: boolean) => {
      const currentTarget = goal.target || 0;
      const newTarget = increment
        ? currentTarget + 1
        : Math.max(1, currentTarget - 1);
      onUpdateGoal({target: newTarget});
      setTargetValue(String(newTarget));
    },
    [goal.target, onUpdateGoal],
  );

  // Set timeframe
  const handleSetTimeframe = useCallback(
    (timeframe: 'weekly' | 'monthly' | 'yearly') => {
      // When selecting a timeframe, calculate appropriate deadline based on selection
      let deadline = null;

      // Create deadline based on timeframe
      const now = new Date();

      if (timeframe === 'weekly') {
        // Set to end of current week (Sunday)
        const daysUntilSunday = 7 - now.getDay();
        const endOfWeek = new Date();
        endOfWeek.setDate(now.getDate() + daysUntilSunday);
        endOfWeek.setHours(23, 59, 59, 999);
        deadline = endOfWeek;
      } else if (timeframe === 'monthly') {
        // Set to end of current month
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        deadline = endOfMonth;
      } else if (timeframe === 'yearly') {
        // Set to end of current year
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        endOfYear.setHours(23, 59, 59, 999);
        deadline = endOfYear;
      }

      onUpdateGoal({
        timeframe,
        deadline,
      });

      // Close timeframe selector after selection
      setTimeframeExpanded(false);
    },
    [onUpdateGoal],
  );

  // Format time remaining
  const getTimeRemaining = useCallback(() => {
    if (!goal.deadline) {
      return '';
    }

    const now = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `${diffDays} days left`;
    }
  }, [goal.deadline]);

  // Get selected timeframe details
  const selectedTimeframe = TIMEFRAME_OPTIONS.find(
    t => t.id === goal.timeframe,
  );
  const timeRemaining = getTimeRemaining();

  return (
    <ViewX marginVertical={styleUtils.spacing.md}>
      {/* Header with Section Label and Toggle */}
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={vs(8)}>
        <SectionLabel title="Goal" />

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

      {/* Error message */}
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

      {goal.enabled ? (
        /* Goal Content when enabled */
        <ViewX>
          {/* Goal Summary Card */}
          <SquircleViewContainer
            borderRadius="md"
            backgroundColor={colors.surfaceColor}
            padding="md">
            <ViewX
              flexDirection="row"
              alignItems="center"
              marginBottom={vs(10)}>
              <Trophy size={20} color={colors.goldColor} strokeWidth={1.5} />
              <TextX
                fontSize="md"
                fontWeight="semibold"
                color="primary"
                marginLeft={s(8)}>
                Goal Overview
              </TextX>
            </ViewX>

            <ViewX
              borderTopWidth={1}
              borderTopColor={withAlpha(colors.borderColor, 0.3)}
              paddingTop={vs(10)}
              gap={vs(16)}>
              {/* Target Row */}
              <ViewX
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <ViewX flexDirection="row" alignItems="center">
                  <Target
                    size={16}
                    color={colors.textSecondary}
                    strokeWidth={1.5}
                  />
                  <TextX fontSize="sm" color="secondary" marginLeft={s(8)}>
                    Target
                  </TextX>
                </ViewX>

                <ViewX
                  flexDirection="row"
                  alignItems="center"
                  backgroundColor={withAlpha(colors.fieldColor, 0.8)}
                  borderRadius={8}>
                  {/* Decrement Button */}
                  <TouchableX
                    onPress={() => handleUpdateTarget(false)}
                    disabled={goal.target <= 1}
                    opacity={goal.target <= 1 ? 0.5 : 1}
                    paddingHorizontal={s(10)}
                    paddingVertical={vs(6)}
                    borderRightWidth={1}
                    borderRightColor={withAlpha(colors.borderColor, 0.3)}>
                    <TextX fontSize="md" fontWeight="bold" color="tertiary">
                      -
                    </TextX>
                  </TouchableX>

                  {/* Editable Number */}
                  {isEditingTarget ? (
                    <TextInput
                      ref={targetInputRef}
                      style={{
                        minWidth: s(40),
                        maxWidth: s(60),
                        color: colors.textPrimary,
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: 0,
                      }}
                      value={targetValue}
                      onChangeText={handleTargetInputChange}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      onSubmitEditing={handleTargetInputSubmit}
                      onBlur={handleTargetInputSubmit}
                      selectTextOnFocus
                    />
                  ) : (
                    <TouchableX
                      onPress={handleStartEditingTarget}
                      paddingHorizontal={s(12)}
                      paddingVertical={vs(6)}>
                      <TextX fontSize="md" fontWeight="bold" color="primary">
                        {goal.target}
                      </TextX>
                    </TouchableX>
                  )}

                  {/* Increment Button */}
                  <TouchableX
                    onPress={() => handleUpdateTarget(true)}
                    paddingHorizontal={s(10)}
                    paddingVertical={vs(6)}
                    borderLeftWidth={1}
                    borderLeftColor={withAlpha(colors.borderColor, 0.3)}>
                    <TextX fontSize="md" fontWeight="bold" color="tertiary">
                      +
                    </TextX>
                  </TouchableX>
                </ViewX>
              </ViewX>

              {/* Timeframe Row */}
              <TouchableX
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                onPress={() => setTimeframeExpanded(!timeframeExpanded)}>
                <ViewX flexDirection="row" alignItems="center">
                  <Clock
                    size={16}
                    color={colors.textSecondary}
                    strokeWidth={1.5}
                  />
                  <TextX fontSize="sm" color="secondary" marginLeft={s(8)}>
                    Timeframe
                  </TextX>
                </ViewX>

                <ViewX flexDirection="row" alignItems="center">
                  {selectedTimeframe && (
                    <>
                      <selectedTimeframe.icon
                        size={14}
                        color={colors.accentColor}
                        strokeWidth={1.5}
                      />
                      <TextX
                        fontSize="sm"
                        color="accent"
                        fontWeight="medium"
                        marginLeft={s(4)}
                        marginRight={s(4)}>
                        {selectedTimeframe.label}
                      </TextX>
                    </>
                  )}

                  <ChevronRight
                    size={16}
                    color={colors.textTertiary}
                    style={{
                      transform: [
                        {rotate: timeframeExpanded ? '90deg' : '0deg'},
                      ],
                    }}
                  />
                </ViewX>
              </TouchableX>

              {/* Timeframe Options when expanded */}
              {timeframeExpanded && (
                <ViewX
                  backgroundColor={withAlpha(colors.fieldColor, 0.5)}
                  borderRadius={12}
                  padding={s(12)}
                  gap={vs(8)}>
                  {TIMEFRAME_OPTIONS.map(option => (
                    <TouchableX
                      key={option.id}
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      paddingVertical={vs(8)}
                      paddingHorizontal={s(12)}
                      borderRadius={8}
                      backgroundColor={
                        goal.timeframe === option.id
                          ? withAlpha(colors.accentColor, 0.1)
                          : 'transparent'
                      }
                      onPress={() => handleSetTimeframe(option.id as any)}>
                      <ViewX flexDirection="row" alignItems="center">
                        <option.icon
                          size={16}
                          color={
                            goal.timeframe === option.id
                              ? colors.accentColor
                              : colors.textSecondary
                          }
                          strokeWidth={1.5}
                        />
                        <ViewX marginLeft={s(8)}>
                          <TextX
                            fontSize="sm"
                            fontWeight="medium"
                            color={
                              goal.timeframe === option.id
                                ? 'accent'
                                : 'primary'
                            }>
                            {option.label}
                          </TextX>
                          <TextX fontSize="xs" color="tertiary">
                            {option.description}
                          </TextX>
                        </ViewX>
                      </ViewX>
                    </TouchableX>
                  ))}
                </ViewX>
              )}

              {/* Deadline Row */}
              {goal.deadline && (
                <ViewX
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <ViewX flexDirection="row" alignItems="center">
                    <Calendar
                      size={16}
                      color={colors.textSecondary}
                      strokeWidth={1.5}
                    />
                    <TextX fontSize="sm" color="secondary" marginLeft={s(8)}>
                      Deadline
                    </TextX>
                  </ViewX>

                  <ViewX
                    backgroundColor={
                      timeRemaining === 'Expired'
                        ? withAlpha(colors.errorColor, 0.1)
                        : timeRemaining === 'Today' ||
                            timeRemaining === 'Tomorrow'
                          ? withAlpha(colors.warningColor, 0.1)
                          : withAlpha(colors.accentColor, 0.1)
                    }
                    paddingHorizontal={s(8)}
                    paddingVertical={vs(4)}
                    borderRadius={16}>
                    <TextX
                      fontSize="xs"
                      color={
                        timeRemaining === 'Expired'
                          ? 'error'
                          : timeRemaining === 'Today' ||
                              timeRemaining === 'Tomorrow'
                            ? 'warning'
                            : 'accent'
                      }
                      fontWeight="medium">
                      {timeRemaining}
                    </TextX>
                  </ViewX>
                </ViewX>
              )}
            </ViewX>
          </SquircleViewContainer>

          {/* Goal Summary Message */}
          <ViewX marginTop={vs(12)}>
            <TextX fontSize="xs" color="tertiary" textAlign="center">
              You need to complete this habit {goal.target} time
              {goal.target !== 1 ? 's' : ''}
              {goal.timeframe === 'weekly'
                ? ' this week'
                : goal.timeframe === 'monthly'
                  ? ' this month'
                  : goal.timeframe === 'yearly'
                    ? ' this year'
                    : ''}
            </TextX>
          </ViewX>
        </ViewX>
      ) : (
        /* Goal Content when disabled */
        <ViewX marginTop={vs(4)}>
          <SquircleViewContainer
            borderRadius="md"
            variant="field"
            padding="md"
            borderWidth={1}
            borderColor={withAlpha(colors.borderColor, 0.5)}>
            <ViewX flexDirection="row" alignItems="center">
              <Target size={20} color={colors.textTertiary} strokeWidth={1.5} />
              <ViewX marginLeft={s(12)}>
                <TextX fontSize="sm" fontWeight="medium" color="secondary">
                  Set a target goal
                </TextX>
                <TextX fontSize="xs" color="tertiary">
                  Track your progress with weekly, monthly, or yearly goals
                </TextX>
              </ViewX>
            </ViewX>
          </SquircleViewContainer>

          <ViewX marginTop={vs(8)}>
            <TextX fontSize="xs" color="tertiary" textAlign="center">
              Toggle the switch to set a goal for this habit
            </TextX>
          </ViewX>
        </ViewX>
      )}
    </ViewX>
  );
};

export default React.memo(GoalSection);
