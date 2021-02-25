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
      userInfo: this.props.currentUser,
      review: this.props.shopReview,
      locationId: this.props.locationId,
      liked: false,
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({ userId: await getItem('USER_ID') });

    // await this.getUserInfo();
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


//  [{"location": {"avg_clenliness_rating": 3, "avg_overall_rating": 3.6667, "avg_price_rating": 4.1667, "avg_quality_rating": 3.6667, "latitude": 53.388042, "location_id": 1, "location_name": "Just Coffee", "location_town": "London", "longitude": -2.160297, "photo_path": "https://cdnb.artstation.com/p/assets/images/images/027/245/631/large/bogdan-mb0sco-lw-summer-entry-previewhd.jpg?1591006318"}, "review": {"clenliness_rating": 4, "likes": 3, "overall_rating": 4, "price_rating": 5, "quality_rating": 3, "review_body": "Great atomosphere, great coffee", "review_id": 1}}, {"location": {"avg_clenliness_rating": 1.6, "avg_overall_rating": 2.4, "avg_price_rating": 2.6, "avg_quality_rating": 2.6, "latitude": 53.381145, "location_id": 4, "location_name": "Ben's Diner", "location_town": "London", "longitude": -2.125623, "photo_path": "https://cdnb.artstation.com/p/assets/images/images/029/320/301/large/bogdan-mb0sco-loficoffee-hdpreview.jpg?1597164052"}, "review": {"clenliness_rating": 0, "likes": 4, "overall_rating": 1, "price_rating": 1, "quality_rating": 1, "review_body": "Grim, and expensive", "review_id": 2}}, {"location": {"avg_clenliness_rating": 4, "avg_overall_rating": 4, "avg_price_rating": 3.5, "avg_quality_rating": 4.1667, "latitude": 53.388338, "location_id": 2, "location_name": "Coffee", "location_town": "Manchester", "longitude": -2.152658, "photo_path": "https://cdnb.artstation.com/p/assets/images/images/022/005/763/large/bogdan-mb0sco-donnuts-hd.jpg?1584319974"}, "review": {"clenliness_rating": 4, "likes": 1, "overall_rating": 4, "price_rating": 5, "quality_rating": 3, "review_body": "I like the coffee", "review_id": 4}}, {"location": {"avg_clenliness_rating": 3, "avg_overall_rating": 3.6667, "avg_price_rating": 4.1667, "avg_quality_rating": 3.6667, "latitude": 53.388042, "location_id": 1, "location_name": "Just Coffee", "location_town": "London", "longitude": -2.160297, "photo_path": "https://cdnb.artstation.com/p/assets/images/images/027/245/631/large/bogdan-mb0sco-lw-summer-entry-previewhd.jpg?1591006318"}, "review": {"clenliness_rating": 3, "likes": 3, "overall_rating": 3, "price_rating": 3, "quality_rating": 3, "review_body": "Not as good now that they've upped their prices", "review_id": 3}}, {"location": {"avg_clenliness_rating": 4, "avg_overall_rating": 4, "avg_price_rating": 3.5, "avg_quality_rating": 4.1667, "latitude": 53.388338, "location_id": 2, "location_name": "Coffee", "location_town": "Manchester", "longitude": -2.152658, "photo_path": "https://cdnb.artstation.com/p/assets/images/images/022/005/763/large/bogdan-mb0sco-donnuts-hd.jpg?1584319974"}, "review": {"clenliness_rating": 1, "likes": 1, "overall_rating": 4, "price_rating": 5, "quality_rating": 5, "review_body": "A quality establishment but not impressed by the filth of the bathrooms", "review_id": 16}}]
