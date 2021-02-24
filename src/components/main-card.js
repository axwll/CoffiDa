import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Card, CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { Image, StyleSheet, Text } from 'react-native';

import ThemeProvider from '../utils/theme-provider';
import ReviewIcon from './review-icon';

class MainCard extends Component {
  constructor(props) {
    super(props);
  }

  clicked = () => {
    this.props.navigation.navigate('SelectedShop', {
      locationId: this.props.shopData.location_id,
    });
  };

  render() {
    const shop = this.props.shopData;
    const themeStyles = ThemeProvider.getTheme();

    return (
      <Card>
        <CardItem button onPress={() => this.clicked()}>
          <Left>
            <Body>
              <Text>{shop.location_name}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <Image
            source={{uri: shop.photo_path}}
            style={{height: 200, width: 100, flex: 1}}
          />
        </CardItem>
        <CardItem>
          <Left>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size={20}
              color={themeStyles.alt_color_light.color}
              onPress={() => this.press()}
            />
            <Text>{shop.location_town}</Text>
          </Left>

          <Right style={styles.right}>
            <ReviewIcon rating={shop.avg_overall_rating} primary={true} />
            <Text>({shop.location_reviews.length})</Text>
          </Right>
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  srch: {
    flex: 1,
  },
  right: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default MainCard;
