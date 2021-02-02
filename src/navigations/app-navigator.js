import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../components/login-component';
import SignupScreen from '../components/signup-component';
import WelcomeScreen from '../components/welcome-component';

export default createStackNavigator(
  {
    Welcome: WelcomeScreen,
    Login: LoginScreen,
    Signup: SignupScreen,
  },
  {
    initialRouteName: 'Welcome',
    headerMode: 'none',
  },
);
