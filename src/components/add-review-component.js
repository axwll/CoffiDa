import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Body,
  Button,
  Container,
  Content,
  Form,
  Header,
  Left,
  Textarea,
  Title,
} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Stars from 'react-native-stars';

import Empty from '../assets/ratings/rating-empty-primary.png';
import Full from '../assets/ratings/rating-full-primary.png';
import {getItem} from './common/async-storage-helper';
import {profanityFilter, toast} from './common/helper-functions';

// import {profanityFilter} from './common/helper-functions';
class AddReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overallRating: 0,
      priceRating: 1,
      cleanRating: 1,
      qualRating: 1,
      reviewBody: '',
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
    });

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

  leaveReview = (locationId) => {
    const validReview = this.validateReview(this.state.reviewBody);
    if (!validReview) {
      // Dont store an invalid review
      // set a bool here to show some error text
      return;
    }

    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-Authorization': this.state.token,
        },
        body: JSON.stringify({
          overall_rating: this.state.overallRating,
          price_rating: this.state.priceRating,
          quality_rating: this.state.qualRating,
          clenliness_rating: this.state.cleanRating,
          review_body: validReview,
        }),
      },
    )
      .then((response) => {
        toast('Review created!');
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.log(error.status);
        // response.status
        console.log('err');
        console.log(error);
      });
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
            <Title style={styles.title}>Add new review</Title>
          </Body>
        </Header>

        <Content padder>
          <View>
            <Text>{shopData.location_name}</Text>
          </View>

          <View style={styles.review_container}>
            {/* Price Rating Buttons */}
            <View style={styles.review_section}>
              <View style={styles.review_rating}>
                <Stars
                  //   half={true}
                  default={this.state.priceRating}
                  update={(rating) => {
                    this.updateState('priceRating', rating);
                  }}
                  spacing={4}
                  starSize={20}
                  count={5}
                  fullStar={Full}
                  emptyStar={Empty}
                  //   halfStar={Half}
                />
              </View>
              <View style={styles.review_description}>
                <Text>Price</Text>
              </View>
            </View>

            {/* Cleanliness Rating Buttons */}
            <View style={styles.review_section}>
              <View style={styles.review_rating}>
                <Stars
                  //   half={true}
                  default={this.state.cleanRating}
                  update={(rating) => {
                    this.updateState('cleanRating', rating);
                  }}
                  spacing={4}
                  starSize={20}
                  count={5}
                  fullStar={Full}
                  emptyStar={Empty}
                  //   halfStar={Half}
                />
              </View>
              <View style={styles.review_description}>
                <Text>Cleanliness</Text>
              </View>
            </View>

            {/* Quality Rating Buttons */}
            <View style={styles.review_section}>
              <View style={styles.review_rating}>
                <Stars
                  //   half={true}
                  default={this.state.qualRating}
                  update={(rating) => {
                    this.updateState('qualRating', rating);
                  }}
                  spacing={4}
                  starSize={20}
                  count={5}
                  fullStar={Full}
                  emptyStar={Empty}
                  //   halfStar={Half}
                />
              </View>
              <View style={styles.review_description}>
                <Text>Quality</Text>
              </View>
            </View>
          </View>

          <View>
            <Text>Overall Rating: {this.state.overallRating}</Text>
          </View>

          <Form>
            <Textarea
              rowSpan={5}
              bordered
              placeholder="Leave your review..."
              onChangeText={(text) => this.setState({reviewBody: text})}
            />
          </Form>

          <TouchableOpacity
            style={styles.btn_primary}
            onPress={() => this.leaveReview(shopData.location_id)}>
            <Text style={styles.btn_text}>Post review</Text>
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
    flex: 1,
  },
  header_body: {
    flex: 4,
    alignItems: 'center',
  },
  title: {
    color: '#313638',
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
