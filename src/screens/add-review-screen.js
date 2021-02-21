import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Content, Form, Header, Left, Textarea, Title } from 'native-base';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Stars from 'react-native-stars';

import Empty from '../assets/ratings/rating-empty-primary.png';
import Full from '../assets/ratings/rating-full-primary.png';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { toast } from '../utils/toast';
import { profanityFilter } from '../utils/validator';

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

  componentDidMount() {
    if (this.props.navigation.getParam('update')) {
      const reviewData = this.props.navigation.getParam('reviewData');
      this.setState({
        reviewId: reviewData.review_id,
        overallRating: reviewData.overall_rating,
        priceRating: reviewData.price_rating,
        cleanRating: reviewData.clenliness_rating,
        qualRating: reviewData.quality_rating,
        reviewBody: reviewData.review_body,
      });
    }

    this.calculateOverall();
  }

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

  createReview = (locationId) => {
    if (!this.validateReview(this.state.reviewBody, locationId)) {
      return;
    }

    const postBody = JSON.stringify({
      overall_rating: this.state.overallRating,
      price_rating: this.state.priceRating,
      quality_rating: this.state.qualRating,
      clenliness_rating: this.state.cleanRating,
      review_body: this.state.reviewBody,
    });

    const response = ApiRequests.post(
      `/location/${locationId}/review`,
      postBody,
    );

    if (response) {
      toast('Review created!');
      // TODO: should this line go inside or out of the IF
      this.findReview(locationId);
    }
  };

  updateReview = (locationId) => {
    if (!this.validateReview(this.state.reviewBody)) {
      return;
    }

    const response = ApiRequests.patch(
      `/location/${locationId}/review/${reviewId}`,
      {
        overall_rating: this.state.overallRating,
        price_rating: this.state.priceRating,
        quality_rating: this.state.qualRating,
        clenliness_rating: this.state.cleanRating,
        review_body: this.state.reviewBody,
      },
    );

    if (response) {
      toast('Review updated!');
    }
  };

  findReview = (locationId) => {
    const response = ApiRequests.get('/find?search_in=reviewed');

    if (response) {
      const location = responseJson.find(
        (loc) => loc.location_id === locationId,
      );

      if (location.length === 0) {
        // location has no reviews? it should do. Something must have gone wrong.
        return;
      }

      this.extractId(location);
      if (this.state.reviewId) {
        this.props.navigation.navigate('AddPhoto', {
          locationId: locationId,
          reviewId: this.state.reviewId,
        });
      }
    }
  };

  extractId = (location) => {
    let reviewIds = [];
    location.location_reviews.forEach((rev) => {
      // find the review matching the review body
      if (rev.review_body === this.state.reviewBody) {
        reviewIds.push(rev.review_id);
      }
    });

    if (reviewIds.length === 0) {
      // cant find review in database, something went horribly wrong but didnt error
      return;
    }

    // The array will be greater than one if reviews have the same review body
    // Find the largest ID (latest entry) and set state
    this.setState({reviewId: Math.max(...reviewIds)});
  };

  checkImage = (updateReview, imageUri) => {
    if (!updateReview) {
      return false;
    }
  };

  render() {
    const shopData = this.props.navigation.getParam('shopData');
    const updateReview = this.props.navigation.getParam('update');

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
          <View>
            <Text style={styles.title}>{shopData.location_name}</Text>
          </View>

          {this.checkImage() && (
            <View>
              <Image
                source={{uri: shopData.photo_path}}
                style={{height: 200, width: 'auto', flex: 1}}
              />
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
              rowSpan={5}
              bordered
              placeholder={translate('leave_review')}
              value={this.state.reviewBody}
              onChangeText={(text) => this.setState({reviewBody: text})}
            />
          </Form>
          {updateReview ? (
            <TouchableOpacity
              style={styles.btn_primary}
              onPress={() => this.updateReview(shopData.location_id)}>
              <Text style={styles.btn_text}>{translate('update_review')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btn_primary}
              onPress={() => this.createReview(shopData.location_id)}>
              <Text style={styles.btn_text}>{translate('post_review')}</Text>
            </TouchableOpacity>
          )}
        </Content>
      </Container>
    );
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
  title: {
    color: '#313638',
    fontSize: 20,
  },
  header_right: {
    flex: 1,
  },
  content: {},
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
});

export default AddReview;
