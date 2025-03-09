/* eslint-disable react-native/no-inline-styles */
import {format, isToday, parseISO} from 'date-fns';
import {LinearGradient} from 'expo-linear-gradient';
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  Flame,
  MoreVertical,
  Repeat,
  Tag,
} from 'lucide-react-native';
import {NavigationContext} from 'navigation-react';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Alert, DimensionValue, ScrollView, StyleSheet} from 'react-native';
import {trigger} from 'react-native-haptic-feedback';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {Habit} from '~/types/habit.types';
import {formatDateFriendly} from '~/utils/date/dateUtils';
import ActionMenu from '~components/specific/actionMenu/ActionMenu';
import {habitActions, useHabitStore} from '~state/habit.store';

const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

const HabitDetailScreen: React.FC = () => {
  const {
    stateNavigator,
    data: {id},
  } = useContext(NavigationContext);
  const [{habits, selectedDate}] = useHabitStore();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [checklistProgress, setChecklistProgress] = useState<{
    [id: string]: boolean;
  }>({});
  const [numericValue, setNumericValue] = useState(0);
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  const bgColor = getThemeColor(theme, 'background', 'base');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const textPrimary = getThemeColor(theme, 'text', 'primary');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const accentColor = getThemeColor(theme, 'text', 'accent');

  useEffect(() => {
    if (id) {
      const foundHabit = habits.find(h => h.id === id);
      if (foundHabit) {
        setHabit(foundHabit);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const progress = foundHabit.progress?.[dateStr];
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
        } else {
          if (
            foundHabit.evaluation.type === 'numeric' ||
            foundHabit.evaluation.type === 'timer'
          ) {
            setNumericValue(0);
          } else if (foundHabit.evaluation.type === 'checklist') {
            const initialProgress: {[id: string]: boolean} = {};
            foundHabit.evaluation.checklistItems?.forEach(item => {
              initialProgress[item.id] = false;
            });
            setChecklistProgress(initialProgress);
          }
        }
      }
    }
  }, [id, habits, selectedDate]);

  const handleBack = () => stateNavigator?.navigateBack(1);

  const handleDelete = () => {
    setActionMenuVisible(false);
    Alert.alert('Delete Habit', 'Are you sure? This action cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
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
    ]);
  };

  const handleEdit = () => {
    setActionMenuVisible(false);
    Alert.alert('Coming Soon', 'Habit editing coming in next update!', [
      {text: 'OK'},
    ]);
  };

  const handleArchive = () => {
    setActionMenuVisible(false);
    if (habit) {
      Alert.alert(
        'Archive Habit',
        'Archive this habit? You can restore it later.',
        [
          {text: 'Cancel', style: 'cancel'},
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

  const handleToggleCompletion = () => {
    if (!habit) {
      return;
    }
    trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    switch (habit.evaluation.type) {
      case 'boolean':
        habitActions.toggleHabitCompletion(habit.id, selectedDate);
        break;
      case 'numeric':
      case 'timer':
        const targetValue = habit.evaluation.target;
        setNumericValue(targetValue);
        habitActions.updateHabitValue(habit.id, targetValue, selectedDate);
        break;
      case 'checklist':
        if (habit.evaluation.checklistItems) {
          const allCompleted = Object.values(checklistProgress).every(Boolean);
          const newProgress = habit.evaluation.checklistItems.reduce(
            (acc, item) => {
              acc[item.id] = !allCompleted;
              return acc;
            },
            {} as {[id: string]: boolean},
          );
          setChecklistProgress(newProgress);
          habit.evaluation.checklistItems.forEach(item => {
            habitActions.toggleChecklistItem(
              habit.id,
              item.id,
              selectedDate,
              !allCompleted,
            );
          });
        }
        break;
    }
  };

  const handleUpdateNumericValue = (increment: boolean) => {
    if (!habit) {
      return;
    }
    trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    const step = increment ? 1 : -1;
    const newValue = Math.max(0, numericValue + step);
    setNumericValue(newValue);
    habitActions.updateHabitValue(habit.id, newValue, selectedDate);
  };

  const handleToggleChecklistItem = (itemId: string) => {
    if (!habit) {
      return;
    }
    trigger('selection', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    habitActions.toggleChecklistItem(habit.id, itemId, selectedDate);
    setChecklistProgress(prev => ({...prev, [itemId]: !prev[itemId]}));
  };

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const progress = habit?.progress?.[dateStr];
  const isCompleted = progress?.isCompleted || false;

  const getCompletionPercentage = (): number => {
    if (!habit || !progress) {
      return 0;
    }
    if (habit.evaluation.type === 'boolean') {
      return isCompleted ? 100 : 0;
    }
    if (
      habit.evaluation.type === 'numeric' ||
      habit.evaluation.type === 'timer'
    ) {
      const value = progress.value || 0;
      return Math.min(Math.round((value / habit.evaluation.target) * 100), 100);
    }
    if (
      habit.evaluation.type === 'checklist' &&
      habit.evaluation.checklistItems
    ) {
      const completed = Object.values(checklistProgress).filter(Boolean).length;
      const total = habit.evaluation.checklistItems.length;
      return total > 0
        ? Math.min(Math.round((completed / total) * 100), 100)
        : 0;
    }
    return 0;
  };

  const completionPercentage = getCompletionPercentage();

  const getFrequencyDescription = (): string => {
    if (!habit) {
      return '';
    }
    const {type, value, timeOfDay} = habit.frequency;
    let description = '';
    if (type === 'daily') {
      description = 'Daily';
    } else if (type === 'hourly') {
      description = `Every ${habit.frequency.interval || 1} hour${
        habit.frequency.interval !== 1 ? 's' : ''
      }`;
    } else if (type === 'weekly') {
      description =
        value.length === 7
          ? 'Every day'
          : `${value.map(d => d.slice(0, 3).toUpperCase()).join(', ')}`;
    } else if (type === 'monthly') {
      description =
        value.length === 1 ? `Day ${value[0]}` : `${value.length} days/month`;
    }
    if (timeOfDay) {
      description += ` @ ${format(new Date(timeOfDay), 'h:mm a')}`;
    }
    return description;
  };

  const isHabitActiveToday = useMemo(() => {
    if (!habit) {
      return false;
    }
    const {type, value} = habit.frequency;
    if (type === 'daily' || type === 'hourly') {
      return true;
    }
    if (type === 'weekly') {
      return value.includes(format(selectedDate, 'EEE').toLowerCase());
    }
    if (type === 'monthly') {
      return value.includes(format(selectedDate, 'd'));
    }
    return false;
  }, [habit, selectedDate]);

  const renderProgressBar = () => {
    const safeWidth =
      isNaN(completionPercentage) || completionPercentage < 0
        ? '0%'
        : `${completionPercentage}%`;
    return (
      <ViewX marginVertical={8}>
        <ViewX
          flexDirection="row"
          justifyContent="space-between"
          marginBottom={4}>
          <TextX fontSize="xs" color="secondary">
            Progress
          </TextX>
          <TextX fontSize="xs" fontWeight="medium" color="primary">
            {completionPercentage}%
          </TextX>
        </ViewX>
        <ViewX
          height={4}
          backgroundColor={withAlpha(habit?.color || accentColor, 0.15)}
          borderRadius={2}
          overflow="hidden">
          <ViewX
            height="100%"
            width={safeWidth as DimensionValue}
            backgroundColor={habit?.color || accentColor}
            borderRadius={2}
          />
        </ViewX>
      </ViewX>
    );
  };

  const renderDetailItem = (
    label: string,
    value: string,
    icon?: React.ReactNode,
  ) => (
    <ViewX
      flexDirection="row"
      marginBottom={styleUtils.spacing.sm}
      paddingVertical={styleUtils.spacing.xs}>
      {icon && <ViewX marginRight={styleUtils.spacing.sm}>{icon}</ViewX>}
      <ViewX>
        <TextX
          fontSize="xs"
          color="secondary"
          fontWeight="semibold"
          textTransform="uppercase">
          {label}
        </TextX>
        <TextX fontSize="sm" color="primary" fontWeight="medium" marginTop={2}>
          {value}
        </TextX>
      </ViewX>
    </ViewX>
  );

  const renderChecklistItem = (item: any) => {
    const isItemCompleted = checklistProgress[item.id] || false;
    return (
      <TouchableX
        key={item.id}
        flexDirection="row"
        alignItems="center"
        paddingVertical={12}
        paddingHorizontal={16}
        marginBottom={8}
        borderRadius={12}
        backgroundColor={
          isItemCompleted
            ? withAlpha(habit?.color || accentColor, 0.1)
            : surfaceColor
        }
        onPress={() => handleToggleChecklistItem(item.id)}>
        <CheckCircle2
          size={20}
          color={isItemCompleted ? habit?.color || accentColor : textSecondary}
          fill={isItemCompleted ? habit?.color || accentColor : 'transparent'}
          strokeWidth={1.5}
        />
        <TextX
          fontSize="sm"
          color={isItemCompleted ? 'primary' : 'secondary'}
          fontWeight={isItemCompleted ? 'medium' : 'regular'}
          marginLeft={12}
          style={
            isItemCompleted ? {textDecorationLine: 'line-through'} : undefined
          }>
          {item.text}
        </TextX>
      </TouchableX>
    );
  };

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

  return (
    <ViewX flex={1} backgroundColor={bgColor}>
      {/* New Elegant Header Design */}
      <LinearGradient
        colors={[
          withAlpha(habit.color || accentColor, 0.15),
          withAlpha(habit.color || accentColor, 0.05),
          'transparent',
        ]}
        style={[styles.headerShadow, {paddingTop: insets.top}]}>
        <ViewX
          flexDirection="row"
          alignItems="center"
          paddingHorizontal={16}
          paddingVertical={8}>
          <TouchableX onPress={handleBack} padding={8}>
            <ArrowLeft size={20} color={textPrimary} />
          </TouchableX>

          <ViewX flex={1} marginHorizontal={12}>
            <TextX
              fontSize="lg"
              fontWeight="bold"
              color="primary"
              numberOfLines={1}
              ellipsizeMode="tail">
              {habit.title}
            </TextX>
            <ViewX flexDirection="row" alignItems="center" marginTop={2}>
              <TextX fontSize="xs" color="secondary" fontWeight="medium">
                {habit.category.charAt(0).toUpperCase() +
                  habit.category.slice(1)}
              </TextX>
              <ViewX
                width={4}
                height={4}
                borderRadius={2}
                backgroundColor={textSecondary}
                marginHorizontal={6}
              />
              <TextX fontSize="xs" color="secondary">
                {getFrequencyDescription()}
              </TextX>
            </ViewX>
          </ViewX>

          <TouchableX onPress={() => setActionMenuVisible(true)} padding={8}>
            <MoreVertical size={20} color={textPrimary} />
          </TouchableX>
        </ViewX>

        {/* Compact Completion Card */}
        {isHabitActiveToday && (
          <ViewX marginHorizontal={16} marginBottom={12}>
            <ViewX
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              backgroundColor={withAlpha(surfaceColor, 0.95)}
              borderRadius={8}
              padding={10}
              style={styles.cardShadow}>
              <ViewX flexDirection="row" alignItems="center">
                <Calendar size={14} color={textSecondary} strokeWidth={1.5} />
                <TextX fontSize="xs" color="primary" marginLeft={6}>
                  {isToday(selectedDate)
                    ? 'Today'
                    : formatDateFriendly(selectedDate)}
                </TextX>
              </ViewX>

              <TouchableX
                flexDirection="row"
                alignItems="center"
                paddingHorizontal={8}
                paddingVertical={4}
                borderRadius={6}
                backgroundColor={
                  isCompleted
                    ? withAlpha(habit.color, 0.15)
                    : withAlpha(habit.color, 0.05)
                }
                onPress={handleToggleCompletion}>
                <CheckCircle2
                  size={16}
                  color={habit.color}
                  fill={isCompleted ? habit.color : 'transparent'}
                  strokeWidth={1.5}
                />
                <TextX
                  fontSize="xs"
                  fontWeight="medium"
                  marginLeft={4}
                  style={{color: habit.color}}>
                  {isCompleted ? 'Done' : 'Complete'}
                </TextX>
              </TouchableX>
            </ViewX>
            {renderProgressBar()}
          </ViewX>
        )}
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: Math.max(insets.bottom, 20)}}>
        {isHabitActiveToday && (
          <ViewX
            padding={16}
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor={borderColor}>
            {habit.evaluation.type !== 'boolean' && (
              <>
                <TextX
                  fontSize="md"
                  fontWeight="semibold"
                  color="primary"
                  marginBottom={12}>
                  {habit.evaluation.type === 'numeric'
                    ? 'Track Amount'
                    : habit.evaluation.type === 'timer'
                    ? 'Track Time'
                    : 'Tasks'}
                </TextX>
                {(habit.evaluation.type === 'numeric' ||
                  habit.evaluation.type === 'timer') && (
                  <ViewX
                    backgroundColor={surfaceColor}
                    borderRadius={12}
                    padding={16}
                    borderWidth={StyleSheet.hairlineWidth}
                    borderColor={borderColor}>
                    <ViewX
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      marginBottom={12}>
                      <TextX fontSize="sm" color="secondary">
                        {habit.evaluation.type === 'numeric'
                          ? `Target: ${habit.evaluation.target} ${
                              habit.evaluation.unit || 'units'
                            }`
                          : `Target: ${habit.evaluation.target} ${
                              habit.evaluation.unit || 'minutes'
                            }`}
                      </TextX>
                      <ViewX
                        backgroundColor={
                          isCompleted
                            ? withAlpha(habit.color, 0.1)
                            : withAlpha(surfaceColor, 0.5)
                        }
                        paddingHorizontal={8}
                        paddingVertical={4}
                        borderRadius={6}>
                        <TextX
                          fontSize="xs"
                          fontWeight="medium"
                          style={{
                            color: isCompleted ? habit.color : textSecondary,
                          }}>
                          {completionPercentage}% Complete
                        </TextX>
                      </ViewX>
                    </ViewX>
                    <ViewX
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <TouchableX
                        width={36}
                        height={36}
                        borderRadius={18}
                        backgroundColor={withAlpha(habit.color, 0.1)}
                        justifyContent="center"
                        alignItems="center"
                        opacity={numericValue <= 0 ? 0.5 : 1}
                        onPress={() => handleUpdateNumericValue(false)}
                        disabled={numericValue <= 0}>
                        <TextX
                          fontSize="xl"
                          color="secondary"
                          style={{height: 30, lineHeight: 30}}>
                          -
                        </TextX>
                      </TouchableX>
                      <ViewX alignItems="center">
                        <TextX fontSize="3xl" fontWeight="bold" color="primary">
                          {numericValue}
                        </TextX>
                        <TextX fontSize="xs" color="secondary" marginTop={2}>
                          {habit.evaluation.unit ||
                            (habit.evaluation.type === 'timer'
                              ? 'minutes'
                              : 'units')}
                        </TextX>
                      </ViewX>
                      <TouchableX
                        width={36}
                        height={36}
                        borderRadius={18}
                        backgroundColor={withAlpha(habit.color, 0.1)}
                        justifyContent="center"
                        alignItems="center"
                        onPress={() => handleUpdateNumericValue(true)}>
                        <TextX
                          fontSize="xl"
                          color="secondary"
                          style={{height: 30, lineHeight: 30}}>
                          +
                        </TextX>
                      </TouchableX>
                    </ViewX>
                  </ViewX>
                )}
                {habit.evaluation.type === 'checklist' &&
                  habit.evaluation.checklistItems && (
                    <ViewX>
                      <ViewX
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom={12}>
                        <TextX fontSize="sm" color="secondary">
                          Complete {habit.evaluation.target} of{' '}
                          {habit.evaluation.checklistItems.length} tasks
                        </TextX>
                        <ViewX
                          backgroundColor={
                            isCompleted
                              ? withAlpha(habit.color, 0.1)
                              : withAlpha(surfaceColor, 0.5)
                          }
                          paddingHorizontal={8}
                          paddingVertical={4}
                          borderRadius={6}>
                          <TextX
                            fontSize="xs"
                            fontWeight="medium"
                            style={{
                              color: isCompleted ? habit.color : textSecondary,
                            }}>
                            {
                              Object.values(checklistProgress).filter(Boolean)
                                .length
                            }{' '}
                            of {habit.evaluation.checklistItems.length}
                          </TextX>
                        </ViewX>
                      </ViewX>
                      {habit.evaluation.checklistItems.map(renderChecklistItem)}
                    </ViewX>
                  )}
              </>
            )}
          </ViewX>
        )}

        <ViewX padding={16}>
          <TextX
            fontSize="md"
            fontWeight="semibold"
            color="primary"
            marginBottom={12}>
            About This Habit
          </TextX>
          {habit.description && (
            <ViewX
              backgroundColor={surfaceColor}
              borderRadius={12}
              padding={16}
              marginBottom={16}
              borderWidth={StyleSheet.hairlineWidth}
              borderColor={borderColor}>
              <TextX fontSize="sm" color="secondary" lineHeight={20}>
                {habit.description}
              </TextX>
            </ViewX>
          )}
          <ViewX
            backgroundColor={surfaceColor}
            borderRadius={12}
            padding={16}
            marginBottom={24}
            borderWidth={StyleSheet.hairlineWidth}
            borderColor={borderColor}>
            {renderDetailItem(
              'Category',
              habit.category.charAt(0).toUpperCase() + habit.category.slice(1),
              <Tag size={16} color={habit.color} strokeWidth={1.5} />,
            )}
            {renderDetailItem(
              'Frequency',
              getFrequencyDescription(),
              <Repeat size={16} color={textSecondary} strokeWidth={1.5} />,
            )}
            {renderDetailItem(
              'Started',
              format(parseISO(habit.createdAt), 'MMM d, yyyy'),
              <Calendar size={16} color={textSecondary} strokeWidth={1.5} />,
            )}
          </ViewX>

          <TextX
            fontSize="md"
            fontWeight="semibold"
            color="primary"
            marginBottom={12}>
            Progress
          </TextX>
          <ViewX
            flexDirection="row"
            justifyContent="space-between"
            marginBottom={16}
            flexWrap="wrap">
            <ViewX
              width="48%"
              backgroundColor={surfaceColor}
              borderRadius={12}
              padding={16}
              borderWidth={StyleSheet.hairlineWidth}
              borderColor={borderColor}
              marginBottom={12}>
              <ViewX flexDirection="row" alignItems="center" marginBottom={8}>
                <Flame size={16} color={habit.color} strokeWidth={1.5} />
                <TextX
                  fontSize="xs"
                  color="secondary"
                  fontWeight="semibold"
                  marginLeft={8}
                  textTransform="uppercase">
                  Current Streak
                </TextX>
              </ViewX>
              <TextX fontSize="2xl" fontWeight="bold" color="primary">
                {habit.streak}
              </TextX>
              <TextX fontSize="xs" color="secondary" marginTop={2}>
                {habit.streak === 1 ? 'day' : 'days'}
              </TextX>
            </ViewX>
            <ViewX
              width="48%"
              backgroundColor={surfaceColor}
              borderRadius={12}
              padding={16}
              borderWidth={StyleSheet.hairlineWidth}
              borderColor={borderColor}
              marginBottom={12}>
              <ViewX flexDirection="row" alignItems="center" marginBottom={8}>
                <Award size={16} color={accentColor} strokeWidth={1.5} />
                <TextX
                  fontSize="xs"
                  color="secondary"
                  fontWeight="semibold"
                  marginLeft={8}
                  textTransform="uppercase">
                  Best Streak
                </TextX>
              </ViewX>
              <TextX fontSize="2xl" fontWeight="bold" color="primary">
                {habit.longestStreak || habit.streak}
              </TextX>
              <TextX fontSize="xs" color="secondary" marginTop={2}>
                {(habit.longestStreak || habit.streak) === 1 ? 'day' : 'days'}
              </TextX>
            </ViewX>
            <ViewX
              width="100%"
              backgroundColor={surfaceColor}
              borderRadius={12}
              padding={16}
              borderWidth={StyleSheet.hairlineWidth}
              borderColor={borderColor}>
              <ViewX flexDirection="row" alignItems="center" marginBottom={8}>
                <FileText size={16} color={textSecondary} strokeWidth={1.5} />
                <TextX
                  fontSize="xs"
                  color="secondary"
                  fontWeight="semibold"
                  marginLeft={8}
                  textTransform="uppercase">
                  Total Completions
                </TextX>
              </ViewX>
              <TextX fontSize="2xl" fontWeight="bold" color="primary">
                {habit.progress ? Object.keys(habit.progress).length : 0}
              </TextX>
              <TextX fontSize="xs" color="secondary" marginTop={2}>
                times
              </TextX>
            </ViewX>
          </ViewX>
        </ViewX>
      </ScrollView>

      <ActionMenu
        visible={actionMenuVisible}
        onClose={() => setActionMenuVisible(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onArchive={handleArchive}
        theme={theme}
        insets={insets}
      />
    </ViewX>
  );
};

export default HabitDetailScreen;
