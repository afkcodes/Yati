/* eslint-disable react-native/no-inline-styles */
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, Scene} from 'navigation-react-native';
import WelcomeScreen from '~screens/Onboarding/Welcome';

import {ThemeProvider} from '~hooks/ThemeContext';
import BottomTabs from '~navigation/Tabs';
import {baseNavigator} from '~navigation/navigator';

const App = () => {
  return (
    <ThemeProvider>
      <NavigationHandler stateNavigator={baseNavigator}>
        <NavigationStack
          crumbStyle={[
            {type: 'translate', startX: '-10%', duration: 200},
            {type: 'alpha', start: 50},
          ]}
          unmountStyle={[
            {type: 'translate', startX: '100%', duration: 200},
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
  );
};

export default App;
