import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Stars from 'react-native-stars';

import Empty from '../assets/ratings/rating-empty-light.png';
import PrimaryEmpty from '../assets/ratings/rating-empty-primary.png';
import Full from '../assets/ratings/rating-full-light.png';
import PrimaryFull from '../assets/ratings/rating-full-primary.png';
import Half from '../assets/ratings/rating-half-light.png';
import PrimaryHalf from '../assets/ratings/rating-half-primary.png';

/**
 * This uses the 'Stars' library to show ratings.
 * It renders custom immages found in 'assets/ratings` to display ratings.
 * The component accepts props that tell it how to customise the icons, such as:
 * 'rotate'  => direction to rotate the icon
 * 'spacing' => spacing between each individual icon
 * 'primary' => whether to render the icons in the primary colour
 */
class ReviewIcon extends Component {
  render() {
    return (
      <View style={styles.review_section}>
        <View
          style={[
            styles.review_rating,
            {
              transform: this.props.rotate
                ? [{ rotate: '270deg' }]
                : [{ rotate: '0deg' }],
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
