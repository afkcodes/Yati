/* eslint-disable react-native/no-inline-styles */
import {Plus} from 'lucide-react-native';
import {NavigationContext} from 'navigation-react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Alert, FlatList} from 'react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import CalendarStrip from '~components/common/CalenderStrip';
import GreetingHeader from '~components/specific/home/Greeting';
import HabitCard from '~components/specific/home/Habit';
import TimeFilter from '~components/specific/home/TimeFilter';
import {useTheme} from '~hooks/ThemeContext';
import {useHabitStore} from '~state/habit/habit.store';
import {habitActions} from '~state/habit/habitActions';

import {getThemeColor, styleUtils, withAlpha} from '~styles/theme';
import {Habit} from '~types/habit.types';
import {
  fromJSDate,
  getLocalToday,
  now,
  toDateString,
  toJSDate,
  toUTCISO,
} from '~utils/date/dateUtils';
import {h, vs, w} from '~utils/screenUtil';
import {habitToFormData} from '~utils/storage/storageUtils';

const EmptyState = React.memo(
  ({
    onCreateHabit,
    accentColor,
  }: {
    onCreateHabit: () => void;
    accentColor: string;
  }) => (
    <ViewX
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingTop={vs(60)}>
      <TouchableX
        onPress={onCreateHabit}
        padding={styleUtils.spacing.md}
        borderRadius={styleUtils.borderRadius.md}
        backgroundColor={withAlpha(accentColor, 0.1)}>
        <TextX color="accent" fontSize="md" textAlign="center">
          No habits for this day.{'\n'}Create a new habit to get started!
        </TextX>
      </TouchableX>
    </ViewX>
  ),
  (prevProps, nextProps) => prevProps.accentColor === nextProps.accentColor,
);

const Home = () => {
  const {stateNavigator} = useContext(NavigationContext);
  const {theme} = useTheme();
  const [
    {habits: allHabits, selectedDate: storedDate, timeFilter: selectedTime},
  ] = useHabitStore();
  const [localSelectedDate, setLocalSelectedDate] = useState<Date>(
    toJSDate(storedDate),
  );

  console.log('Home re-rendered with storedDate:', storedDate.toISO());

  const validStoredDate = useMemo(() => {
    console.log('Stored date:', storedDate.toISO());
    const date =
      storedDate && storedDate.isValid
        ? storedDate.startOf('day')
        : getLocalToday();
    console.log('Valid stored date:', date.toISO());
    return date;
  }, [storedDate]);

  const backgroundColor = getThemeColor(theme, 'background', 'primary');
  const navBackgroundColor = getThemeColor(theme, 'background', 'surface');
  const accentColor = getThemeColor(theme, 'background', 'accent');

  // Ensure the store's selectedDate is initialized on mount
  useEffect(() => {
    const today = getLocalToday();
    if (
      !storedDate ||
      !storedDate.isValid ||
      storedDate.toMillis() !== today.toMillis()
    ) {
      console.log('Initializing selectedDate to today:', today.toISO());
      habitActions.setSelectedDate(today);
      setLocalSelectedDate(toJSDate(today));
    }
  }, []); // Empty dependency array to run only on mount

  const habitsForDate = useMemo(() => {
    console.log('All habits:', allHabits);
    if (validStoredDate && validStoredDate.isValid) {
      const normalizedDate = validStoredDate.startOf('day');
      const filtered = habitActions.getHabitsForDate(
        normalizedDate,
        selectedTime,
      );
      console.log('Habits for date after filtering:', filtered);
      return filtered;
    }
    console.log('No valid date, returning empty habits');
    return [];
  }, [allHabits, validStoredDate, selectedTime]);

  const isCompleted = useCallback(
    (habit: Habit): boolean => {
      if (!validStoredDate || !validStoredDate.isValid) {
        return false;
      }
      const dateStr = toDateString(validStoredDate);
      const progress = habit.progress?.[dateStr];
      return progress ? habitActions.isHabitCompleted(habit, progress) : false;
    },
    [validStoredDate],
  );

  const handleToggleHabit = useCallback(
    (habit: Habit) => {
      if (!validStoredDate || !validStoredDate.isValid) {
        return;
      }

      // Handle different evaluation types
      switch (habit.evaluation.type) {
        case 'boolean':
          // Toggle boolean habit completion
          habitActions.toggleHabitCompletion(habit.id, validStoredDate);
          break;
        case 'numeric':
        case 'timer':
        case 'checklist':
          // These types need more interaction, so navigate to details
          stateNavigator?.navigate('habitDetail', {id: habit.id});
          return; // Exit early since we're navigating away
        default:
          // Fallback to toggle completion for any other types
          habitActions.toggleHabitCompletion(habit.id, validStoredDate);
      }
    },
    [validStoredDate, stateNavigator],
  );

  const handleCreateHabit = useCallback(() => {
    stateNavigator?.navigate('create');
  }, [stateNavigator]);

  const handleEditHabit = useCallback(
    (habit: Habit) => {
      // Convert Habit to HabitFormData for editing
      const formData = habitToFormData(habit);
      // Navigate to HabitCreationScreen in edit mode
      stateNavigator?.navigate('create', {
        mode: 'edit',
        formData: JSON.stringify(formData),
      });
    },
    [stateNavigator],
  );

  const handleArchiveHabit = useCallback((habit: Habit) => {
    // Update the habit with an archivedAt timestamp
    habitActions.updateHabit(habit.id, {archivedAt: toUTCISO(now())});
  }, []);

  const handleDuplicateHabit = useCallback((habit: Habit) => {
    // Create a new habit with the same details but a new ID
    const newHabit: Habit = {
      ...habit,
      id: 'habit_' + now().toMillis().toString(),
      createdAt: toUTCISO(now()),
      progress: {},
      streak: {current: 0, longest: 0},
      archivedAt: undefined,
    };
    habitActions.addHabit(habitToFormData(newHabit));
  }, []);

  const handleViewStats = useCallback(
    (habit: Habit) => {
      // Navigate to a stats screen (to be implemented)
      stateNavigator?.navigate('habitStats', {id: habit.id});
    },
    [stateNavigator],
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      const dt = fromJSDate(date, 'local').startOf('day');
      if (
        dt.isValid &&
        (!storedDate || storedDate.toMillis() !== dt.toMillis())
      ) {
        console.log('Setting selected date:', dt.toISO());
        habitActions.setSelectedDate(dt);
        setLocalSelectedDate(date); // Update local state to force re-render
      } else {
        console.log(
          'Date not updated:',
          dt.toISO(),
          'Stored date:',
          storedDate?.toISO(),
        );
      }
    },
    [storedDate],
  );

  const handleTimeFilterSelect = useCallback(
    (time: 'morning' | 'evening' | 'night' | 'all') => {
      if (time !== selectedTime) {
        console.log('Setting time filter:', time);
        habitActions.setTimeFilter(time);
      }
    },
    [selectedTime],
  );

  const renderHabitItem = useCallback(
    ({item}: {item: Habit}) => (
      <HabitCard
        habit={item}
        onPress={habit => handleToggleHabit(habit)}
        onEdit={handleEditHabit}
        onDelete={habit => habitActions.deleteHabit(habit.id)}
        onArchive={handleArchiveHabit}
        onDuplicate={handleDuplicateHabit}
        onViewStats={handleViewStats}
        isCompleted={isCompleted(item)}
      />
    ),
    [
      handleToggleHabit,
      handleEditHabit,
      handleArchiveHabit,
      handleDuplicateHabit,
      handleViewStats,
      isCompleted,
    ],
  );

  return (
    <ViewX variant="base" flex={1} backgroundColor={backgroundColor}>
      <GreetingHeader
        username="Ashish"
        avatar="https://scontent.fblr20-4.fna.fbcdn.net/v/t39.30808-6/405331272_24313753894937170_7956735316394196740_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=z8ZuBDudHt0Q7kNvgEXyu0U&_nc_oc=Adi2jpdaXW2Gb2wjvw4k0uvvUzu28uN9lMhEOR-nKKUEQb4BO9DAtebGtrWHPgYm4sKuEfr5SBdy4t6yWThPhazL&_nc_zt=23&_nc_ht=scontent.fblr20-4.fna&_nc_gid=ATSIm0AytsYwRGtOSsVhiGw&oh=00_AYCH23sAu5ygCPNPHOf0OAdwvDF1mci3heJWRaeuhTNbzw&oe=67CB1889"
        streakCount={5}
        hasUnreadNotifications={true}
        onPressNotification={() => {}}
        onPressStreak={() =>
          Alert.alert(
            'Streak Info',
            'You have a 5-day streak going. Keep it up!',
          )
        }
      />

      <ViewX
        backgroundColor={navBackgroundColor}
        width={w(100)}
        position="absolute"
        bottom={0}
        zIndex={100}
        paddingVertical={styleUtils.spacing['2xs']}>
        <CalendarStrip
          selectedDate={localSelectedDate}
          onDateSelect={handleDateSelect}
          daysToShow={30}
        />
      </ViewX>

      <TouchableX
        position="absolute"
        justifyContent="center"
        alignItems="center"
        bottom={h(10)}
        right={w(2)}
        zIndex={100}
        onPress={handleCreateHabit}
        height={vs(56)}
        width={vs(56)}
        backgroundColor={accentColor}
        borderRadius={styleUtils.borderRadius.lg}>
        <Plus size={24} color="#FFF" />
      </TouchableX>

      <ViewX variant="base" flex={1} paddingTop={12}>
        <TimeFilter
          selectedTime={selectedTime}
          onSelectTime={handleTimeFilterSelect}
        />

        <ViewX flex={1} padding={styleUtils.spacing.md}>
          <FlatList
            data={habitsForDate}
            renderItem={renderHabitItem}
            keyExtractor={(item: Habit) => item.id.toString()}
            contentContainerStyle={{paddingBottom: 120, paddingTop: 16}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                onCreateHabit={handleCreateHabit}
                accentColor={accentColor}
              />
            }
          />
        </ViewX>
      </ViewX>
    </ViewX>
  );
};

export default Home;
