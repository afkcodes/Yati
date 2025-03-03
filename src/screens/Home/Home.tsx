/* eslint-disable react-native/no-inline-styles */
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
import {getThemeColor, styleUtils} from '~styles/theme';
import {h, vs, w} from '~utils/screenUtil';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startDate = new Date(2025, 0, 1); // Jan 1, 2024
  const endDate = new Date(2025, 1, 8); // Dec 31, 2024
  const {stateNavigator} = useContext(NavigationContext);
  const {theme} = useTheme();

  const [selectedTime, setSelectedTime] = useState<any>('all');
  const [habits, _setHabits] = useState(habitData);

  const filteredHabits = habits.filter(
    habit => selectedTime === 'all' || habit.timePeriod === selectedTime,
  );

  const backgroundColor = getThemeColor(theme, 'background', 'primary');
  const navBackgroundColor = getThemeColor(theme, 'background', 'primary');
  const accentColor = getThemeColor(theme, 'background', 'accent');

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
          {filteredHabits.map(habit => (
            <HabitCard
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
