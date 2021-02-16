import { faCompass, faMugHot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import AddReviewScreen from '../components/add-review-component';
import ExploreScreen from '../components/explore-component';
import HomeScreen from '../components/home-component';
import PhotoDecisionScreen from '../components/photo-decision-component';
import ProfileScreen from '../components/profile/profile-component';
import EditProfileScreen from '../components/profile/settings/edit-profile';
import SettingsScreen from '../components/profile/settings/settings-component';
import SelectedShopScreen from '../components/selected-shop-component';
import TakePhotoScreen from '../components/take-photo-component';
import UpdateReviewScreen from '../components/update-review-component';

/**
 * The Profile stack has a nested Settings stack navigator
 */
const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    EditAccount: EditProfileScreen,
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
