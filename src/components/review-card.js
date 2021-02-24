import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, Card, CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { Text } from 'react-native';

import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';
import ReviewIcon from './review-icon';

class ReviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: [],
      liked: false,
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({ userId: await getItem('USER_ID') });

    await this.getUserInfo();
    await this.checkIfAlreadyLiked();
  }

  getUserInfo = async() => {
    const { userId } = this.state;
    const response = await this.apiRequests.get(`/user/${userId}`);

    if (response) {
      this.setState({ userInfo: response });
    }
  };

  checkIfAlreadyLiked = () => {
    const likedReviews = this.state.userInfo.liked_reviews;
    if (likedReviews.length !== 0) {
      likedReviews.forEach((like) => {
        if (like.review.review_id === this.props.shopReview.review_id) {
          // User has already liked this review
          this.setState({ liked: true });
        }
      });
    }

    // User has not previously liked the review
    this.setState({ liked: false });
  };

  likeButtonPressed = (locationId, reviewId) => {
    if (this.state.liked) {
      this.unlikeReview(locationId, reviewId);
      return;
    }

    this.likeReview(locationId, reviewId);
  };

  likeReview = async(locationId, reviewId) => {
    const response = await this.apiRequests.post(
      `location/${locationId}/review/${reviewId}/like`,
      {}, // This request doesnt need a request body
    );

    if (response) {
      this.setState({ liked: true });
    }
  };

  unlikeReview = async(locationId, reviewId) => {
    const response = await this.apiRequests.delete(
      `location/${locationId}/review/${reviewId}/like`,
    );

    if (response) {
      this.setState({ liked: false });
    }
  };

  render() {
    const themeStyles = ThemeProvider.getTheme();
    const review = this.props.shopReview;
    const { locationId } = this.props;

    return (
      <Card>
        <CardItem>
          <Left>
            <Text>{review.review_body}</Text>
          </Left>

          <Right>
            <Text style={themeStyles.color_dark}>
              {translate('price')}: {review.price_rating}/5
            </Text>
            <Text style={themeStyles.color_dark}>
              {translate('cleanliness')}: {review.clenliness_rating}/5
            </Text>
            <Text style={themeStyles.color_dark}>
              {translate('quality')}: {review.quality_rating}/5
            </Text>
          </Right>
        </CardItem>
        <CardItem style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Left>
            <Button transparent style={themeStyles.color_dark}>
              <FontAwesomeIcon
                icon={this.state.liked ? faHeartSolid : faHeartRegular}
                size={15}
                color={themeStyles.color_primary.color}
                onPress={() => this.likeButtonPressed(locationId, review.review_id)
                }
              />
            </Button>
            <Text>{review.likes}</Text>
          </Left>
          <Right>
            <ReviewIcon rating={review.overall_rating} size={15} spacing={5} />
          </Right>
        </CardItem>
      </Card>
    );
  }
}

export default ReviewCard;
