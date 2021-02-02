import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';

class SplashScreen extends Component {
  constructor() {
    console.log('SPLASH');
    super();
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  render() {
    return <Text styles={styles.text}>Splash Screen</Text>;
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    color: 'red',
  },
});

export default SplashScreen;
