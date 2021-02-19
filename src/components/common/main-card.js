import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Body, Card, CardItem, Left, Right} from 'native-base';
import React, {Component} from 'react';
import {Image, StyleSheet, Text} from 'react-native';

import ReviewIcon from '../common/review-icon';

class MainCard extends Component {
  constructor(props) {
    super(props);
  }

  clicked = () => {
    const {navigate} = this.props.navigation;
    navigate('SelectedShop', {locationId: this.props.shopData.location_id});
  };

  render() {
    const shop = this.props.shopData;
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
              color={'#E0DFD5'}
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
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#E8E9EB',
  },
  header: {
    height: 50,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  srch: {
    flex: 1,
  },
  subHeading: {
    height: 50,
    backgroundColor: 'grey',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default MainCard;
