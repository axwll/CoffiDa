import 'react-native-gesture-handler';

import { faCompass, faMugHot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import Explore from './explore-component';
import Home from './home-component';
import Profile from './profile-component';

class Nav extends Component {
  render() {
    const Tab = createBottomTabNavigator();

    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = faMugHot;
              } else if (route.name === 'Explore') {
                iconName = faCompass;
              } else if (route.name === 'Profile') {
                iconName = faUser;
              }

              return (
                <FontAwesomeIcon icon={iconName} size={size} color={color} />
              );
            },
          })}
          tabBarOptions={{
            activeTintColor: '#F06543',
            inactiveTintColor: 'grey',
            labelStyle: styles.icon,
          }}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Explore" component={Explore} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 12,
  },
});

export default Nav;
