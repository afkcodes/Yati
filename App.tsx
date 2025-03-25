/* eslint-disable react-native/no-inline-styles */
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, Scene} from 'navigation-react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '~hooks/ThemeContext';
import {baseNavigator} from '~navigation/navigator';

import * as React from 'react';
import BootSplash from 'react-native-bootsplash';
import {SystemBars} from 'react-native-edge-to-edge';
import BottomTabs from '~navigation/Tabs';
import WelcomeScreen from '~screens/Onboarding/Welcome';
import {getThemeColor} from '~styles/theme';
import {wait} from '~utils/common';
import {now, toUTCISO} from '~utils/date/dateUtils';
import {
  initializeNotifee,
  snoozeReminder,
} from '~utils/reminders/reminderUtils';
import {loadHabits, saveHabits} from '~utils/storage/storageUtils';

const App = () => {
  const bgColor = getThemeColor('dark', 'background', 'base');
  React.useEffect(() => {
    const init = async () => {
      // await loadHabits();
      await wait(100);
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  React.useEffect(() => {
    initializeNotifee(
      (habitId: string) => {
        const habits = loadHabits();
        const habitIndex = habits.findIndex(h => h.id === habitId);
        if (habitIndex === -1) {
          console.warn(`Habit ${habitId} not found in foreground event`);
          return;
        }

        const habit = {...habits[habitIndex]};
        const today = now().startOf('day');
        const dateStr = today.toFormat('yyyy-MM-dd');
        const currentProgress = habit.progress[dateStr] || {
          date: dateStr,
          isCompleted: false,
        };

        habit.progress = {
          ...habit.progress,
          [dateStr]: {
            ...currentProgress,
            isCompleted: true,
            completedAt: toUTCISO(now()),
          },
        };

        habits[habitIndex] = habit;
        saveHabits(habits);
        console.log(`Habit ${habitId} marked as completed in foreground`);
      },
      (habitId: string, reminderIndex: number, originalFireDate: string) => {
        const habits = loadHabits();
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          snoozeReminder(habitId, reminderIndex, originalFireDate, habit.title);
        }
      },
    );
  }, []);
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationHandler stateNavigator={baseNavigator}>
            <SystemBars style="light" />
            <NavigationStack
              backgroundColor={() => bgColor}
              crumbStyle={[
                {type: 'translate', startX: '-12%', duration: 300},
                {type: 'alpha', start: 50},
              ]}
              unmountStyle={[
                {type: 'translate', startX: '100%', duration: 300},
                {type: 'alpha', start: 100},
              ]}>
              <Scene stateKey="welcome">
                <WelcomeScreen />
              </Scene>
              <Scene stateKey="tabs">
                <BottomTabs />
              </Scene>
            </NavigationStack>
          </NavigationHandler>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
