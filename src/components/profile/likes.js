import React, {Component} from 'react';
import {Text, View} from 'react-native';

class Likes extends Component {
  render() {
    return (
      <View>
        <Text> Likes </Text>
        <Text> {this.props.likes.length} </Text>
      </View>
    );
  }
}

export default Likes;