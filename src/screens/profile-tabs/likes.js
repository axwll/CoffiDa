import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, Card, CardItem, Left } from 'native-base';
import React, { Component } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import LoadingSpinner from '../../components/loading-spinner';
import ProfileReviewCard from '../../components/profile-review-card';
import { translate } from '../../locales';
import { getItem } from '../../utils/async-storage';

class Likes extends Component {
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
        console.log(responseJson);
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

  unlikeReview = (locationId, reviewId) => {
    this.setState({
      loading: true,
      loadingMessage: 'Removing like from reviw',
    });
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/like`,
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

  renderItem = ({item}) => {
    return (
      <Card key={item.review.review_id}>
        <ProfileReviewCard
          title={item.location.location_name}
          subHeading={item.location.location_town}
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
                icon={faHeartSolid}
                size={15}
                color={'#F06543'}
                onPress={() =>
                  this.unlikeReview(
                    item.location.location_id,
                    item.review.review_id,
                  )
                }
              />
            </Button>
            <Text style={styles.like_count}>{item.review.likes}</Text>
          </Left>
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
            data={this.state.userInfo.liked_reviews}
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
  last_item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  loading_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  load_text: {
    fontSize: 20,
    color: '#313638',
  },
});

export default Likes;
