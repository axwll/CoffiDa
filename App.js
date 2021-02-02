import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AppNav from './src/navigations/app-navigator';
import AuthNav from './src/navigations/auth-navigator';
import SplashScreen from './src/navigations/splash-screen';

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: SplashScreen,
      App: AuthNav,
      Auth: AppNav,
    },
    {
      initialRouteName: 'Loading',
    },
  ),
);
