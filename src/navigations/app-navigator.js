import { faCompass, faMugHot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import AddReviewScreen from '../screens/add-review-screen';
import EditAccountScreen from '../screens/edit-account-screen';
import ExploreScreen from '../screens/explore-screen';
import HomeScreen from '../screens/home-screen';
import PhotoDecisionScreen from '../screens/photo-decision-screen';
import ProfileScreen from '../screens/profile/profile-screen';
import SelectedShopScreen from '../screens/selected-shop-screen';
import SettingsScreen from '../screens/settings-screen';
import TakePhotoScreen from '../screens/take-photo-screen';
import UpdateReviewScreen from '../screens/update-review-screen';

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
HomeStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == 'TakePhoto') {
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
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
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
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'grey',
    },
  },
);
