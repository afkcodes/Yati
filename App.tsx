/* eslint-disable react-native/no-inline-styles */
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, Scene} from 'navigation-react-native';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AnimatedModal from '~components/common/Modal';
import {ThemeProvider} from '~hooks/ThemeContext';
import BottomTabs from '~navigation/Tabs';
import {baseNavigator} from '~navigation/navigator';
import WelcomeScreen from '~screens/Onboarding/Welcome';

const App = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationHandler stateNavigator={baseNavigator}>
            <BottomSheetModalProvider>
              <NavigationStack
                crumbStyle={[
                  {type: 'translate', startX: '-10%', duration: 300},
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
              <AnimatedModal />
            </BottomSheetModalProvider>
          </NavigationHandler>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
