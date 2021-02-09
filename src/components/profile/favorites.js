import React, {Component} from 'react';
import {Text, View} from 'react-native';

class Favorites extends Component {
  render() {
    return (
      <View>
        <Text> Favorites </Text>
        <Text> {this.props.favorites.length} </Text>
      </View>
    );
  }
}

export default Favorites;