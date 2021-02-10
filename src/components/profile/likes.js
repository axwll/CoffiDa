import {faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Button, Card, CardItem, Left, Right} from 'native-base';
import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';

import {translate} from '../../locales';
import {getItem, setItem} from '../common/async-storage-helper';
import ReviewIcon from '../common/review-icon';

class Likes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingMessage: 'Loading data',
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
      userInfo: JSON.parse(await getItem('USER_DATA')),
    });

    this.setState({loading: false});
  }

  unlikeReview = (locationId, reviewId) => {
    this.setState({
      loading: true,
      loadingMessage: 'Removing like from reviw',
    });
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/like`,
      {
        method: 'DELETE',
        headers: {'x-Authorization': this.state.token},
      },
    )
      .then(() => {
        this.getUserInfo();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUserInfo = () => {
    const userId = this.state.userInfo.user_id;

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`, {
      headers: {
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setItem('USER_DATA', JSON.stringify(responseJson));
        this.setState({
          userInfo: responseJson,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.loading) {
      return <Text>{this.state.loadingMessage}</Text>;
    } else {
      return (
        <ScrollView>
          {this.state.userInfo.liked_reviews.map((item) => {
            return (
              <Card key={item.review.review_id}>
                <CardItem>
                  <Left style={styles.card_left}>
                    <Text style={styles.loc_name}>
                      {item.location.location_name}
                    </Text>
                    <Text style={styles.light_text}>
                      {item.location.location_town}
                    </Text>
                  </Left>

                  <Right>
                    <ReviewIcon
                      rating={item.review.overall_rating}
                      size={15}
                      spacing={5}
                    />
                  </Right>
                </CardItem>
                <CardItem style={styles.card_body}>
                  <Left style={styles.body_left}>
                    <Text>{item.review.review_body}</Text>
                  </Left>

                  <Right style={styles.body_right}>
                    <Text style={styles.light_text}>
                      {translate('price')}: {item.review.price_rating}/5
                    </Text>
                    <Text style={styles.light_text}>
                      {translate('cleanliness')}:{' '}
                      {item.review.review_clenlinessrating}
                      /5
                    </Text>
                    <Text style={styles.light_text}>
                      {translate('quality')}: {item.review.quality_rating}
                      /5
                    </Text>
                  </Right>
                </CardItem>
                <CardItem style={styles.last_item}>
                  <Left>
                    <Button transparent style={styles.light_text}>
                      <FontAwesomeIcon
                        icon={faHeartSolid}
                        size={15}
                        color={'#F06543'}
                        onPress={() =>
                          this.unlikeReview(
                            item.location.location_id,
                            item.review.review_id,
                          )
                        }
                      />
                    </Button>
                    <Text style={styles.like_count}>{item.review.likes}</Text>
                  </Left>
                </CardItem>
              </Card>
            );
          })}
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  card_left: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  loc_name: {
    color: 'tomato',
    fontWeight: 'bold',
  },
  light_text: {
    color: '#313638',
  },
  card_body: {
    flex: 1,
    flexDirection: 'row',
  },
  body_left: {
    flex: 4,
  },
  body_right: {
    flex: 2,
  },
  last_item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default Likes;
