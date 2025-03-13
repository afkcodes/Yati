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

const App = () => {
  const bgColor = getThemeColor('dark', 'background', 'base');
  React.useEffect(() => {
    const init = async () => {
      // await habitActions.preloadData();
      await wait(100);
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
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
