/* eslint-disable react-native/no-inline-styles */
import {format, isValid, startOfDay} from 'date-fns';
import {Plus} from 'lucide-react-native';
import {NavigationContext} from 'navigation-react';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Alert, ScrollView} from 'react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import CalendarStrip from '~components/common/CalenderStrip';
import GreetingHeader from '~components/specific/home/Greeting';
import HabitCard from '~components/specific/home/Habit';
import TimeFilter from '~components/specific/home/TimeFilter';
import {useTheme} from '~hooks/ThemeContext';
import {
  habitActions,
  isHabitCompleted,
  useHabitStore,
} from '~state/habit.store';
import {getThemeColor, styleUtils, withAlpha} from '~styles/theme';
import {Habit, TimePeriod} from '~types/habit.types';
import {h, vs, w} from '~utils/screenUtil';

const Home = () => {
  const {stateNavigator} = useContext(NavigationContext);
  const {theme} = useTheme();

  const [{habits: allHabits, selectedDate: storedDate}] = useHabitStore();

  // Ensure we always have a valid date
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

  // Update stored date when selection changes
  useEffect(() => {
    if (selectedDate && isValid(selectedDate)) {
      habitActions.setSelectedDate(startOfDay(selectedDate));
    }
  }, [selectedDate]);

  // Refresh habits list when dependencies change
  useEffect(() => {
    if (selectedDate && isValid(selectedDate)) {
      console.log(`Loading habits for: ${format(selectedDate, 'yyyy-MM-dd')}`);
      const normalizedDate = startOfDay(selectedDate);
      const filtered = habitActions.getHabitsForDate(
        normalizedDate,
        selectedTime,
      );
      console.log(
        `Found ${filtered.length} habits for selected date and time filter`,
      );
      setHabitsForDate(filtered);
    }
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

  const handleToggleHabit = (habit: Habit) => {
    if (!selectedDate || !isValid(selectedDate)) {
      return;
    }

    switch (habit.evaluation.type) {
      case 'boolean':
        habitActions.toggleHabitCompletion(habit.id, selectedDate);
        break;

      case 'numeric':
      case 'timer':
      case 'checklist':
        if (stateNavigator) {
          stateNavigator.navigate('habitDetail', {id: habit.id});
        }
        break;

      default:
        habitActions.toggleHabitCompletion(habit.id, selectedDate);
    }
  };

  const handleCreateHabit = () => {
    if (stateNavigator) {
      stateNavigator.navigate('create');
    } else {
      console.error('Navigation not available');
    }
  };

  const handleDateSelect = (date: Date) => {
    if (date && isValid(date)) {
      console.log(`Selected date: ${format(date, 'yyyy-MM-dd')}`);
      setSelectedDate(startOfDay(date));
    }
  };

  return (
    <ViewX variant="base" flex={1} backgroundColor={backgroundColor}>
      <GreetingHeader
        username="Ashish"
        avatar="https://scontent.fblr20-4.fna.fbcdn.net/v/t39.30808-6/405331272_24313753894937170_7956735316394196740_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=z8ZuBDudHt0Q7kNvgEXyu0U&_nc_oc=Adi2jpdaXW2Gb2wjvw4k0uvvUzu28uN9lMhEOR-nKKUEQb4BO9DAtebGtrWHPgYm4sKuEfr5SBdy4t6yWThPhazL&_nc_zt=23&_nc_ht=scontent.fblr20-4.fna&_nc_gid=ATSIm0AytsYwRGtOSsVhiGw&oh=00_AYCH23sAu5ygCPNPHOf0OAdwvDF1mci3heJWRaeuhTNbzw&oe=67CB1889"
        streakCount={5}
        hasUnreadNotifications={true}
        onPressNotification={() => {
          // Show notifications screen/modal
        }}
        onPressStreak={() => {
          // Show streak details
          Alert.alert(
            'Streak Info',
            'You have a 5-day streak going. Keep it up!',
          );
        }}
      />

      {/* Calendar strip at bottom */}
      <ViewX
        backgroundColor={navBackgroundColor}
        width={w(100)}
        position="absolute"
        bottom={0}
        zIndex={100}
        paddingVertical={styleUtils.spacing['2xs']}>
        <ViewX
          overflow="hidden"
          justifyContent="center"
          alignItems="flex-start">
          <CalendarStrip
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            daysToShow={30}
          />
        </ViewX>
      </ViewX>

      {/* Create habit button */}
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
        <ViewX paddingTop={12}>
          <TimeFilter
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
        </ViewX>

        <ScrollView
          style={{flex: 1, marginTop: 12}}
          contentContainerStyle={{paddingBottom: 120, paddingTop: 16}}>
          {habitsForDate.length > 0 ? (
            habitsForDate.map(habit => (
              <HabitCard
                key={habit.id}
                title={habit.title}
                frequency={
                  habit.frequency.type === 'daily'
                    ? 'Every day'
                    : habit.frequency.type
                }
                color={habit.color}
                isCompleted={isCompleted(habit)}
                streak={habit.streak}
                onToggleComplete={() => handleToggleHabit(habit)}
              />
            ))
          ) : (
            <ViewX
              flex={1}
              justifyContent="center"
              alignItems="center"
              paddingTop={vs(60)}>
              <TouchableX
                onPress={handleCreateHabit}
                padding={styleUtils.spacing.md}
                borderRadius={styleUtils.borderRadius.md}
                backgroundColor={withAlpha(accentColor, 0.1)}>
                <TextX color="accent" fontSize="md" textAlign="center">
                  No habits for this day.{'\n'}Create a new habit to get
                  started!
                </TextX>
              </TouchableX>
            </ViewX>
          )}
        </ScrollView>
      </ViewX>
    </ViewX>
  );
};

export default Home;
