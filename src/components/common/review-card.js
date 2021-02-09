import {faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons';
import {faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Button, Card, CardItem, Left, Right} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';

import {translate} from '../../locales';
import {getItem} from '../common/async-storage-helper';
import ReviewIcon from '../common/review-icon';

class ReviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      reviewUser: null,
      liked: false,
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
      currentUser: JSON.parse(await getItem('USER_DATA')),
    });

    await this.getReviewUserFromId(this.props.shopReview.review_user_id);
    await this.checkIfAlreadyLiked();
    this.setState({loading: false});
  }

  getReviewUserFromId = (userId) => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + userId, {
      headers: {
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({reviewUser: responseJson});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkIfAlreadyLiked = () => {
    const liked_reviews = this.state.currentUser.liked_reviews;
    if (liked_reviews.length !== 0) {
      liked_reviews.forEach((like) => {
        if (like.review.review_id === this.props.shopReview.review_id) {
          // User has already liked this review
          this.setState({liked: true});
          return;
        }
      });
    }

    // User has not previously liked the review
    this.setState({liked: false});
    return;
  };

  likeButtonPressed = (locationId, reviewId) => {
    if (this.state.liked) {
      this.unlikeReview(locationId, reviewId);
      return;
    }

    this.likeReview(locationId, reviewId);
  };

  likeReview = (locationId, reviewId) => {
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/like`,
      {
        method: 'POST',
        headers: {'x-Authorization': this.state.token},
      },
    )
      .then(() => {
        this.setState({liked: true});
        console.log('liked');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  unlikeReview = (locationId, reviewId) => {
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/like`,
      {
        method: 'DELETE',
        headers: {'x-Authorization': this.state.token},
      },
    )
      .then(() => {
        this.setState({liked: false});
        console.log('unliked');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.loading) {
      return <Text>Waiting for data</Text>;
    } else {
      const review = this.props.shopReview;
      const locationId = this.props.locationId;

      return (
        <Card>
          <CardItem style={styles.first_item}>
            <Left>
              <Text style={styles.user}>
                {translate('user')}: {this.state.reviewUser.first_name}{' '}
                {this.state.reviewUser.last_name}
              </Text>
            </Left>

            <Right>
              <ReviewIcon
                rating={review.review_overallrating}
                size={15}
                spacing={5}
              />
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Text>{review.review_body}</Text>
            </Left>

            <Right>
              <Text style={styles.light_text}>
                {translate('price')}: {review.review_pricerating}/5
              </Text>
              <Text style={styles.light_text}>
                {translate('cleanliness')}: {review.review_clenlinessrating}/5
              </Text>
              <Text style={styles.light_text}>
                {translate('quality')}: {review.review_qualityrating}/5
              </Text>
            </Right>
          </CardItem>
          <CardItem style={styles.last_item}>
            <Left>
              <Button transparent style={styles.light_text}>
                <FontAwesomeIcon
                  icon={this.state.liked ? faHeartSolid : faHeartRegular}
                  size={15}
                  color={'#F06543'}
                  onPress={() =>
                    this.likeButtonPressed(locationId, review.review_id)
                  }
                />
              </Button>
              <Text style={styles.like_count}>{review.likes}</Text>
            </Left>
          </CardItem>
        </Card>
      );
    }
  }
}

const styles = StyleSheet.create({
  first_item: {
    paddingBottom: 0,
    marginBottom: 0,
  },
  user: {
    color: 'tomato',
    fontWeight: 'bold',
  },
  light_text: {
    color: '#313638',
  },
  last_item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default ReviewCard;
