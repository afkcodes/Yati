/* eslint-disable react-native/no-inline-styles */
import {format, isValid, startOfDay} from 'date-fns';
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
import {
  getHabitStoreSnapshot,
  habitActions,
  isHabitCompleted,
  useHabitStore,
} from '~state/habit.store';
import {streakActions} from '~state/streak.store';
import {getThemeColor, styleUtils, withAlpha} from '~styles/theme';
import {Habit, TimePeriod} from '~types/habit.types';
import {h, vs, w} from '~utils/screenUtil';

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

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Home = () => {
  const {stateNavigator} = useContext(NavigationContext);
  const {theme} = useTheme();
  const [{habits: allHabits, selectedDate: storedDate}] = useHabitStore();

  const validStoredDate = useMemo(() => {
    return storedDate && isValid(storedDate)
      ? startOfDay(storedDate)
      : startOfDay(new Date());
  }, [storedDate]);

  const [selectedDate, setSelectedDate] = useState(validStoredDate);
  const [selectedTime, setSelectedTime] = useState<TimePeriod | 'all'>('all');
  const [habitsForDate, setHabitsForDate] = useState<Habit[]>([]);

  const backgroundColor = getThemeColor(theme, 'background', 'primary');
  const navBackgroundColor = getThemeColor(theme, 'background', 'surface');
  const accentColor = getThemeColor(theme, 'background', 'accent');

  useEffect(() => {
    if (selectedDate && isValid(selectedDate)) {
      habitActions.setSelectedDate(startOfDay(selectedDate));
    }
  }, [selectedDate]);

  useEffect(() => {
    const updateHabits = debounce(() => {
      if (selectedDate && isValid(selectedDate)) {
        const normalizedDate = startOfDay(selectedDate);
        const filtered = [
          ...habitActions.getHabitsForDate(normalizedDate, selectedTime),
        ];
        setHabitsForDate(filtered);
      } else {
        setHabitsForDate([]);
      }
    }, 100);

    updateHabits();
  }, [allHabits, selectedDate, selectedTime]);

  const isCompleted = useCallback(
    (habit: Habit): boolean => {
      if (!selectedDate || !isValid(selectedDate)) {
        return false;
      }
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const progress = habit.progress?.[dateStr];
      return progress ? isHabitCompleted(habit, progress) : false;
    },
    [selectedDate],
  );

  const handleToggleHabit = useCallback(
    (habit: Habit) => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      if (!selectedDate || !isValid(selectedDate)) {
        return;
      }

      // Handle different evaluation types
      switch (habit.evaluation.type) {
        case 'boolean':
          // Toggle boolean habit completion
          habitActions.toggleHabitCompletion(habit.id, selectedDate);
          break;
        case 'numeric':
        case 'timer':
        case 'checklist':
          // These types need more interaction, so navigate to details
          stateNavigator?.navigate('habitDetail', {id: habit.id});
          return; // Exit early since we're navigating away
        default:
          // Fallback to toggle completion for any other types
          habitActions.toggleHabitCompletion(habit.id, selectedDate);
      }

      // After toggling, get the updated habit with its new completion status
      const updatedHabit = getHabitStoreSnapshot().habits.find(
        _h => _h.id === habit.id,
      );

      if (updatedHabit) {
        // Get the current completion status after the toggle
        const currentlyCompleted =
          updatedHabit.progress[dateStr]?.isCompleted || false;

        // Update streak with the current (post-toggle) status
        streakActions.updateStreakAfterCompletion(
          updatedHabit,
          dateStr,
          currentlyCompleted,
        );
      }
    },
    [selectedDate, stateNavigator],
  );

  const handleCreateHabit = useCallback(() => {
    stateNavigator?.navigate('create');
  }, [stateNavigator]);

  const handleDateSelect = useCallback((date: Date) => {
    if (date && isValid(date)) {
      setSelectedDate(startOfDay(date));
    }
  }, []);

  const renderHabitItem = useCallback(
    ({item}: {item: Habit}) => (
      <HabitCard
        key={item.id}
        title={item.title}
        frequency={
          item.frequency.type === 'daily' ? 'Every day' : item.frequency.type
        }
        color={item.color}
        isCompleted={isCompleted(item)}
        streak={item.streak}
        onToggleComplete={() => handleToggleHabit(item)}
      />
    ),
    [isCompleted, handleToggleHabit],
  );

  console.log(habitsForDate);

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
          selectedDate={selectedDate}
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
          onSelectTime={setSelectedTime}
        />

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
  );
};

export default Home;
