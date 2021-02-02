import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Card, CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import Stars from 'react-native-stars';

class MainCard extends Component {
  render() {
    return (
      <Card>
        <CardItem>
          <Left>
            <Body>
              <Text>{this.props.shopData.location_name}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <Image
            source={require('../../assets/lofi-coffee.png')}
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
            <Text>{this.props.shopData.location_town}</Text>
          </Left>

          <Right style={styles.right}>
            <Text>(327)</Text>
            <Stars
              display={this.props.shopData.avg_overall_rating}
              spacing={8}
              count={5}
              starSize={20}
              fullStar={require('../../assets/ratings/rating-full-primary.png')}
              halfStar={require('../../assets/ratings/rating-half-primary.png')}
              emptyStar={require('../../assets/ratings/rating-empty-primary.png')}
            />
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
  btn: {
    backgroundColor: 'green',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default MainCard;
