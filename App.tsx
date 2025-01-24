/* eslint-disable react-native/no-inline-styles */
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, Scene} from 'navigation-react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '~hooks/ThemeContext';
import WelcomeScreen from '~screens/Onboarding/Welcome';

import {TabBar, TabBarItem} from 'navigation-react-native';
import Home from '~screens/Home/Home';
import Profile from '~screens/Profile/Profile';

const contactsNavigator = new StateNavigator([
  {key: 'home'},
  {key: 'profile', trackCrumbTrail: true},
]);

const Tabs = () => (
  <TabBar primary={true} barTintColor="#131313">
    <TabBarItem title="home">
      <NavigationHandler stateNavigator={contactsNavigator}>
        <NavigationStack>
          <Scene stateKey="home">
            <Home />
          </Scene>
          <Scene stateKey="contact">
            <Profile />
          </Scene>
        </NavigationStack>
      </NavigationHandler>
    </TabBarItem>
    <TabBarItem title="profile">
      <Profile />
    </TabBarItem>
  </TabBar>
);

const stateNavigator = new StateNavigator([
  {key: 'welcome'},
  {key: 'tabs', trackCrumbTrail: true},
]);

const App = () => {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <SafeAreaProvider>
          <NavigationHandler stateNavigator={stateNavigator}>
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
                <Tabs />
              </Scene>
            </NavigationStack>
          </NavigationHandler>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
