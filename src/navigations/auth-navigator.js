import {faCompass, faMugHot, faUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import ExploreScreen from '../components/explore-component';
import HomeScreen from '../components/home-component';
import ProfileScreen from '../components/profile/profile-component';
import SelectedShopScreen from '../components/selected-shop-component';
import SettingsScreen from '../components/settings-component';

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
    Settings: SettingsScreen,
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'none',
  },
);

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    SelectedShop: SelectedShopScreen,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

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
