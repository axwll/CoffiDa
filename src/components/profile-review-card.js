import { CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { translate } from '../locales';
import ReviewIcon from './review-icon';

class ProfileReviewCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <CardItem style={styles.first_item}>
          <Left style={styles.card_left}>
            <Text style={styles.loc_name}>{this.props.title}</Text>

            {this.props.subHeading && (
              <Text style={styles.light_text}>{this.props.subHeading}</Text>
            )}
          </Left>

          <Right>
            <ReviewIcon
              rating={this.props.overall_rate}
              size={15}
              spacing={5}
            />
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <Text>{this.props.body}</Text>
          </Left>

          <Right>
            <Text style={styles.light_text}>
              {translate('price')}: {this.props.price_rate}/5
            </Text>
            <Text style={styles.light_text}>
              {translate('cleanliness')}: {this.props.clean_rate}/5
            </Text>
            <Text style={styles.light_text}>
              {translate('quality')}: {this.props.qual_rate}/5
            </Text>
          </Right>
        </CardItem>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  first_item: {
    paddingBottom: 0,
    marginBottom: 0,
  },
  card_left: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  loc_name: {
    color: '#F06543',
    fontWeight: 'bold',
  },
  light_text: {
    color: '#313638',
  },
});

export default ProfileReviewCard;
