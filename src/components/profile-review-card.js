import { CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { translate } from '../locales';
import ThemeProvider from '../utils/theme-provider';
import ReviewIcon from './review-icon';

/**
 * This Component renders part of a card that is similar
 * in a couple of places on the Profile screen
 */
class ProfileReviewCard extends Component {
  render() {
    const themeStyles = ThemeProvider.getTheme();

    return (
      <View>
        <CardItem style={styles.first_item}>
          <Left style={styles.card_left}>
            <Text style={[styles.loc_name, themeStyles.color_primary]}>
              {this.props.title}
            </Text>

            {this.props.subHeading && (
              <Text style={themeStyles.color_dark}>
                {this.props.subHeading}
              </Text>
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
            <Text style={themeStyles.color_dark}>
              {translate('price')}: {this.props.price_rate}/5
            </Text>
            <Text style={themeStyles.color_dark}>
              {translate('cleanliness')}: {this.props.clean_rate}/5
            </Text>
            <Text style={themeStyles.color_dark}>
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
    fontWeight: 'bold',
  },
});

export default ProfileReviewCard;
