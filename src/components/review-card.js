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

/**
 * This renders a card to show reviews.
 * It is used in multiple places in the app
 */
class ReviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: this.props.currentUser,
      review: this.props.shopReview,
      locationId: this.props.locationId,
      liked: false,
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({ userId: await getItem('USER_ID') });

    await this.checkIfAlreadyLiked();
  }

  getUserInfo = async() => {
    const { userId } = this.state;
    const response = await this.apiRequests.get(`/user/${userId}`);

    if (response) {
      this.setState({ userInfo: response });
    }

    this.checkIfAlreadyLiked();
  };

  updateReview = async() => {
    const { locationId } = this.state;
    const response = await this.apiRequests.get(`/location/${locationId}`);

    if (response) {
      const reviewId = this.state.review.review_id;
      const updated = response.location_reviews.find((review) => review.review_id === reviewId);
      if (updated) {
        this.setState({ review: updated });
      }
    }
  };

  checkIfAlreadyLiked = () => {
    const likedReviews = this.state.userInfo.liked_reviews;
    let liked = false;
    if (likedReviews.length !== 0) {
      likedReviews.forEach((like) => {
        if (like.review.review_id === this.props.shopReview.review_id) {
          liked = true;
        }
      });
    }

    this.setState({ liked });
  };

  likeButtonPressed = (locationId, reviewId) => {
    if (this.state.liked) {
      this.unlikeReview(locationId, reviewId);
      return;
    }

    this.likeReview(locationId, reviewId);
  };

  likeReview = async(locationId, reviewId) => {
    const response = await this.apiRequests.post(`/location/${locationId}/review/${reviewId}/like`);

    if (response) {
      this.setState({ liked: true });
      await this.updateReview();
    }
  };

  unlikeReview = async(locationId, reviewId) => {
    const response = await this.apiRequests.delete(
      `/location/${locationId}/review/${reviewId}/like`,
    );

    if (response) {
      this.setState({ liked: false });
      await this.updateReview();
    }
  };

  render() {
    const themeStyles = ThemeProvider.getTheme();

    return (
      <Card>
        <CardItem>
          <Left>
            <Text>{this.state.review.review_body}</Text>
          </Left>

          <Right>
            <Text style={themeStyles.color_dark}>
              {translate('price')}: {this.state.review.price_rating}/5
            </Text>
            <Text style={themeStyles.color_dark}>
              {translate('cleanliness')}: {this.state.review.clenliness_rating}/5
            </Text>
            <Text style={themeStyles.color_dark}>
              {translate('quality')}: {this.state.review.quality_rating}/5
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
                onPress={() => {
                  this.likeButtonPressed(this.state.locationId, this.state.review.review_id);
                }}
              />
            </Button>
            <Text>{this.state.review.likes}</Text>
          </Left>
          <Right>
            <ReviewIcon rating={this.state.review.overall_rating} size={15} spacing={5} />
          </Right>
        </CardItem>
      </Card>
    );
  }
}

export default ReviewCard;
