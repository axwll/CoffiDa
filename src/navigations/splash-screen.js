import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getItem } from '../components/common/async-storage-helper';

class SplashScreen extends Component {
  constructor() {
    super();
    this.checkToken();
  }

  checkToken = async () => {
    const authToken = await getItem('AUTH_TOKEN');

    this.props.navigation.navigate(authToken ? 'App' : 'Auth');
  };

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>CoffiDa</Text>
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
    backgroundColor: 'tomato',
  },
  text: {
    fontSize: 50,
    fontFamily: 'Pacifico-Regular',
    color: 'white',
  },
});

export default SplashScreen;
