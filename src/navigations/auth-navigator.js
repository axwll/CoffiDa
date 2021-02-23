import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../screens/login-screen';
import SignupScreen from '../screens/signup-screen';
import WelcomeScreen from '../screens/welcome-screen';

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
