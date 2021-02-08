import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { translate } from '../locales';

class Explore extends Component {
  render() {
    return (
      <View>
        <Text>{translate('explore')}</Text>
      </View>
    );
  }
}

export default Explore;
