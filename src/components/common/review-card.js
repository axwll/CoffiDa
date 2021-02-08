import {faHeart} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Button, Card, CardItem, Left, Right} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';

import {getItem} from '../common/async-storage-helper';
import Star from '../common/star';

class ReviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      reviewUser: null,
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
    });

    this.getUserFromId(this.props.shopReview.review_user_id);
  }

  getUserFromId = (userId) => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + userId, {
      headers: {
        'x-Authorization': this.state.token, // PLS chnage this
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          reviewUser: responseJson,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  };

  likeReview = () => {
    if (this.props.shopReview.likes !== 0) {
      console.log('check');
      //   this.checkIfAlreadyLiked();
    }

    console.log('done');
    // console.log(this.props.shopReview);
  };

  //   checkIfAlreadyLiked() {
  //     console.log(this.state.currentUser);
  //     const liked_reviews = this.state.currentUser.liked_reviews;
  //     if (liked_reviews.length === 0) {
  //       // User has no existing reviews
  //       console.log('User has no existing reviews');

  //       return false;
  //     }

  //     liked_reviews.forEach((like) => {
  //       if (like.review.review_id === this.props.shopReview.review_id) {
  //         // User has already liked this review
  //         console.log('User has already liked this review');

  //         return true;
  //       }
  //     });

  // User has not previously liked the review
  //     console.log('User has not previously liked the review');

  //     return false;
  //   }

  render() {
    if (this.state.loading) {
      return <Text>Waiting for data</Text>;
    } else {
      const review = this.props.shopReview;

      return (
        <Card>
          <CardItem style={styles.first_item}>
            <Left>
              <Text style={styles.user}>
                User: {this.state.reviewUser.first_name}{' '}
                {this.state.reviewUser.last_name}
              </Text>
            </Left>

            <Right>
              <Star
                rating={review.review_overallrating}
                size={15}
                spacing={5}
              />
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Text>{review.review_body}</Text>
            </Left>

            <Right>
              <Text style={styles.light_text}>
                Price: {review.review_pricerating}/5
              </Text>
              <Text style={styles.light_text}>
                Cleanliness: {review.review_clenlinessrating}/5
              </Text>
              <Text style={styles.light_text}>
                Quality: {review.review_qualityrating}/5
              </Text>
            </Right>
          </CardItem>
          <CardItem style={styles.last_item}>
            <Left>
              <Button transparent style={styles.light_text}>
                <FontAwesomeIcon
                  icon={faHeart}
                  size={15}
                  color={'#F06543'}
                  onPress={() => this.likeReview()}
                />
              </Button>
              <Text style={styles.like_count}>{review.likes}</Text>
            </Left>
          </CardItem>
        </Card>
      );
    }
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
