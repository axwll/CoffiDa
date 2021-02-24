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
import ThemeProvider from '../utils/theme-provider';

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
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({ userId: await getItem('USER_ID') });

    this._onFocusListener = this.props.navigation.addListener(
      'didFocus',
      async() => {
        this.setState({ loading: true });

        await this.getUserInfo(this.state.userId);
        await this.getLocation();
        await this.checkIfAlreadyFavorited();

        this.setState({ loading: false });
      },
    );
  }

  componentWillUnmount() {
    this._onFocusListener.remove();
  }

  getUserInfo = async(userId) => {
    const response = await this.apiRequests.get(`/user/${userId}`);

    if (response) {
      this.setState({ currentUser: response });
    }
  };

  getLocation = async() => {
    const { locationId } = this.state;
    const response = await this.apiRequests.get(`/location/${locationId}`);

    if (response) {
      this.setState({ shopData: response });
    }
  };

  checkIfAlreadyFavorited = () => {
    const favLocations = this.state.currentUser.favourite_locations;
    if (favLocations.length !== 0) {
      favLocations.forEach((favs) => {
        if (favs.location_id === this.state.locationId) {
          // User has already favorited the location
          this.setState({ favorite: true });
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

  favLocation = async() => {
    const { locationId } = this.state;
    const response = await this.apiRequests.post(
      `/location/${locationId}/favourite`,
    );

    if (response) {
      this.setState({ favorite: true });
    }
  };

  unFavLocation = async() => {
    const { locationId } = this.state;

    const response = await this.apiRequests.delete(
      `/location/${locationId}/favourite`,
    );

    if (response === 'OK') {
      this.setState({ favorite: false });
    }
  };

  navigate = (screenName) => {
    this.props.navigation.navigate(screenName, {
      shopData: this.state.shopData,
    });
  };

  render() {
    const themeStyles = ThemeProvider.getTheme();

    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    }
    return (
      <Container style={themeStyles.container}>
        <Header style={[styles.header, themeStyles.background_color]}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={themeStyles.color_primary.color}
                onPress={() => this.props.navigation.goBack()}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={themeStyles.color_dark}>
              {this.state.shopData.location_name}
            </Title>
          </Body>

          <Right style={styles.header_right}>
            <FontAwesomeIcon
              icon={this.state.favorite ? faStarSolid : faStarRegular}
              size={20}
              color={themeStyles.color_primary.color}
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
                  source={{ uri: this.state.shopData.photo_path }}
                  style={{ height: 200, width: 100, flex: 1 }}
                />
              </CardItem>
              <CardItem style={styles.carditem_two}>
                <View style={styles.icon}>
                  <FontAwesomeIcon
                    icon={faPlus}
                    size={20}
                    color={themeStyles.color_primary.color}
                    onPress={() => this.navigate('AddReview')}
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
                    color={themeStyles.color_primary.color}
                    onPress={() => this.navigate('Explore')}
                  />
                </View>
              </CardItem>
              <CardItem style={styles.reviews_card}>
                <ReviewIcon
                  name={translate('price')}
                  rating={this.state.shopData.avg_price_rating}
                  rotate
                />
                <ReviewIcon
                  name={translate('cleanliness')}
                  rating={this.state.shopData.avg_clenliness_rating}
                  rotate
                />
                <ReviewIcon
                  name={translate('quality')}
                  rating={this.state.shopData.avg_quality_rating}
                  rotate
                />
              </CardItem>
            </Card>

            <View style={styles.sub_heading_view}>
              <Title style={themeStyles.color_dark}>
                {translate('raiting_review')}
              </Title>
            </View>

            {this.state.shopData.location_reviews.length === 0 ? (
              <View style={styles.btn_view}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    themeStyles.primary_button_color_outline,
                  ]}
                  onPress={() => this.navigate('AddReview')}>
                  <Text style={styles.btn_text}>
                    {translate('add_review')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              this.state.shopData.location_reviews.map((review) => (
                <ReviewCard
                  key={review.review_id}
                  shopReview={review}
                  locationId={this.state.shopData.location_id}
                />
              ))
            )}
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    borderBottomWidth: 0.5,
  },
  header_left: {
    flex: 1,
  },
  header_body: {
    flex: 4,
    alignItems: 'center',
  },
  sub_heading_view: {
    flex: 1,
    alignItems: 'center',
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
  },
});

export default SelectedShop;
