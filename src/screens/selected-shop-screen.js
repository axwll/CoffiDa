import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faDirections, faPlus, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Card, CardItem, Container, Content, Header, Left, Right, Title } from 'native-base';
import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import LoadingSpinner from '../components/loading-spinner';
import ReviewCard from '../components/review-card';
import ReviewIcon from '../components/review-icon';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';

let locationId = null;
let apiRequests = null;

class SelectedShop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      favorite: false,
      locationId: this.props.navigation.getParam('locationId'),
      shopData: null,
    };
  }

  async componentDidMount() {
    apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({userId: await getItem('USER_ID')});

    this._onFocusListener = this.props.navigation.addListener(
      'didFocus',
      async (payload) => {
        this.setState({loading: true});

        await this.getUserInfo(this.state.userId);
        await this.getLocation();
        await this.checkIfAlreadyFavorited();

        this.setState({loading: false});
      },
    );
  }

  getUserInfo = async (userId) => {
    const response = await apiRequests.get(`/user/${userId}`);

    if (response) {
      this.setState({currentUser: response});
    }
  };

  getLocation = async () => {
    const locationId = this.state.locationId;
    const response = await apiRequests.get(`/location/${locationId}`);

    if (response) {
      this.setState({shopData: response});
    }
  };

  checkIfAlreadyFavorited = () => {
    const fav_locations = this.state.currentUser.favourite_locations;
    if (fav_locations.length !== 0) {
      fav_locations.forEach((favs) => {
        if (favs.location_id === this.state.locationId) {
          // User has already favorited the location
          this.setState({favorite: true});
          return;
        }
      });
    }
  };

  favButtonPressed = () => {
    if (this.state.favorite) {
      this.unFavLocation();
      return;
    }

    this.favLocation();
  };

  favLocation = async () => {
    const locationId = this.state.locationId;
    const response = await apiRequests.get(`/location/${locationId}/favourite`);

    if (response) {
      this.setState({favorite: true});
    }
  };

  unFavLocation = async () => {
    const locationId = this.state.locationId;

    const response = await apiRequests.delete(
      `/location/${locationId}/favourite`,
    );

    if (response === 'OK') {
      this.setState({favorite: false});
    }
  };

  getDirections = () => {
    this.props.navigation.navigate('Explore');
  };

  addReview = () => {
    this.props.navigation.navigate('AddReview', {
      shopData: this.state.shopData,
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    } else {
      return (
        <Container style={styles.container} key={this.state.locationId}>
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
              <Title style={styles.title}>
                {this.state.shopData.location_name}
              </Title>
            </Body>

            <Right style={styles.header_right}>
              <FontAwesomeIcon
                icon={this.state.favorite ? faStarSolid : faStarRegular}
                size={20}
                color={'#F06543'}
                onPress={() => this.favButtonPressed()}
              />
            </Right>
          </Header>

          <Content style={styles.content} padder>
            {/* Switch to flatlist */}
            <ScrollView>
              <Card>
                <CardItem cardBody button>
                  <Image
                    source={{uri: this.state.shopData.photo_path}}
                    style={{height: 200, width: 100, flex: 1}}
                  />
                </CardItem>
                <CardItem style={styles.carditem_two}>
                  <View style={styles.icon}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      size={20}
                      color={'#F06543'}
                      onPress={() => this.addReview()}
                    />
                  </View>
                  <View style={styles.num_reviews}>
                    <Text>
                      {this.state.shopData.location_reviews.length}{' '}
                      {translate('reviews_for')}{' '}
                      {this.state.shopData.location_name},{' '}
                      {this.state.shopData.location_town}
                    </Text>
                  </View>
                  <View style={styles.icon}>
                    <FontAwesomeIcon
                      icon={faDirections}
                      size={20}
                      color={'#F06543'}
                      onPress={() => this.getDirections()}
                    />
                  </View>
                </CardItem>
                <CardItem style={styles.reviews_card}>
                  <ReviewIcon
                    name="Price"
                    rating={this.state.shopData.avg_price_rating}
                    rotate={true}
                  />
                  <ReviewIcon
                    name="Cleanliness"
                    rating={this.state.shopData.avg_clenliness_rating}
                    rotate={true}
                  />
                  <ReviewIcon
                    name="Quality"
                    rating={this.state.shopData.avg_quality_rating}
                    rotate={true}
                  />
                </CardItem>
              </Card>

              <View style={styles.sub_heading_view}>
                <Title style={styles.sub_heading_text}>
                  {translate('raiting_review')}
                </Title>
              </View>

              {this.state.shopData.location_reviews.length === 0 ? (
                <View style={styles.btn_view}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.addReview()}>
                    <Text style={styles.btn_text}>Add a Review</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                this.state.shopData.location_reviews.map((review) => {
                  return (
                    <ReviewCard
                      key={review.review_id}
                      shopReview={review}
                      locationId={this.state.shopData.location_id}
                    />
                  );
                })
              )}
            </ScrollView>
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
    flex: 4,
    alignItems: 'center',
  },
  title: {
    color: '#313638',
  },
  sub_heading_view: {
    flex: 1,
    alignItems: 'center',
  },
  sub_heading_text: {
    color: '#313638',
  },
  header_right: {
    flex: 1,
  },
  carditem_two: {
    flex: 1,
    flexDirection: 'row',
  },
  num_reviews: {
    flex: 10,
    alignItems: 'center',
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviews_card: {
    height: 200,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn_view: {
    alignItems: 'center',
  },
  button: {
    width: '50%',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    padding: 10,
    marginRight: 5,
    borderColor: '#F06543',
  },
});

export default SelectedShop;
