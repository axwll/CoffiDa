import React, { Component } from 'react';
import { View } from 'react-native';

import TopBar from './common/top-bar';

class Home extends Component {
  render() {
    return (
      <View>
        <TopBar />
        {/* <Text>Home</Text> */}
      </View>
    );
  }
}

export default Home;
