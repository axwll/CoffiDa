import { Text, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';

import React } from 'react';

const colorSchemes = {
  light: {
    background: '#FFFFFF',
    primary: '#512DA8',
    text: '#121212',
    error: '#D33F2F',
  },
  dark: {
    background: '#121212',
    primary: '#B39DDB',
    text: '#FFFFFF',
    error: '#EF9A9A',
  },
};

const Screen = () => {
  const colorScheme = useColorScheme(); // uses system color scheme
  const colors = colorSchemes[colorScheme] || colorSchemes.light;

  return (
    <View>
      <Text style={{backgroundColor: colors.background}}>Hello, hi</Text>
    </View>
  );
};
