import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {getItem} from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';

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
    const themeStyles = ThemeProvider.getTheme();
    return (
      <View style={[styles.view, themeStyles.primary_background_color]}>
        <Text style={[styles.text, themeStyles.color_light]}>CoffiDa</Text>
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
    fontSize: 50,
    fontFamily: 'Pacifico-Regular',
  },
});

export default SplashScreen;
