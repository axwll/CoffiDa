import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Component } from 'react';
import { Animated, Easing, View } from 'react-native';

import ThemeProvider from '../utils/theme-provider';

class LoadingSpinner extends Component {
  spinValue = new Animated.Value(0);

  componentDidMount() {
    this.spin();
  }

  spin = () => {
    this.spinValue.setValue(0);

    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 3500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => this.spin());
  };

  render() {
    const { size } = this.props;
    const rotate = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const themeStyles = ThemeProvider.getTheme();

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <FontAwesomeIcon
            icon={faCog}
            size={size}
            style={themeStyles.color_medium}
          />
        </Animated.View>
      </View>
    );
  }
}

export default LoadingSpinner;
