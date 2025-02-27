import {Plus} from 'lucide-react-native';
import {NavigationContext} from 'navigation-react';
import {useContext, useState} from 'react';
import {ScrollView} from 'react-native';
import {TouchableX, ViewX} from '~components/common';
import {CalendarStrip} from '~components/common/CalenderStrip';
import GreetingHeader from '~components/specific/home/Greeting';
import HabitCard from '~components/specific/home/Habit';
import TimeFilter from '~components/specific/home/TimFilter';
import {habitData} from '~data/habits';
import {useTheme} from '~hooks/ThemeContext';
import {styleUtils} from '~styles/theme';
import {getThemeColor} from '~styles/themeUtils';
import {h, w} from '~utils/screenUtil';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startDate = new Date(2025, 0, 1); // Jan 1, 2024
  const endDate = new Date(2025, 1, 8); // Dec 31, 2024
  const {stateNavigator} = useContext(NavigationContext);
  const {theme} = useTheme();

  const [selectedTime, setSelectedTime] = useState<any>('all');
  const [habits, setHabits] = useState(habitData);

  const filteredHabits = habits.filter(
    habit => selectedTime === 'all' || habit.timePeriod === selectedTime,
  );

  const backgroundColor = getThemeColor(theme, 'background', 'primary');
  const navBackgroundColor = getThemeColor(theme, 'background', 'primary');
  const accentColor = getThemeColor(theme, 'background', 'accent');

  return (
    <ViewX variant="nav" flex={1} backgroundColor={backgroundColor}>
      <GreetingHeader
        username="Ashish"
        avatar="https://scontent.fblr20-3.fna.fbcdn.net/v/t39.30808-6/465060097_27423369417308920_7431623941390111522_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4Eg-13Pt4rIQ7kNvgFXRQe6&_nc_zt=23&_nc_ht=scontent.fblr20-3.fna&_nc_gid=AHN09A_YGpMOyzUiUEtmbUZ&oh=00_AYApkwAunJronsyYoln5bKE1Hvc-pG33DlD3nUAq4JF61A&oe=67A28901"
        streakCount={5}
        hasUnreadNotifications={true}
        onPressNotification={() => {
          // Show notifications screen/modal
        }}
        onPressStreak={() => {
          // Show streak details/achievements
        }}
      />
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
            onDateSelect={setSelectedDate}
            startDate={startDate}
            endDate={endDate}
          />
        </ViewX>
      </ViewX>
      <TouchableX
        position="absolute"
        justifyContent="center"
        alignItems="center"
        bottom={h(10)}
        right={w(2)}
        zIndex={100}
        onPress={() => {
          stateNavigator.navigate('create');
        }}
        height={56}
        width={56}
        backgroundColor={accentColor}
        borderRadius={styleUtils.borderRadius.lg}>
        <Plus size={24} color="#FFF" />
      </TouchableX>

      <ViewX flex={1} paddingTop={12}>
        <ViewX paddingTop={12}>
          <TimeFilter
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
        </ViewX>
        <ScrollView
          style={{flex: 1, marginTop: 12}}
          contentContainerStyle={{paddingBottom: 120, paddingTop: 16}}>
          {filteredHabits.map(habit => (
            <HabitCard
              period={habit.timePeriod}
              isCompleted={false}
              key={habit.id}
              {...habit}
              onToggleComplete={() => {}}
            />
          ))}
        </ScrollView>
      </ViewX>
    </ViewX>
  );
};

export default Home;
