import { faHeart as faHeartRegular, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, Card, CardItem, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import LoadingSpinner from '../../components/loading-spinner';
import ProfileReviewCard from '../../components/profile-review-card';
import { translate } from '../../locales';
import ApiRequests from '../../utils/api-requests';
import { getItem } from '../../utils/async-storage';
import ThemeProvider from '../../utils/theme-provider';

class Reviews extends Component {
  constructor(props) {
    super(props);

    this.themeStyles = ThemeProvider.getTheme();

    this.state = {
      loading: true,
      userInfo: [],
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({userId: await getItem('USER_ID')});

    this.getUserInfo();

    this._onFocusListener = this.props.navigation.addListener(
      'didFocus',
      async (payload) => {
        this.setState({loading: true});
        this.getUserInfo();
      },
    );
  }

  componentWillUnmount() {
    this._onFocusListener.remove();
  }

  getUserInfo = async () => {
    const userId = this.state.userId;

    const response = await this.apiRequests.get(`/user/${userId}`);

    if (response) {
      this.setState({userInfo: response});
    }

    this.setState({loading: false});
  };

  deleteReview = async (locationId, reviewId) => {
    const response = await this.apiRequests.delete(
      `/location/${locationId}/review/${reviewId}`,
    );

    if (response) {
      this.setState({loading: true});

      this.getUserInfo();
    }
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
            <Button transparent style={this.themeStyles.color_dark}>
              <FontAwesomeIcon
                icon={this.state.liked ? faHeartSolid : faHeartRegular}
                size={15}
                color={this.themeStyles.color_medium.color}
              />
            </Button>
            <Text style={styles.like_count}>{item.review.likes}</Text>
          </Left>

          <Right style={styles.footer_right}>
            <Button transparent style={styles.pencil_btn}>
              <FontAwesomeIcon
                icon={faPencilAlt}
                size={15}
                color={this.themeStyles.color_primary.color}
                onPress={() => this.editReview(item)}
              />
            </Button>

            <Button transparent style={styles.trash_btn}>
              <FontAwesomeIcon
                icon={faTrashAlt}
                size={15}
                color={this.themeStyles.color_primary.color}
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
        <Text style={[styles.load_text, this.themeStyles.color_dark]}>
          {translate('no_results')}
        </Text>
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
  },
});

export default Reviews;
