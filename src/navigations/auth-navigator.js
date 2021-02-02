import { faCompass, faMugHot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import ExploreScreen from '../components/explore-component';
import HomeScreen from '../components/home-component';
import ProfileScreen from '../components/profile-component';
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

export default createBottomTabNavigator(
  {
    Home: HomeScreen,
    Explore: ExploreScreen,
    Profile: ProfileScreen,
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
