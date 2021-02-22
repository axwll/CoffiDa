import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, Card, CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';

import ReviewIcon from '../components/review-icon';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';

let apiRequests = null;

class ReviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //   loading: true,
      userInfo: [],
      liked: false,
    };
  }

  async componentDidMount() {
    apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({userId: await getItem('USER_ID')});

    await this.getUserInfo();
    await this.checkIfAlreadyLiked();
    // this.setState({loading: false});
  }

  getUserInfo = async () => {
    const userId = this.state.userId;
    const response = await apiRequests.get(`/user/${userId}`);

    if (response) {
      this.setState({userInfo: response});
    }
  };

  checkIfAlreadyLiked = () => {
    const liked_reviews = this.state.userInfo.liked_reviews;
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

  likeReview = async (locationId, reviewId) => {
    const response = await apiRequests.post(
      `location/${locationId}/review/${reviewId}/like`,
      {}, // This request doesnt need a request body
    );

    if (response) {
      this.setState({liked: true});
    }
  };

  unlikeReview = async (locationId, reviewId) => {
    const response = await apiRequests.delete(
      `location/${locationId}/review/${reviewId}/like`,
    );

    if (response) {
      this.setState({liked: false});
    }
  };

  render() {
    const review = this.props.shopReview;
    const locationId = this.props.locationId;

    return (
      <Card>
        <CardItem>
          <Left>
            <Text>{review.review_body}</Text>
          </Left>

          <Right>
            <Text style={styles.light_text}>
              {translate('price')}: {review.price_rating}/5
            </Text>
            <Text style={styles.light_text}>
              {translate('cleanliness')}: {review.clenliness_rating}/5
            </Text>
            <Text style={styles.light_text}>
              {translate('quality')}: {review.quality_rating}/5
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
          <Right>
            <ReviewIcon rating={review.overall_rating} size={15} spacing={5} />
          </Right>
        </CardItem>
      </Card>
    );
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
