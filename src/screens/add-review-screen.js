import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Content, Form, Header, Left, Textarea, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Stars from 'react-native-stars';

import Empty from '../assets/ratings/rating-empty-primary.png';
import Full from '../assets/ratings/rating-full-primary.png';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';
import toast from '../utils/toast';
import Validator from '../utils/validator';

class AddReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overallRating: 1,
      priceRating: 1,
      cleanRating: 1,
      qualRating: 1,
      reviewBody: '',
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));
  }

  calculateOverall = () => {
    const price = this.state.priceRating;
    const clean = this.state.cleanRating;
    const qual = this.state.qualRating;
    const avRating = Math.round((price + clean + qual) / 3);

    this.setState({ overallRating: avRating });
  };

  updateState = (identifier, rating) => {
    this.setState({ [identifier]: rating }, function calculate() {
      this.calculateOverall();
    });
  };

  validateReview = (text) => {
    if (text.length === 0) {
      toast(translate('empty_review_error_toast'));
      return false;
    }

    if (text.length > 500) {
      toast(translate('max_chars_error_toast'));
      return false;
    }

    return true;
  };

  createReview = async(locationId) => {
    let { reviewBody } = this.state;
    if (!this.validateReview(reviewBody, locationId)) {
      return;
    }

    reviewBody = Validator.profanityFilter(reviewBody);

    const postBody = JSON.stringify({
      overall_rating: this.state.overallRating,
      price_rating: this.state.priceRating,
      quality_rating: this.state.qualRating,
      clenliness_rating: this.state.cleanRating,
      review_body: reviewBody,
    });

    const response = await this.apiRequests.post(
      `/location/${locationId}/review`,
      postBody,
    );

    if (response) {
      toast(translate('review_created_toast'));
      this.findReview(locationId);
    }
  };

  findReview = async(locationId) => {
    const response = await this.apiRequests.get('/find?search_in=reviewed');

    if (response) {
      const location = response.find((loc) => loc.location_id === locationId);

      // location has no reviews? Something has gone horribly wrong.
      if (location.length === 0) return;

      this.extractId(location);
      if (this.state.reviewId) {
        this.props.navigation.navigate('AddPhoto', {
          locationId,
          reviewId: this.state.reviewId,
          displayText: translate('add_review_photo_text'),
          updateReview: false,
        });
      }
    }
  };

  extractId = (location) => {
    const reviewIds = [];
    location.location_reviews.forEach((rev) => {
      // find the review matching the review body
      if (rev.review_body === this.state.reviewBody) {
        reviewIds.push(rev.review_id);
      }
    });

    // cant find review in database, something went wrong but didnt error...
    if (reviewIds.length === 0) return;

    // The array will be greater than one if reviews have the same review body
    // Find the largest ID (latest entry) and set state
    this.setState({ reviewId: Math.max(...reviewIds) });
  };

  render() {
    const themeStyles = ThemeProvider.getTheme();
    const shopData = this.props.navigation.getParam('shopData');

    return (
      <Container style={themeStyles.container}>
        <Header style={[styles.header, themeStyles.background_color]}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={themeStyles.color_primary.color}
                onPress={() => this.props.navigation.goBack()}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={[styles.title, themeStyles.color_dark]}>
              {translate('new_review')}
            </Title>
          </Body>
        </Header>

        <Content padder>
          <View>
            <Text style={[styles.title, themeStyles.color_dark]}>
              {shopData.location_name}
            </Text>
          </View>

          <View style={styles.review_container}>
            {/* Price Rating Buttons */}
            <View style={styles.review_section}>
              <View style={styles.review_rating}>
                <Stars
                  default={this.state.priceRating}
                  update={(rating) => {
                    this.updateState('priceRating', rating);
                  }}
                  spacing={4}
                  starSize={20}
                  count={5}
                  fullStar={Full}
                  emptyStar={Empty}
                />
              </View>
              <View style={styles.review_description}>
                <Text>{translate('price')}</Text>
              </View>
            </View>

            {/* Cleanliness Rating Buttons */}
            <View style={styles.review_section}>
              <View style={styles.review_rating}>
                <Stars
                  default={this.state.cleanRating}
                  update={(rating) => {
                    this.updateState('cleanRating', rating);
                  }}
                  spacing={4}
                  starSize={20}
                  count={5}
                  fullStar={Full}
                  emptyStar={Empty}
                />
              </View>
              <View style={styles.review_description}>
                <Text>{translate('cleanliness')}</Text>
              </View>
            </View>

            {/* Quality Rating Buttons */}
            <View style={styles.review_section}>
              <View style={styles.review_rating}>
                <Stars
                  default={this.state.qualRating}
                  update={(rating) => {
                    this.updateState('qualRating', rating);
                  }}
                  spacing={4}
                  starSize={20}
                  count={5}
                  fullStar={Full}
                  emptyStar={Empty}
                />
              </View>
              <View style={styles.review_description}>
                <Text>{translate('quality')}</Text>
              </View>
            </View>
          </View>

          <View>
            <Text>
              {translate('overall_rating')}: {this.state.overallRating}
            </Text>
          </View>

          <Form>
            <Textarea
              rowSpan={5}
              bordered
              placeholder={translate('leave_review')}
              value={this.state.reviewBody}
              onChangeText={(text) => this.setState({ reviewBody: text })}
            />
          </Form>

          <TouchableOpacity
            style={[styles.btn_primary, themeStyles.primary_button_color]}
            onPress={() => this.createReview(shopData.location_id)}>
            <Text style={[styles.btn_text, themeStyles.color_light]}>
              {translate('post_review')}
            </Text>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    borderBottomWidth: 0.5,
  },
  header_left: {
    position: 'absolute',
    left: 10,
  },
  header_body: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  review_container: {
    marginTop: 20,
    height: 150,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  review_section: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  review_rating: {
    justifyContent: 'center',
    flex: 1,
    transform: [{ rotate: '270deg' }],
  },
  review_description: {
    alignItems: 'center',
  },
  btn_primary: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  btn_text: {
    padding: 10,
    alignItems: 'center',
  },
});

export default AddReview;
