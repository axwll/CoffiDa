import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {getItem} from '../components/common/async-storage-helper';

class SplashScreen extends Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const authToken = await getItem('AUTH_TOKEN');

    this.props.navigation.navigate(authToken ? 'App' : 'Auth');
  };

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>Splash Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    color: 'tomato',
  },
});

export default SplashScreen;
