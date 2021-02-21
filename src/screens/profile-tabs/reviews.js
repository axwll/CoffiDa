import { faHeart as faHeartRegular, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, Card, CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import LoadingSpinner from '../../components/loading-spinner';
import ProfileReviewCard from '../../components/profile-review-card';
import { translate } from '../../locales';
import { getItem } from '../../utils/async-storage';

class Reviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingMessage: 'Loading data',
      userInfo: [],
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
      userId: await getItem('USER_ID'),
    });

    this.getUserInfo();
  }

  getUserInfo = () => {
    const userId = this.state.userId;

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`, {
      headers: {
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          userInfo: responseJson,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({loading: false});
      });
  };

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
        this.findReviews();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editReview = (data) => {
    this.props.navigation.navigate('UpdateReview', {
      reviewData: data.review,
      shopData: data.location,
    });
  };

  renderItem = ({item}) => {
    return (
      <Card>
        <ProfileReviewCard
          title={item.location.location_name}
          body={item.review.review_body}
          overall_rate={item.review.overall_rating}
          price_rate={item.review.price_rating}
          clean_rate={item.review.clenliness_rating}
          qual_rate={item.review.quality_rating}
        />
        <CardItem style={styles.last_item}>
          <Left>
            <Button transparent style={styles.light_text}>
              <FontAwesomeIcon
                icon={this.state.liked ? faHeartSolid : faHeartRegular}
                size={15}
                color={'#818181'}
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
  };

  renderNoData = () => {
    return (
      <View style={styles.loading_view}>
        <Text style={styles.load_text}>{translate('no_results')}</Text>
      </View>
    );
  };

  render() {
    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.state.userInfo.reviews}
            renderItem={(item) => this.renderItem(item)}
            keyExtractor={(item) => item.review.review_id.toString()}
            // onEndReachedThreshold={0.01}
            // onEndReached={({distanceFromEnd}) =>
            //   this.handleLoadMore(distanceFromEnd)
            // }
            ListEmptyComponent={this.renderNoData()}
          />
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  loading_view: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  load_text: {
    fontSize: 20,
    color: '#313638',
  },
});

export default withNavigation(Reviews);
