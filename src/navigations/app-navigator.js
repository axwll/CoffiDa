import { faCompass, faMugHot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { translate } from '../locales';
import AddReviewScreen from '../screens/add-review-screen';
import EditAccountScreen from '../screens/edit-account-screen';
import ExploreScreen from '../screens/explore-screen';
import HomeScreen from '../screens/home-screen';
import PhotoDecisionScreen from '../screens/photo-decision-screen';
import ProfileScreen from '../screens/profile-screen';
import SelectedShopScreen from '../screens/selected-shop-screen';
import SettingsScreen from '../screens/settings-screen';
import TakePhotoScreen from '../screens/take-photo-screen';
import UpdateReviewScreen from '../screens/update-review-screen';
import ThemeProvider from '../utils/theme-provider';

const themeStyles = ThemeProvider.getTheme();

/**
 * The Profile stack has a nested Settings stack navigator
 */
const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    EditAccount: EditAccountScreen,
  },
  {
    initialRouteName: 'Settings',
    headerMode: 'none',
  },
);

/**
 * The Profile screen tab is set up as a stack navigator
 */
const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
    Settings: SettingsStack,
    UpdateReview: UpdateReviewScreen,
    UpdateDeletePhoto: PhotoDecisionScreen,
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'none',
  },
);

/**
 * The home screen tab is set up as a stack navigator
 */
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    SelectedShop: SelectedShopScreen,
    AddReview: AddReviewScreen,
    AddPhoto: PhotoDecisionScreen,
    TakePhoto: TakePhotoScreen,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

/**
 * Hides the TabBar from the 'TakePhoto' Screen
 */
HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  const { routeName } = navigation.state.routes[navigation.state.index];

  if (routeName === 'TakePhoto') {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

/**
 * Creates the bottom Tab navigator for the App
 * and decides which icon should be used
 */
export default createBottomTabNavigator(
  {
    Home: HomeStack,
    Explore: ExploreScreen,
    Profile: ProfileStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = faMugHot;
        } else if (routeName === 'Explore') {
          iconName = faCompass;
        } else if (routeName === 'Profile') {
          iconName = faUser;
        }

        return <FontAwesomeIcon icon={iconName} color={tintColor} size={20} />;
      },
      tabBarLabel: () => {
        const { routeName } = navigation.state;
        let tabName;
        if (routeName === 'Explore') {
          tabName = translate('explore');
        } else if (routeName === 'Profile') {
          tabName = translate('profile');
        } else {
          tabName = translate('home');
        }

        return (
          <Text style={[{ textAlign: 'center' }, themeStyles.color_dark]}>
            {tabName}
          </Text>
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: themeStyles.color_primary.color,
      inactiveTintColor: themeStyles.color_medium.color,
    },
  },
);
