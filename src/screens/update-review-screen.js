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
import { toast } from '../utils/toast';
import { profanityFilter } from '../utils/validator';

let apiRequests = null;

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
    apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({
      shopData: this.props.navigation.getParam('shopData'),
    });

    this._onFocusListener = this.props.navigation.addListener(
      'didFocus',
      async (payload) => {
        this.checkForImage();
        this.setState({loading: false});
      },
    );
  }

  checkForImage = async () => {
    const locationId = this.state.shopData.location_id;
    const reviewId = this.state.reviewId;

    const response = await apiRequests.get(
      `/location/${locationId}/review/${reviewId}/photo`,
    );

    if (response) {
      this.setState({
        imageExists: true,
        imageUrl: response.url,
        //   imageUrl: response.url + '&timestamp=' + new Date(),
      });
    } else {
      this.setState({imageExists: false});
    }
  };

  calculateOverall = () => {
    const price = this.state.priceRating;
    const clean = this.state.cleanRating;
    const qual = this.state.qualRating;
    const avRating = Math.round((price + clean + qual) / 3);

    this.setState({overallRating: avRating});
  };

  updateState = (identifier, rating) => {
    this.setState({[identifier]: rating}, function () {
      this.calculateOverall();
    });
  };

  validateReview = (text) => {
    if (text.length === 0) {
      toast("Please write a review, thats why you're here");
      return false;
    }

    if (text.length > 500) {
      toast('Too many characters in your review. Please write less. :)');
      return false;
    }

    return profanityFilter(text);
  };

  editReviewPhoto = () => {
    this.props.navigation.navigate('UpdateDeletePhoto', {
      locationId: this.state.shopData.location_id,
      reviewId: this.state.reviewId,
      displayText: 'Would you like to update your review photo?',
      updateReview: true,
      deleteReview: false,
    });
  };

  deleteReviewPhoto = () => {
    this.props.navigation.navigate('UpdateDeletePhoto', {
      locationId: this.state.shopData.location_id,
      reviewId: this.state.reviewId,
      displayText: 'Would you like to delete the review photo?',
      updateReview: false,
      deleteReview: true,
    });
  };

  updateReview = async () => {
    if (!this.validateReview(this.state.reviewBody)) {
      return;
    }

    const locationId = this.state.shopData.location_id;
    const reviewId = this.state.reviewId;

    const patchBody = JSON.stringify({
      overall_rating: this.state.overallRating,
      price_rating: this.state.priceRating,
      quality_rating: this.state.qualRating,
      clenliness_rating: this.state.cleanRating,
      review_body: this.state.reviewBody,
    });

    const response = await apiRequests.patch(
      `/location/${locationId}/review/${reviewId}`,
      patchBody,
    );

    if (response === 'OK') {
      toast('Review updated!');
    }
  };

  render() {
    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    } else {
      return (
        <Container style={styles.container}>
          <Header style={styles.header}>
            <Left style={styles.header_left}>
              <Button transparent>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  size={20}
                  color={'#F06543'}
                  onPress={() => this.props.navigation.goBack()}
                />
              </Button>
            </Left>

            <Body style={styles.header_body}>
              <Title style={styles.title}>{translate('add_review')}</Title>
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
                      color={'#F06543'}
                      onPress={() => this.editReviewPhoto()}
                    />
                  </Button>

                  <Button transparent style={styles.title_btn}>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      size={15}
                      color={'#F06543'}
                      onPress={() => this.deleteReviewPhoto()}
                    />
                  </Button>
                </Right>
              )}
            </View>

            {this.state.imageExists ? (
              <View>
                <Image
                  source={{uri: this.state.imageUrl}}
                  style={{height: 200, width: 'auto', flex: 1}}
                />
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={styles.btn_primary_outline}
                  onPress={() =>
                    this.props.navigation.navigate('TakePhoto', {
                      locationId: this.state.shopData.location_id,
                      reviewId: this.state.reviewId,
                      update: true,
                    })
                  }>
                  <Text style={styles.btn_outline_text}>
                    Add Photo to review
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
                {translate('overall_rating')} {this.state.overallRating}
              </Text>
            </View>

            <Form>
              <Textarea
                rowSpan={4}
                bordered
                placeholder={translate('leave_review')}
                value={this.state.reviewBody}
                onChangeText={(text) => this.setState({reviewBody: text})}
              />
            </Form>
            <TouchableOpacity
              style={styles.btn_primary}
              onPress={() => this.updateReview()}>
              <Text style={styles.btn_text}>{translate('update_review')}</Text>
            </TouchableOpacity>
          </Content>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#E8E9EB',
  },
  header: {
    height: 50,
    borderBottomWidth: 0.5,
    backgroundColor: '#E8E9EB',
  },
  header_left: {
    flex: 1,
  },
  header_body: {
    flex: 99,
    alignItems: 'center',
  },
  header_right: {
    flex: 1,
  },
  content: {},
  title_view: {
    flexDirection: 'row',
  },
  title_left: {},
  title: {
    color: '#313638',
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
    transform: [{rotate: '270deg'}],
  },
  review_description: {
    alignItems: 'center',
  },
  btn_primary: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F06543',
    backgroundColor: '#F06543',
    borderRadius: 5,
  },
  btn_text: {
    padding: 10,
    color: '#FFFFFF',
    alignItems: 'center',
  },
  photo_btn_view: {
    flexDirection: 'row',
  },
  btn_primary_outline: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F06543',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  btn_outline_text: {
    color: '#313638',
    padding: 5,
  },
});

export default UpdateReview;
