import React, {Component} from 'react';
import {Text, View} from 'react-native';

class Reviews extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Text> Reviews </Text>
        <Text> {this.props.reviews.length} </Text>
      </View>
    );
  }
}

export default Reviews;
