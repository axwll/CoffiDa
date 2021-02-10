import {
  faHeart as faHeartRegular,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import {
  faHeart as faHeartSolid,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Button, Card, CardItem, Left, Right} from 'native-base';
import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {withNavigation} from 'react-navigation';

import {translate} from '../../locales';
import {getItem, setItem} from '../common/async-storage-helper';
import ReviewIcon from '../common/review-icon';

class Reviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingMessage: 'Loading data',
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
      userInfo: JSON.parse(await getItem('USER_DATA')),
    });

    this.setState({loading: false});
  }

  deleteReview = (locationId, reviewId) => {
    this.setState({
      loading: true,
      loadingMessage: 'Deleting review',
    });
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}`,
      {
        method: 'DELETE',
        headers: {'x-Authorization': this.state.token},
      },
    )
      .then(() => {
        this.getUserInfo();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editReview = (data) => {
    this.props.navigation.navigate('AddReview', {
      reviewData: data.review,
      update: true,
      shopData: data.location,
    });

    // this.setState({
    //   loading: true,
    //   loadingMessage: 'Deleting review',
    // });
    // return fetch(
    //   `http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}`,
    //   {
    //     method: 'DELETE',
    //     headers: {'x-Authorization': this.state.token},
    //   },
    // )
    //   .then(() => {
    //     this.getUserInfo();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  getUserInfo = () => {
    const userId = this.state.userInfo.user_id;

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`, {
      headers: {
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setItem('USER_DATA', JSON.stringify(responseJson));
        this.setState({
          userInfo: responseJson,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.loading) {
      return <Text>{this.state.loadingMessage}</Text>;
    } else {
      return (
        <ScrollView>
          {this.state.userInfo.reviews.map((item) => {
            return (
              <Card key={item.review.review_id}>
                <CardItem style={styles.first_item}>
                  <Left>
                    <Text style={styles.user}>
                      {item.location.location_name}
                    </Text>
                  </Left>

                  <Right>
                    <ReviewIcon
                      rating={item.review.overall_rating}
                      size={15}
                      spacing={5}
                    />
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>{item.review.review_body}</Text>
                  </Left>

                  <Right>
                    <Text style={styles.light_text}>
                      {translate('price')}: {item.review.price_rating}/5
                    </Text>
                    <Text style={styles.light_text}>
                      {translate('cleanliness')}:{' '}
                      {item.review.review_clenlinessrating}
                      /5
                    </Text>
                    <Text style={styles.light_text}>
                      {translate('quality')}: {item.review.quality_rating}
                      /5
                    </Text>
                  </Right>
                </CardItem>
                <CardItem style={styles.last_item}>
                  <Left>
                    <Button transparent style={styles.light_text}>
                      <FontAwesomeIcon
                        icon={this.state.liked ? faHeartSolid : faHeartRegular}
                        size={15}
                        color={'#818181'}
                        // onPress={() =>
                        //   this.likeButtonPressed(locationId, review.review_id)
                        // }
                      />
                    </Button>
                    <Text style={styles.like_count}>{item.review.likes}</Text>
                  </Left>

                  <Right style={styles.footer_right}>
                    <Button transparent style={styles.pencil_btn}>
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        size={15}
                        color={'#F06543'}
                        onPress={() => this.editReview(item)}
                      />
                    </Button>

                    <Button transparent style={styles.trash_btn}>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        size={15}
                        color={'#F06543'}
                        onPress={() =>
                          this.deleteReview(
                            item.location.location_id,
                            item.review.review_id,
                          )
                        }
                      />
                    </Button>
                  </Right>
                </CardItem>
              </Card>
            );
          })}
        </ScrollView>
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
  footer_right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pencil_btn: {
    paddingRight: 15,
  },
  trash_btn: {},
});

export default withNavigation(Reviews);
