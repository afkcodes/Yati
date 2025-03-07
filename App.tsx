/* eslint-disable react-native/no-inline-styles */
import {NavigationHandler} from 'navigation-react';
import {NavigationStack, Scene} from 'navigation-react-native';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AnimatedModal from '~components/common/Modal';
import {ThemeProvider} from '~hooks/ThemeContext';
import {baseNavigator} from '~navigation/navigator';

import {StateNavigator} from 'navigation';
import * as React from 'react';
import BootSplash from 'react-native-bootsplash';
import TabView, {SceneMap} from 'react-native-bottom-tabs';
import CreateHabitScreen from '~screens/create/CreateHabit';
import Home from '~screens/Home/Home';
import SettingsScreen from '~screens/Settings/Settings';
import {getThemeColor} from '~styles/theme';
import {typography} from '~styles/tokens';
import {wait} from '~utils/common';

const homeNavigator = new StateNavigator([
  {key: 'home'},
  {key: 'create', trackCrumbTrail: true},
]);

const HomeStack = () => {
  const bgColor = getThemeColor('dark', 'background', 'base');

  return (
    <NavigationHandler stateNavigator={homeNavigator}>
      <NavigationStack
        backgroundColor={() => bgColor}
        crumbStyle={[
          {type: 'translate', startX: '-10%', duration: 300},
          {type: 'alpha', start: 50},
        ]}
        unmountStyle={[
          {type: 'translate', startX: '100%', duration: 300},
          {type: 'alpha', start: 100},
        ]}>
        <Scene stateKey="home">
          <Home />
        </Scene>
        <Scene stateKey="create">
          <CreateHabitScreen />
        </Scene>
      </NavigationStack>
    </NavigationHandler>
  );
};

const renderScene = SceneMap({
  home: HomeStack,
  settings: SettingsScreen,
});

const TabViewExample = () => {
  const [index, setIndex] = React.useState(0);
  const bgColor = getThemeColor('dark', 'background', 'surface');
  const accent = getThemeColor('dark', 'background', 'accent');

  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: require('./assets/icons/navigation/home.png'),
      unfocusedIcon: require('./assets/icons/navigation/home.png'),
    },
    {
      key: 'settings',
      title: 'Settings',
      focusedIcon: require('./assets/icons/navigation/settings.png'),
      unfocusedIcon: require('./assets/icons/navigation/settings.png'),
    },
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={tabIndex => {
        console.log(tabIndex);
        setIndex(tabIndex);
      }}
      labeled
      tabLabelStyle={{
        fontFamily: typography.fontFamily.medium,
      }}
      tabBarStyle={{backgroundColor: bgColor}}
      tabBarActiveTintColor={accent}
    />
  );
};

const App = () => {
  const bgColor = getThemeColor('dark', 'background', 'base');
  React.useEffect(() => {
    const init = async () => {
      wait(150);
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
            <BottomSheetModalProvider>
              <NavigationStack
                backgroundColor={() => bgColor}
                crumbStyle={[
                  {type: 'translate', startX: '-10%', duration: 300},
                  {type: 'alpha', start: 50},
                ]}
                unmountStyle={[
                  {type: 'translate', startX: '100%', duration: 300},
                  {type: 'alpha', start: 100},
                ]}>
                <Scene stateKey="welcome">
                  {/* <WelcomeScreen /> */}.
                  <TabViewExample />
                </Scene>
                <Scene stateKey="tabs">
                  <TabViewExample />
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
