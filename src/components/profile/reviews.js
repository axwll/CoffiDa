import { faHeart as faHeartRegular, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, Card, CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { getItem, setItem } from '../common/async-storage-helper';
import ProfileReviewCard from '../common/profile-review-card';

class Reviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingMessage: 'Loading data',
      userInfo: [],
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
      userInfo: JSON.parse(await getItem('USER_DATA')),
    });

    this.setState({loading: false});
  }

  deleteReview = (locationId, reviewId) => {
    this.setState({
      loading: true,
      loadingMessage: 'Deleting review',
    });
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}`,
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

  editReview = (data) => {
    this.props.navigation.navigate('UpdateReview', {
      reviewData: data.review,
      update: true,
      shopData: data.location,
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
          {this.state.userInfo.reviews.map((item) => {
            const review = item.review;
            return (
              <Card key={review.review_id}>
                <ProfileReviewCard
                  title={item.location.location_name}
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
                        icon={this.state.liked ? faHeartSolid : faHeartRegular}
                        size={15}
                        color={'#818181'}
                        // onPress={() =>
                        //   this.likeButtonPressed(locationId, review.review_id)
                        // }
                      />
                    </Button>
                    <Text style={styles.like_count}>{item.review.likes}</Text>
                  </Left>

                  <Right style={styles.footer_right}>
                    <Button transparent style={styles.pencil_btn}>
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        size={15}
                        color={'#F06543'}
                        onPress={() => this.editReview(item)}
                      />
                    </Button>

                    <Button transparent style={styles.trash_btn}>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        size={15}
                        color={'#F06543'}
                        onPress={() =>
                          this.deleteReview(
                            item.location.location_id,
                            item.review.review_id,
                          )
                        }
                      />
                    </Button>
                  </Right>
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
  footer_right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pencil_btn: {
    paddingRight: 15,
  },
  trash_btn: {},
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

export default withNavigation(Reviews);
