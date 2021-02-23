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
import { toast } from '../utils/toast';
import Validator from '../utils/validator';

let apiRequests = null;

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
    apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));
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
      toast(translate('empty_review_error_toast'));
      return false;
    }

    if (text.length > 500) {
      toast(translate('max_chars_error_toast'));
      return false;
    }

    return true;
  };

  createReview = async (locationId) => {
    let reviewBody = this.state.reviewBody;
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

    const response = await apiRequests.post(
      `/location/${locationId}/review`,
      postBody,
    );

    if (response) {
      toast(translate('review_created_toast'));
      this.props.navigation.goBack();
    }
  };

  render() {
    const shopData = this.props.navigation.getParam('shopData');

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
            <Title style={styles.title}>{translate('new_review')}</Title>
          </Body>
        </Header>

        <Content padder>
          <View>
            <Text style={styles.title}>{shopData.location_name}</Text>
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
              onChangeText={(text) => this.setState({reviewBody: text})}
            />
          </Form>

          <TouchableOpacity
            style={styles.btn_primary}
            onPress={() => this.createReview(shopData.location_id)}>
            <Text style={styles.btn_text}>{translate('post_review')}</Text>
          </TouchableOpacity>
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
    position: 'absolute',
    left: 10,
  },
  header_body: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#313638',
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
    marginTop: 10,
  },
  btn_text: {
    padding: 10,
    color: '#FFFFFF',
    alignItems: 'center',
  },
});

export default AddReview;
