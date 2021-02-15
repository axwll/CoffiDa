import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, Card, CardItem, Left } from 'native-base';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { getItem, setItem } from '../common/async-storage-helper';
import ProfileReviewCard from '../common/profile-review-card';

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
      return (
        <View style={styles.loading_view}>
          <Text style={styles.load_text}>{this.state.loadingMessage}</Text>
        </View>
      );
    } else {
      return (
        <ScrollView>
          {this.state.userInfo.liked_reviews.map((item) => {
            const review = item.review;
            return (
              <Card key={item.review.review_id}>
                <ProfileReviewCard
                  title={item.location.location_name}
                  subHeading={item.location.location_town}
                  body={review.review_body}
                  overall_rate={review.overall_rating}
                  price_rate={review.price_rating}
                  clean_rate={review.clenliness_rating}
                  qual_rate={review.quality_rating}
                />
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
  light_text: {
    color: '#313638',
  },
  last_item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  loading_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  load_text: {
    fontSize: 20,
    color: '#313638',
  },
});

export default Likes;
