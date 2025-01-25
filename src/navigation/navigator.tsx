import {StateNavigator} from 'navigation';
import Home from '~screens/Home/Home';
import Profile from '~screens/Profile/Profile';
import Settings from '~screens/Settings/Settings';
import {themes} from '~styles/theme';
import {Theme} from '~types/common.types';

const baseNavigator = new StateNavigator([
  {key: 'welcome'},
  {key: 'tabs', trackCrumbTrail: true},
]);

const getTabsConfig = (theme: Theme) => {
  return [
    {
      id: 'Home',
      title: 'Home',
      icon: require('../../assets/icons/navigation/home.png'),
      fontSize: 14,
      fontFamily: themes[theme].typography.fontFamily.semibold,
      navigatorState: 'homeNavigator',
      scenes: [{key: 'home', component: Home}],
    },
    {
      id: 'Profile',
      title: 'Profile',
      icon: require('../../assets/icons/navigation/profile.png'),
      fontSize: 14,
      fontFamily: themes[theme].typography.fontFamily.semibold,
      navigatorState: 'profileNavigator',
      scenes: [{key: 'profile', component: Profile}],
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: require('../../assets/icons/navigation/settings.png'),
      fontSize: 14,
      fontFamily: themes[theme].typography.fontFamily.semibold,
      navigatorState: 'settingsNavigator',
      scenes: [{key: 'settings', component: Settings}],
    },
  ];
};

export {baseNavigator, getTabsConfig};
