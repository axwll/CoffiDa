import { faMapMarkerAlt, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Card, CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { Image, StyleSheet, Text } from 'react-native';

import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';
import ReviewIcon from './review-icon';

/**
 * This component renders a card that is used in multiple places through the app.
 */
class MainCard extends Component {
  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));
  }


  clicked = () => {
    this.props.navigation.navigate('SelectedShop', {
      locationId: this.props.shopData.location_id,
    });
  };

  favButtonPressed = async() => {
    const locationId = this.props.shopData.location_id;

    const response = await this.apiRequests.delete(
      `/location/${locationId}/favourite`,
    );

    if (response === 'OK') {
      // Use the callback in props to refresh the data on the page
      this.props.callback();
    }
  }

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
          {this.props.favoriteTab && (
            <Right>
              <FontAwesomeIcon
                icon={faStarSolid}
                size={20}
                color={themeStyles.color_primary.color}
                onPress={() => this.favButtonPressed()}
              />
            </Right>
          )}
        </CardItem>
        <CardItem cardBody>
          <Image
            source={{ uri: shop.photo_path }}
            style={{ height: 200, width: 100, flex: 1 }}
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
            <ReviewIcon rating={shop.avg_overall_rating} primary />
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
