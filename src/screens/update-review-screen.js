import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Content, Form, Header, Left, Right, Textarea, Title } from 'native-base';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Stars from 'react-native-stars';

import Empty from '../assets/ratings/rating-empty-primary.png';
import Full from '../assets/ratings/rating-full-primary.png';
import LoadingSpinner from '../components/loading-spinner';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';
import toast from '../utils/toast';
import Validator from '../utils/validator';

class UpdateReview extends Component {
  constructor(props) {
    super(props);

    const reviewData = this.props.navigation.getParam('reviewData');

    this.state = {
      loading: true,
      reviewId: reviewData.review_id,
      overallRating: reviewData.overall_rating,
      priceRating: reviewData.price_rating,
      cleanRating: reviewData.clenliness_rating,
      qualRating: reviewData.quality_rating,
      reviewBody: reviewData.review_body,
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({
      shopData: this.props.navigation.getParam('shopData'),
    });

    this._onFocusListener = this.props.navigation.addListener(
      'didFocus',
      async() => {
        this.checkForImage();
        this.setState({ loading: false });
      },
    );
  }

  componentWillUnmount() {
    this._onFocusListener.remove();
  }

  checkForImage = async() => {
    const locationId = this.state.shopData.location_id;
    const { reviewId } = this.state;

    const response = await this.apiRequests.getImage(
      `/location/${locationId}/review/${reviewId}/photo`,
    );

    if (response) {
      this.setState({
        imageExists: true,
        imageUrl: response.url,
      });
    } else {
      this.setState({ imageExists: false });
    }
  };

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

  editReviewPhoto = () => {
    this.props.navigation.navigate('UpdateDeletePhoto', {
      locationId: this.state.shopData.location_id,
      reviewId: this.state.reviewId,
      displayText: translate('update_review_photo_text'),
      updateReview: true,
      deleteReview: false,
    });
  };

  deleteReviewPhoto = () => {
    this.props.navigation.navigate('UpdateDeletePhoto', {
      locationId: this.state.shopData.location_id,
      reviewId: this.state.reviewId,
      displayText: translate('delete_review_photo_text'),
      updateReview: false,
      deleteReview: true,
    });
  };

  updateReview = async() => {
    let { reviewBody } = this.state;
    if (!this.validateReview(reviewBody, locationId)) {
      return;
    }

    reviewBody = Validator.profanityFilter(reviewBody);

    const locationId = this.state.shopData.location_id;
    const { reviewId } = this.state;

    const patchBody = JSON.stringify({
      overall_rating: this.state.overallRating,
      price_rating: this.state.priceRating,
      quality_rating: this.state.qualRating,
      clenliness_rating: this.state.cleanRating,
      review_body: reviewBody,
    });

    const response = await this.apiRequests.patch(
      `/location/${locationId}/review/${reviewId}`,
      patchBody,
    );

    if (response === 'OK') {
      toast(translate('review_updated_toast'));
      this.props.navigation.goBack();
    }
  };

  render() {
    const themeStyles = ThemeProvider.getTheme();

    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    }
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
              {translate('update_review')}
            </Title>
          </Body>
        </Header>

        <Content padder>
          <View style={styles.title_view}>
            <Left style={styles.title_left}>
              <Text style={styles.title}>
                {this.state.shopData.location_name}
              </Text>
            </Left>

            {this.state.imageExists && (
              <Right style={styles.title_right}>
                <Button transparent style={styles.title_btn}>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    size={15}
                    color={themeStyles.color_primary.color}
                    onPress={() => this.editReviewPhoto()}
                  />
                </Button>

                <Button transparent style={styles.title_btn}>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    size={15}
                    color={themeStyles.color_primary.color}
                    onPress={() => this.deleteReviewPhoto()}
                  />
                </Button>
              </Right>
            )}
          </View>

          {this.state.imageExists ? (
            <View>
              <Image
                source={{ uri: this.state.imageUrl }}
                style={{ height: 200, width: 'auto', flex: 1 }}
              />
            </View>
          ) : (
            <View>
              <TouchableOpacity
                style={[
                  styles.btn_primary_outline,
                  themeStyles.primary_button_color_outline,
                ]}
                onPress={() => this.props.navigation.navigate('TakePhoto', {
                  locationId: this.state.shopData.location_id,
                  reviewId: this.state.reviewId,
                  update: true,
                })
                }>
                <Text
                  style={[styles.btn_outline_text, themeStyles.color_dark]}>
                  {translate('app_photo_review')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
              rowSpan={4}
              bordered
              placeholder={translate('leave_review')}
              value={this.state.reviewBody}
              onChangeText={(text) => this.setState({ reviewBody: text })}
            />
          </Form>
          <TouchableOpacity
            style={[styles.btn_primary, themeStyles.primary_button_color]}
            onPress={() => this.updateReview()}>
            <Text style={[styles.btn_text, themeStyles.color_light]}>
              {translate('update_review')}
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
  title_view: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
  },
  title_right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title_btn: {
    padding: 8,
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
  photo_btn_view: {
    flexDirection: 'row',
  },
  btn_primary_outline: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  btn_outline_text: {
    padding: 5,
  },
});

export default UpdateReview;
