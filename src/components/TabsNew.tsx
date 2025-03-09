import {StateNavigator} from 'navigation';
import {NavigationContext, NavigationHandler} from 'navigation-react';
import {
  CoordinatorLayout,
  NavigationBar,
  NavigationStack,
  Scene,
  TabBar,
  TabBarItem,
} from 'navigation-react-native';
import {useContext, useMemo} from 'react';
import {Platform} from 'react-native';
import {HomeScreen, SettingsScreen} from './components';

const useStateNavigator = () => {
  const {stateNavigator} = useContext(NavigationContext);
  return useMemo(() => new StateNavigator(stateNavigator), [stateNavigator]);
};

export const TabsNew = () => {
  const homeNavigator = useStateNavigator();
  const notificationsNavigator = useStateNavigator();
  return (
    <CoordinatorLayout>
      <NavigationBar hidden={true} />
      <TabBar
        bottomTabs={true}
        primary={true}
        barTintColor={
          Platform.OS === 'android' ? '#121313' : 'rgb(247,247,247)'
        }
        selectedTintColor={Platform.OS === 'android' ? '#1da1f2' : ''}>
        <TabBarItem
          title="Home"
          image={require('../../assets/icons/navigation/home.png')}>
          <NavigationHandler stateNavigator={homeNavigator}>
            <NavigationStack>
              <Scene stateKey="home">
                <HomeScreen />
              </Scene>
              <Scene stateKey="settings">
                <SettingsScreen />
              </Scene>
            </NavigationStack>
          </NavigationHandler>
        </TabBarItem>
        <TabBarItem
          title="Notifications"
          image={require('../../assets/icons/navigation/settings.png')}>
          <NavigationHandler stateNavigator={notificationsNavigator}>
            <NavigationStack>
              <Scene stateKey="settings">
                <SettingsScreen />
              </Scene>
              <Scene stateKey="home">
                <HomeScreen />
              </Scene>
            </NavigationStack>
          </NavigationHandler>
        </TabBarItem>
      </TabBar>
    </CoordinatorLayout>
  );
};
