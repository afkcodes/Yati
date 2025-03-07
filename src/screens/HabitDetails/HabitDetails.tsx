// screens/HabitDetail/HabitDetailScreen.tsx
import {format, formatDistance, parseISO} from 'date-fns';
import {
  ArrowLeft,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Flame,
  Info,
  Minus,
  MoreVertical,
  Plus,
} from 'lucide-react-native';
import {NavigationContext} from 'navigation-react';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, ScrollView} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~/components/common';
// import ActionSheet from '~/components/common/ActionSheet';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {Habit} from '~/types/habit.types';
import {formatDateFriendly, formatStreakCount} from '~/utils/date/dateUtils';
import {habitActions, useHabitStore} from '~state/habit.store';

interface HabitDetailScreenProps {
  id: string; // Habit ID from navigation
}

const HabitDetailScreen: React.FC<HabitDetailScreenProps> = ({id}) => {
  const {stateNavigator} = useContext(NavigationContext);
  const [{habits, selectedDate}] = useHabitStore();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [checklistProgress, setChecklistProgress] = useState<{
    [id: string]: boolean;
  }>({});
  const [numericValue, setNumericValue] = useState(0);
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  // Animation values
  const progressValue = useSharedValue(0);
  const checkAnim = useSharedValue(0);

  // Get theme colors
  const bgColor = getThemeColor(theme, 'background', 'base');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const textPrimary = getThemeColor(theme, 'text', 'primary');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const fieldColor = getThemeColor(theme, 'background', 'surface');

  // Find the habit by ID and update the progress state
  useEffect(() => {
    if (id) {
      const foundHabit = habits.find(h => h.id === id);
      if (foundHabit) {
        setHabit(foundHabit);

        // Get progress for selected date
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const progress = foundHabit.progress?.[dateStr];

        // Initialize state based on progress
        if (progress) {
          if (
            foundHabit.evaluation.type === 'numeric' ||
            foundHabit.evaluation.type === 'timer'
          ) {
            setNumericValue(progress.value || 0);
          } else if (
            foundHabit.evaluation.type === 'checklist' &&
            progress.checklistProgress
          ) {
            setChecklistProgress(progress.checklistProgress);
          }

          // Animate progress
          progressValue.value = withTiming(progress.isCompleted ? 1 : 0, {
            duration: 300,
          });
        } else {
          // No progress yet for this date
          progressValue.value = 0;

          if (
            foundHabit.evaluation.type === 'numeric' ||
            foundHabit.evaluation.type === 'timer'
          ) {
            setNumericValue(0);
          } else if (foundHabit.evaluation.type === 'checklist') {
            // Initialize all items as unchecked
            const initialProgress: {[id: string]: boolean} = {};
            foundHabit.evaluation.checklistItems?.forEach(item => {
              initialProgress[item.id] = false;
            });
            setChecklistProgress(initialProgress);
          }
        }
      }
    }
  }, [id, habits, selectedDate, progressValue]);

  // Handle navigation back
  const handleBack = () => {
    if (stateNavigator) {
      stateNavigator.navigateBack(1);
    }
  };

  // Handle habit deletion with confirmation
  const handleDelete = () => {
    setActionSheetVisible(false);

    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (habit) {
              habitActions.deleteHabit(habit.id);
              handleBack();
            }
          },
        },
      ],
    );
  };

  // Handle edit habit
  const handleEdit = () => {
    setActionSheetVisible(false);
    // TODO: Navigate to edit screen with habit ID
    console.log('Edit habit:', habit?.id);
  };

  // Handle archiving habit
  const handleArchive = () => {
    setActionSheetVisible(false);

    if (habit) {
      Alert.alert(
        'Archive Habit',
        'Would you like to archive this habit? You can restore it later.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Archive',
            onPress: () => {
              habitActions.archiveHabit(habit.id);
              handleBack();
            },
          },
        ],
      );
    }
  };

  // Handle toggling completion for boolean habits
  const handleToggleCompletion = () => {
    if (habit) {
      // Toggle completion animation
      checkAnim.value = withSpring(1, {damping: 12}, () => {
        checkAnim.value = withTiming(0, {duration: 300});
      });

      // Update in store
      habitActions.toggleHabitCompletion(habit.id, selectedDate);
    }
  };

  // Handle numeric value updates
  const handleUpdateNumericValue = (increment: boolean) => {
    if (habit) {
      const step = increment ? 1 : -1;
      const newValue = Math.max(0, numericValue + step);
      setNumericValue(newValue);

      // Update in store
      habitActions.updateHabitValue(habit.id, newValue, selectedDate);
    }
  };

  // Handle checklist item toggle
  const handleToggleChecklistItem = (itemId: string) => {
    if (habit) {
      // Toggle in store
      habitActions.toggleChecklistItem(habit.id, itemId, selectedDate);
    }
  };

  // Animated styles
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: 1 + checkAnim.value * 0.2}],
    opacity: withTiming(progressValue.value > 0 ? 1 : 0.6, {duration: 200}),
  }));

  // If habit not found, show error state
  if (!habit) {
    return (
      <ViewX
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor={bgColor}>
        <TextX fontSize="lg" color="secondary">
          Habit not found
        </TextX>
        <TouchableX
          padding={styleUtils.spacing.sm}
          marginTop={styleUtils.spacing.md}
          backgroundColor={surfaceColor}
          borderRadius={styleUtils.borderRadius.md}
          onPress={handleBack}>
          <TextX color="accent">Go Back</TextX>
        </TouchableX>
      </ViewX>
    );
  }

  // Check if habit is completed
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const progress = habit.progress?.[dateStr];
  const isCompleted = progress?.isCompleted || false;

  // Function to determine if habit is active on the selected date
  const isActiveToday = () => {
    // Check frequency
    const {type, value} = habit.frequency;

    if (type === 'daily') {
      return true;
    } else if (type === 'hourly') {
      return true;
    } else if (type === 'weekly') {
      // Check if day of week matches
      const day = format(selectedDate, 'EEE').toLowerCase();
      return value.includes(day);
    } else if (type === 'monthly') {
      // Check if day of month matches
      const dayOfMonth = format(selectedDate, 'd');
      return value.includes(dayOfMonth);
    }

    return false;
  };

  const isHabitActiveToday = isActiveToday();

  return (
    <ViewX
      flex={1}
      backgroundColor={bgColor}
      paddingTop={insets.top}
      paddingBottom={insets.bottom}>
      {/* Header */}
      <ViewX
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={styleUtils.spacing.md}
        paddingVertical={styleUtils.spacing.sm}
        borderBottomWidth={1}
        borderBottomColor={borderColor}>
        <TouchableX
          padding={styleUtils.spacing.xs}
          borderRadius={styleUtils.borderRadius.full}
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button">
          <ArrowLeft size={24} color={textPrimary} />
        </TouchableX>

        <TextX fontSize="lg" fontWeight="semibold" color="primary">
          Habit Details
        </TextX>

        <TouchableX
          padding={styleUtils.spacing.xs}
          borderRadius={styleUtils.borderRadius.full}
          onPress={() => setActionSheetVisible(true)}
          accessibilityLabel="More options"
          accessibilityRole="button">
          <MoreVertical size={24} color={textPrimary} />
        </TouchableX>
      </ViewX>

      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {/* Habit Header */}
        <ViewX
          backgroundColor={withAlpha(habit.color, 0.15)}
          padding={styleUtils.spacing.md}
          borderBottomWidth={1}
          borderBottomColor={borderColor}>
          <TextX
            fontSize="2xl"
            fontWeight="bold"
            color="primary"
            marginBottom={styleUtils.spacing.xs}>
            {habit.title}
          </TextX>

          <ViewX
            flexDirection="row"
            alignItems="center"
            marginTop={styleUtils.spacing.xs}>
            <Clock size={16} color={textSecondary} strokeWidth={1.5} />
            <TextX
              fontSize="sm"
              color="secondary"
              marginLeft={styleUtils.spacing.xs}>
              {habit.frequency.type === 'daily'
                ? 'Every day'
                : habit.frequency.type === 'weekly'
                ? `Weekly (${habit.frequency.value
                    .map(d => d.toUpperCase())
                    .join(', ')})`
                : habit.frequency.type === 'monthly'
                ? `Monthly (${habit.frequency.value.length} days)`
                : `Every ${habit.frequency.interval || 1} hours`}
            </TextX>
          </ViewX>

          {habit.description && (
            <TextX
              fontSize="sm"
              color="secondary"
              marginTop={styleUtils.spacing.md}>
              {habit.description}
            </TextX>
          )}

          <ViewX
            flexDirection="row"
            marginTop={styleUtils.spacing.md}
            alignItems="center">
            <ViewX
              flexDirection="row"
              alignItems="center"
              backgroundColor={withAlpha(habit.color, 0.1)}
              paddingHorizontal={styleUtils.spacing.sm}
              paddingVertical={styleUtils.spacing.xs}
              borderRadius={styleUtils.borderRadius.sm}>
              <Flame size={14} color={habit.color} strokeWidth={1.5} />
              <TextX
                fontSize="xs"
                color="secondary"
                marginLeft={styleUtils.spacing.xs}
                style={{color: habit.color}}>
                {formatStreakCount(habit.streak)}
              </TextX>
            </ViewX>

            <ViewX
              flexDirection="row"
              alignItems="center"
              marginLeft={styleUtils.spacing.sm}
              backgroundColor={withAlpha(surfaceColor, 0.5)}
              paddingHorizontal={styleUtils.spacing.sm}
              paddingVertical={styleUtils.spacing.xs}
              borderRadius={styleUtils.borderRadius.sm}>
              <CalendarCheck2
                size={14}
                color={textSecondary}
                strokeWidth={1.5}
              />
              <TextX
                fontSize="xs"
                color="secondary"
                marginLeft={styleUtils.spacing.xs}>
                Started{' '}
                {formatDistance(parseISO(habit.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </TextX>
            </ViewX>
          </ViewX>
        </ViewX>

        {/* Progress for current day */}
        <ViewX
          padding={styleUtils.spacing.md}
          borderBottomWidth={1}
          borderBottomColor={borderColor}>
          <ViewX
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={styleUtils.spacing.sm}>
            <TextX fontSize="md" fontWeight="semibold" color="primary">
              {format(selectedDate, 'yyyy-MM-dd') ===
              format(new Date(), 'yyyy-MM-dd')
                ? "Today's Progress"
                : `Progress for ${formatDateFriendly(selectedDate)}`}
            </TextX>

            {!isHabitActiveToday && (
              <ViewX
                backgroundColor={withAlpha(fieldColor, 0.5)}
                paddingHorizontal={styleUtils.spacing.sm}
                paddingVertical={styleUtils.spacing.xs}
                borderRadius={styleUtils.borderRadius.sm}>
                <TextX fontSize="xs" color="tertiary">
                  Not scheduled for this day
                </TextX>
              </ViewX>
            )}
          </ViewX>

          {isHabitActiveToday && (
            <>
              {/* Progress Bar */}
              <ViewX
                height={8}
                backgroundColor={withAlpha(textSecondary, 0.2)}
                borderRadius={styleUtils.borderRadius.full}
                marginVertical={styleUtils.spacing.sm}
                overflow="hidden">
                <Animated.View
                  style={[
                    {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      backgroundColor: habit.color,
                      borderRadius: styleUtils.borderRadius.full,
                    },
                    progressBarStyle,
                  ]}
                />
              </ViewX>

              {/* Toggle completion for boolean habits */}
              {habit.evaluation.type === 'boolean' && (
                <TouchableX
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  padding={styleUtils.spacing.md}
                  borderRadius={styleUtils.borderRadius.md}
                  marginTop={styleUtils.spacing.sm}
                  backgroundColor={withAlpha(
                    isCompleted ? habit.color : surfaceColor,
                    0.2,
                  )}
                  borderWidth={1}
                  borderColor={withAlpha(
                    isCompleted ? habit.color : borderColor,
                    0.5,
                  )}
                  onPress={handleToggleCompletion}>
                  <Animated.View style={checkAnimStyle}>
                    <CheckCircle2
                      size={24}
                      color={isCompleted ? habit.color : textSecondary}
                      fill={isCompleted ? habit.color : 'transparent'}
                      strokeWidth={1.5}
                    />
                  </Animated.View>
                  <TextX
                    fontSize="md"
                    fontWeight="semibold"
                    color={isCompleted ? 'primary' : 'secondary'}
                    marginLeft={styleUtils.spacing.sm}>
                    {isCompleted ? 'Completed' : 'Mark as Complete'}
                  </TextX>
                </TouchableX>
              )}

              {/* Numeric input for numeric/timer habits */}
              {(habit.evaluation.type === 'numeric' ||
                habit.evaluation.type === 'timer') && (
                <ViewX
                  backgroundColor={withAlpha(surfaceColor, 0.3)}
                  padding={styleUtils.spacing.md}
                  borderRadius={styleUtils.borderRadius.md}
                  marginTop={styleUtils.spacing.sm}
                  borderWidth={1}
                  borderColor={withAlpha(borderColor, 0.3)}>
                  <ViewX
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <TextX fontSize="sm" fontWeight="medium" color="secondary">
                      {habit.evaluation.type === 'numeric'
                        ? `Track amount (${habit.evaluation.unit || 'units'})`
                        : `Track time (${habit.evaluation.unit})`}
                    </TextX>
                    <TextX
                      fontSize="sm"
                      color={isCompleted ? 'accent' : 'tertiary'}>
                      {isCompleted
                        ? 'Completed'
                        : `Target: ${habit.evaluation.target} ${
                            habit.evaluation.unit || 'units'
                          }`}
                    </TextX>
                  </ViewX>

                  <ViewX
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={styleUtils.spacing.md}>
                    <TouchableX
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={withAlpha(fieldColor, 0.7)}
                      justifyContent="center"
                      alignItems="center"
                      onPress={() => handleUpdateNumericValue(false)}
                      disabled={numericValue <= 0}>
                      <Minus
                        size={20}
                        color={textSecondary}
                        strokeWidth={1.5}
                      />
                    </TouchableX>

                    <ViewX flexDirection="row" alignItems="flex-end">
                      <TextX fontSize="3xl" fontWeight="bold" color="primary">
                        {numericValue}
                      </TextX>
                      <TextX
                        fontSize="md"
                        color="secondary"
                        marginLeft={styleUtils.spacing.xs}
                        marginBottom={styleUtils.spacing.xs}>
                        {habit.evaluation.unit || 'units'}
                      </TextX>
                    </ViewX>

                    <TouchableX
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={withAlpha(fieldColor, 0.7)}
                      justifyContent="center"
                      alignItems="center"
                      onPress={() => handleUpdateNumericValue(true)}>
                      <Plus size={20} color={textSecondary} strokeWidth={1.5} />
                    </TouchableX>
                  </ViewX>
                </ViewX>
              )}

              {/* Checklist for checklist habits */}
              {habit.evaluation.type === 'checklist' &&
                habit.evaluation.checklistItems && (
                  <ViewX
                    backgroundColor={withAlpha(surfaceColor, 0.3)}
                    padding={styleUtils.spacing.md}
                    borderRadius={styleUtils.borderRadius.md}
                    marginTop={styleUtils.spacing.sm}
                    borderWidth={1}
                    borderColor={withAlpha(borderColor, 0.3)}>
                    <ViewX
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      marginBottom={styleUtils.spacing.sm}>
                      <TextX
                        fontSize="sm"
                        fontWeight="medium"
                        color="secondary">
                        Checklist
                      </TextX>
                      <TextX
                        fontSize="xs"
                        color={isCompleted ? 'accent' : 'tertiary'}>
                        {progress?.checklistProgress
                          ? `${
                              Object.values(progress.checklistProgress).filter(
                                Boolean,
                              ).length
                            } of ${
                              habit.evaluation.checklistItems.length
                            } completed`
                          : `0 of ${habit.evaluation.checklistItems.length} completed`}
                      </TextX>
                    </ViewX>

                    {habit.evaluation.checklistItems.map(item => {
                      const itemCompleted = checklistProgress[item.id] || false;

                      return (
                        <TouchableX
                          key={item.id}
                          flexDirection="row"
                          alignItems="center"
                          padding={styleUtils.spacing.sm}
                          marginBottom={styleUtils.spacing.xs}
                          borderRadius={styleUtils.borderRadius.sm}
                          backgroundColor={withAlpha(
                            itemCompleted ? habit.color : fieldColor,
                            0.15,
                          )}
                          onPress={() => handleToggleChecklistItem(item.id)}>
                          <CheckCircle2
                            size={18}
                            color={itemCompleted ? habit.color : textSecondary}
                            fill={itemCompleted ? habit.color : 'transparent'}
                            strokeWidth={1.5}
                          />
                          <TextX
                            fontSize="sm"
                            color={itemCompleted ? 'primary' : 'secondary'}
                            marginLeft={styleUtils.spacing.sm}
                            style={
                              itemCompleted
                                ? {textDecorationLine: 'line-through'}
                                : undefined
                            }>
                            {item.text}
                          </TextX>
                        </TouchableX>
                      );
                    })}
                  </ViewX>
                )}
            </>
          )}
        </ViewX>

        {/* Streak & Stats */}
        <ViewX padding={styleUtils.spacing.md}>
          <TextX
            fontSize="md"
            fontWeight="semibold"
            color="primary"
            marginBottom={styleUtils.spacing.sm}>
            Stats
          </TextX>

          <ViewX
            flexDirection="row"
            flexWrap="wrap"
            gap={styleUtils.spacing.sm}>
            <ViewX
              backgroundColor={withAlpha(surfaceColor, 0.5)}
              borderRadius={styleUtils.borderRadius.md}
              padding={styleUtils.spacing.md}
              width="48%"
              borderWidth={1}
              borderColor={withAlpha(borderColor, 0.3)}>
              <Flame size={18} color={habit.color} strokeWidth={1.5} />
              <TextX
                fontSize="2xl"
                fontWeight="bold"
                color="primary"
                marginTop={styleUtils.spacing.xs}>
                {habit.streak}
              </TextX>
              <TextX fontSize="xs" color="secondary">
                Current Streak
              </TextX>
            </ViewX>

            <ViewX
              backgroundColor={withAlpha(surfaceColor, 0.5)}
              borderRadius={styleUtils.borderRadius.md}
              padding={styleUtils.spacing.md}
              width="48%"
              borderWidth={1}
              borderColor={withAlpha(borderColor, 0.3)}>
              <Flame size={18} color={accentColor} strokeWidth={1.5} />
              <TextX
                fontSize="2xl"
                fontWeight="bold"
                color="primary"
                marginTop={styleUtils.spacing.xs}>
                {habit.longestStreak}
              </TextX>
              <TextX fontSize="xs" color="secondary">
                Best Streak
              </TextX>
            </ViewX>

            <ViewX
              backgroundColor={withAlpha(surfaceColor, 0.5)}
              borderRadius={styleUtils.borderRadius.md}
              padding={styleUtils.spacing.md}
              width="100%"
              borderWidth={1}
              borderColor={withAlpha(borderColor, 0.3)}>
              <Info size={18} color={textSecondary} strokeWidth={1.5} />
              <TextX
                fontSize="md"
                fontWeight="semibold"
                color="primary"
                marginTop={styleUtils.spacing.xs}>
                Habit Details
              </TextX>
              <ViewX marginTop={styleUtils.spacing.sm}>
                <TextX
                  fontSize="xs"
                  color="secondary"
                  marginBottom={styleUtils.spacing.xs}>
                  • Category: {habit.category}
                </TextX>
                <TextX
                  fontSize="xs"
                  color="secondary"
                  marginBottom={styleUtils.spacing.xs}>
                  • Created: {format(parseISO(habit.createdAt), 'MMM d, yyyy')}
                </TextX>
                <TextX
                  fontSize="xs"
                  color="secondary"
                  marginBottom={styleUtils.spacing.xs}>
                  • Frequency: {habit.frequency.type}
                  {habit.frequency.timeOfDay &&
                    ` at ${format(habit.frequency.timeOfDay, 'h:mm a')}`}
                </TextX>
                <TextX fontSize="xs" color="secondary">
                  • Tracking: {habit.evaluation.type}
                  {(habit.evaluation.type === 'numeric' ||
                    habit.evaluation.type === 'timer') &&
                    ` (${habit.evaluation.target} ${
                      habit.evaluation.unit || 'units'
                    })`}
                  {habit.evaluation.type === 'checklist' &&
                    ` (${habit.evaluation.target} of ${
                      habit.evaluation.checklistItems?.length || 0
                    } tasks)`}
                </TextX>
              </ViewX>
            </ViewX>
          </ViewX>
        </ViewX>
      </ScrollView>

      {/* Action Sheet for more options */}
      {/* <ActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        actions={[
          {
            icon: Edit2,
            label: 'Edit Habit',
            onPress: handleEdit,
          },
          {
            icon: Trash2,
            label: 'Delete Habit',
            onPress: handleDelete,
            destructive: true,
          },
          {
            icon: X,
            label: 'Archive Habit',
            onPress: handleArchive,
          },
        ]}
      /> */}
    </ViewX>
  );
};

export default HabitDetailScreen;
