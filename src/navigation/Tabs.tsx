/* eslint-disable react-native/no-inline-styles */
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {
  CoordinatorLayout,
  NavigationBar,
  NavigationStack,
  Scene,
  TabBar,
  TabBarItem,
} from 'navigation-react-native';
import {useMemo, useRef} from 'react';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor, themes} from '../styles/theme';
import {getTabsConfig} from './navigator';

const BottomTabs = () => {
  const {theme} = useTheme();
  const homeNavigator = useMemo(() => {
    const nav = new StateNavigator([
      {key: 'home'},
      {key: 'create', trackCrumbTrail: true},
    ]);
    nav.navigate('home');
    return nav;
  }, []);

  const settingsNavigator = useMemo(() => {
    const nav = new StateNavigator([{key: 'settings', trackCrumbTrail: true}]);
    nav.navigate('settings');
    return nav;
  }, []);

  const profileNavigator = useMemo(() => {
    const nav = new StateNavigator([{key: 'profile', trackCrumbTrail: true}]);
    nav.navigate('profile');
    return nav;
  }, []);

  const navigatorRef = useRef({
    homeNavigator,
    settingsNavigator,
    profileNavigator,
  });

  const navColor = getThemeColor(theme, 'background', 'surface');
  const bgColor = getThemeColor('dark', 'background', 'base');

  return (
    <CoordinatorLayout>
      <NavigationBar hidden={true} />
      <TabBar
        primary={true}
        bottomTabs={true}
        labelVisibilityMode="labeled"
        selectedTintColor={themes[theme].text.accent}
        barTintColor={navColor}>
        {getTabsConfig(theme).map(tab => (
          <TabBarItem
            key={tab.id}
            title={tab.title}
            image={tab.icon}
            fontFamily={tab.fontFamily}
            fontWeight="600"
            fontSize={tab.fontSize}>
            <NavigationHandler
              stateNavigator={
                navigatorRef.current[
                  tab.navigatorState as keyof typeof navigatorRef.current
                ]
              }>
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
                {tab.scenes?.map(scene => (
                  <Scene key={scene.key} stateKey={scene.key}>
                    <scene.component />
                  </Scene>
                ))}
              </NavigationStack>
            </NavigationHandler>
          </TabBarItem>
        ))}
      </TabBar>
    </CoordinatorLayout>
  );
};

export default BottomTabs;

// import {StateNavigator} from 'navigation';
// import {NavigationHandler} from 'navigation-react';
// import {
//   CoordinatorLayout,
//   NavigationBar,
//   NavigationStack,
//   Scene,
//   TabBar,
//   TabBarItem,
// } from 'navigation-react-native';
// import {useMemo} from 'react';
// import {useTheme} from '~hooks/ThemeContext';
// import CreateHabitScreen from '~screens/create/CreateHabit';
// import Home from '~screens/Home/Home';
// import Profile from '~screens/Profile/Profile';
// import SettingsScreen from '~screens/Settings/Settings';
// import {getThemeColor, themes} from '../styles/theme';

// const BottomTabs = () => {
//   const {theme} = useTheme();

//   // const discoverNavigator = useMemo(() => {
//   //   const nav = new StateNavigator([{key: 'Discover', trackCrumbTrail: true}]);
//   //   return nav;
//   // }, []);

//   const settingsNavigator = useMemo(() => {
//     const nav = new StateNavigator([{key: 'settings', trackCrumbTrail: true}]);
//     nav.navigate('settings');
//     return nav;
//   }, []);

//   const profileNavigator = useMemo(() => {
//     const nav = new StateNavigator([{key: 'profile', trackCrumbTrail: true}]);
//     nav.navigate('profile');
//     return nav;
//   }, []);

//     const homeNavigator = useMemo(() => {
//       const nav = new StateNavigator([
//         {key: 'home'},
//         {key: 'create', trackCrumbTrail: true},
//       ]);
//       nav.navigate('home');
//       return nav;
//     }, []);

//   // const navigatorRef = useRef({
//   //   homeNavigator,
//   //   discoverNavigator,
//   //   settingsNavigator,
//   //   profileNavigator,
//   // });

//   const navColor = getThemeColor(theme, 'background', 'surface');
//   // const bgColor = getThemeColor('dark', 'background', 'base');

//   return (
//     <CoordinatorLayout>
//       <NavigationBar hidden={true} />
//       <TabBar
//         primary={true}
//         bottomTabs={true}
//         labelVisibilityMode="labeled"
//         selectedTintColor={themes[theme].text.accent}
//         barTintColor={navColor}>
//         <TabBarItem image={require('../../assets/icons/navigation/home.png')}>
//           <NavigationHandler stateNavigator={homeNavigator}>
//             <NavigationStack>
//               <Scene stateKey="home">
//                 <Home />
//               </Scene>
//               <Scene stateKey="create">
//                 <CreateHabitScreen />
//               </Scene>
//             </NavigationStack>
//           </NavigationHandler>
//         </TabBarItem>
//         <TabBarItem
//           image={require('../../assets/icons/navigation/profile.png')}>
//           <NavigationHandler stateNavigator={profileNavigator}>
//             <NavigationStack>
//               <Scene stateKey="profile">
//                 <Profile />
//               </Scene>
//               <Scene stateKey="create">
//                 <CreateHabitScreen />
//               </Scene>
//             </NavigationStack>
//           </NavigationHandler>
//         </TabBarItem>

//         <TabBarItem
//           image={require('../../assets/icons/navigation/settings.png')}>
//           <NavigationHandler stateNavigator={settingsNavigator}>
//             <NavigationStack>
//               <Scene stateKey="settings">
//                 <SettingsScreen />
//               </Scene>
//             </NavigationStack>
//           </NavigationHandler>
//         </TabBarItem>
//       </TabBar>
//     </CoordinatorLayout>
//   );
// };

// export default BottomTabs;
