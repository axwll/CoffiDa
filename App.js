import React, {Component} from 'react';
import * as RNLocalize from 'react-native-localize';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import {setI18nConfig} from './src/locales';
import AppNav from './src/navigations/app-navigator';
import AuthNav from './src/navigations/auth-navigator';
import SplashScreen from './src/screens/splash-screen';

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Loading: SplashScreen,
      App: AppNav,
      Auth: AuthNav,
    },
    {
      initialRouteName: 'Loading',
    },
  ),
);

class App extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  };

  render() {
    return <AppContainer />;
  }
}

export default App;
