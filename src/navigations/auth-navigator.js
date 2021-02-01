import { faCompass, faMugHot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import ExploreScreen from '../components/explore-component';
import ProfileScreen from '../components/profile-component';
import HomeScreen from '../components/settings-component';

const styles = StyleSheet.create({
  icon: {
    fontSize: 12,
  },
});

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

        // You can return any component that you like here!
        return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'grey',
    },
  },
);
