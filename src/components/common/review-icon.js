import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Stars from 'react-native-stars';

import Empty from '../../assets/ratings/rating-empty-light.png';
import PrimaryEmpty from '../../assets/ratings/rating-empty-primary.png';
import Full from '../../assets/ratings/rating-full-light.png';
import PrimaryFull from '../../assets/ratings/rating-full-primary.png';
import Half from '../../assets/ratings/rating-half-light.png';
import PrimaryHalf from '../../assets/ratings/rating-half-primary.png';

class ReviewIcon extends Component {
  render() {
    return (
      <View style={styles.review_section}>
        <View
          style={[
            styles.review_rating,
            {
              transform: this.props.rotate
                ? [{rotate: '270deg'}]
                : [{rotate: '180deg'}],
            },
          ]}>
          <Stars
            display={this.props.rating}
            spacing={this.props.spacing ? this.props.spacing : 8}
            count={5}
            starSize={this.props.size ? this.props.size : 20}
            fullStar={this.props.primary ? PrimaryFull : Full}
            halfStar={this.props.primary ? PrimaryHalf : Half}
            emptyStar={this.props.primary ? PrimaryEmpty : Empty}
          />
        </View>
        {this.props.name && (
          <View style={styles.review_description}>
            <Text>{this.props.name}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  color: {
    color: 'yellow',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  review_section: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  review_rating: {
    justifyContent: 'center',
    flex: 1,
  },
  review_description: {
    alignItems: 'center',
  },
});

export default ReviewIcon;
