/* eslint-disable import/no-unresolved */
import { METER_FEET_CONVERSION_R, METER_MILES_CONVERSION_R } from '@env';
import { faMugHot, faSearchLocation, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { getDistance } from 'geolib';
import { Container, Icon, Input, Item } from 'native-base';
import React, { Component } from 'react';
import { Animated, Dimensions, Image, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import LoadingSpinner from '../components/loading-spinner';
import ReviewIcon from '../components/review-icon';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';
import toast from '../utils/toast';

async function requestPermssion() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'CoffiDa would like to access your location to show you nearby coffee shops.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use my location');
      return true;
    }
    console.log("You can't use my location");
    return false;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
let LATITUDE_DELTA = 0.0922;
let LONGITUDE_DELTA = 0.5;

class Explore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myLocation: null,
      locationPermission: false,
      loading: true,
      showCardList: false,
      showMarkers: false,
      locationsList: [],
      showSingleMarker: false,
      singleShop: {},
    };

    this.getNearbyLocations = this.getNearbyLocations.bind(this);
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.mapSetup();

    this._onFocusListener = this.props.navigation.addListener(
      'didFocus',
      async() => {
        this.setState({ loading: true });
        this.mapSetup();
      },
    );
  }

  componentWillUnmount() {
    this._onFocusListener.remove();
  }

  mapSetup = () => {
    this.findCoordinates()
      .then((coordinates) => {
        this.setState({ myLocation: coordinates });
      })
      .then(() => {
        const shopData = this.props.navigation.getParam('shopData');
        if (this.props.navigation.getParam('shopData')) {
          // Will have this prop if passed from 'SelectedShop'
          this.setShopLocation(shopData);
        }
      })
      .catch((err) => toast(err));

    this.setState({ loading: false });
  };

  findCoordinates = async() => {
    if (!this.state.locationPermission) {
      this.state.locationPermission = await requestPermssion();
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        //   resolve({ latitude: 53.38587, longitude: -2.1455589 });
        },
        (error) => reject(error.message),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        },
      );
    });
  };

  setShopLocation = (shopData) => {
    const shopLocation = {
      latitude: shopData.latitude,
      longitude: shopData.longitude,
    };

    shopData.distance_from_me = this.distanceBetween(
      this.state.myLocation,
      shopLocation,
    );

    this.setState({
      singleShop: {
        location: {
          latitude: shopData.latitude,
          longitude: shopData.longitude,
        },
        title: shopData.location_name,
        description: this.parseDistanceValue(shopData.distance_from_me),
      },
      showSingleMarker: true,
    });
  };

  getNearbyLocations = async() => {
    this.setState({
      showSingleMarker: false,
      showMyMarker: false,
    });
    LATITUDE_DELTA = 0.0922;
    LONGITUDE_DELTA = 0.5;

    const response = await this.apiRequests.get('/find');

    if (response) {
      response.forEach((location) => {
        location.distance_from_me = this.distanceBetween(
          this.state.myLocation,
          location,
        );
      });

      const sortedLocations = response.sort((a, b) => a.distance_from_me - b.distance_from_me);

      this.setState({
        showCardList: true,
        showMarkers: true,
        locationsList: sortedLocations.slice(0, 5),
      });
    }
  };

  distanceBetween = (location1, location2) => getDistance(
    { latitude: location1.latitude, longitude: location1.longitude },
    { latitude: location2.latitude, longitude: location2.longitude },
  );

  parseDistanceValue = (distance) => {
    if (distance < 160) {
      // 160 meters is 0.1 mile - any less than this show in feet
      const distanceInFeet = Math.round(distance * METER_FEET_CONVERSION_R);
      return `${distanceInFeet} ft`;
    }

    const distanceInMiles = distance * METER_MILES_CONVERSION_R;
    return `${distanceInMiles.toFixed(1)} miles`;
  };

  moveToMyLocation = () => {
    this.setState({
      showCardList: false,
      showMarkers: false,
      showSingleMarker: false,
      showMyMarker: true,
    });

    LONGITUDE_DELTA = 0.05;
    LATITUDE_DELTA = 0.05;

    this.findCoordinates()
      .then((coordinates) => {
        this.setState({ myLocation: coordinates });
      })
      .catch((err) => toast(err));
  };

  shouldShow = (stateBoolean) => {
    if (stateBoolean && this.state.locationsList.length > 0) {
      return true;
    }

    return false;
  };

  render() {
    const themeStyles = ThemeProvider.getTheme();

    if (!this.state.myLocation) {
      if (!this.state.locationPermission) return <LoadingSpinner size={50} />;

      return (
        <View style={styles.loading_view}>
          <Text style={[styles.btn_text, themeStyles.color_dark]}>
            {translate('cant_get_location')}
          </Text>
        </View>
      );
    }
    return (
      <Container style={styles.map_container}>
        <View style={styles.header}>
          <Item rounded style={[styles.srch, themeStyles.background_light]}>
            <Icon name='ios-search' />
            <Input
              placeholder={translate('search_box_placeholder')}
              onSubmitEditing={(event) => this.search(event.nativeEvent.text)}
            />
          </Item>
        </View>
        <View style={styles.button_view}>
          <TouchableOpacity
            style={[
              styles.text_button,
              themeStyles.background_light,
              themeStyles.color_primary,
            ]}
            onPress={() => this.getNearbyLocations()}>
            <FontAwesomeIcon
              icon={faMugHot}
              size={20}
              color={themeStyles.color_primary.color}
            />
            <Text style={[styles.btn_text, themeStyles.color_primary]}>
              {translate('find_coffee_shops_btn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.text_button,
              themeStyles.background_light,
              themeStyles.color_primary,
            ]}
            onPress={() => this.moveToMyLocation()}>
            <FontAwesomeIcon
              icon={faSearchLocation}
              size={20}
              color={themeStyles.color_primary.color}
            />
            <Text style={[styles.btn_text, themeStyles.color_primary]}>
              {translate('find_me_btn')}
            </Text>
          </TouchableOpacity>
        </View>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: this.state.myLocation.latitude,
            longitude: this.state.myLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: (LONGITUDE_DELTA * width) / height,
          }}>
          {/* This renders if the map is navigated to from 'SelectedShop' */}
          {this.state.showMyMarker && (
            <Marker
              coordinate={this.state.myLocation}
              title={'My location'}
              description={'I am here'}
            />
          )}

          {/* This renders if the 'find me' button is clicked*/}
          {this.state.showSingleMarker && (
            <Marker
              coordinate={this.state.singleShop.location}
              title={this.state.singleShop.title}
              description={this.state.singleShop.description}
            />
          )}

          {/* This renders if the 'find coffee shops' button is clicked*/}
          {this.shouldShow(this.state.showMarkers)
              && this.state.locationsList.map((location) => (
                <Marker
                  key={location.location_id}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title={location.location_name}
                  description={this.parseDistanceValue(
                    location.distance_from_me,
                  )}
                />
              ))}
        </MapView>
        {this.shouldShow(this.state.showCardList) && (
          <View style={styles.card_view}>
            <TouchableOpacity
              style={[
                styles.text_button,
                styles.close_button,
                themeStyles.background_light,
                themeStyles.color_primary,
              ]}
              onPress={() => this.setState({ showCardList: false })}>
              <FontAwesomeIcon
                icon={faTimes}
                size={15}
                color={themeStyles.color_primary.color}
              />
            </TouchableOpacity>

            <Animated.ScrollView
              horizontal
              pagingEnabled
              scrollEventThrottle={1}
              showHorizontalScrollIndicator={false}
              snapToAlignment='center'>
              {this.state.locationsList.map((location, index) => (
                <View
                  style={[styles.card, themeStyles.background_light]}
                  key={index}>
                  <Image
                    source={{ uri: location.photo_path }}
                    style={styles.card_image}
                    resizeMode='cover'
                  />
                  <View style={styles.text_content}>
                    <Text>{location.location_name}</Text>
                    <View style={styles.review}>
                      <View style={styles.review_icon}>
                        <ReviewIcon
                          rating={location.avg_overall_rating}
                          primary
                        />
                      </View>

                      <Text>({location.location_reviews.length})</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        themeStyles.primary_button_color_outline,
                      ]}>
                      <Text
                        style={[
                          styles.btn_text,
                          themeStyles.color_primary,
                        ]}>
                        {translate('more_info_btn')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </Animated.ScrollView>
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card_view: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    marginBottom: 10,
    height: 250,
  },
  card: {
    borderRadius: 5,
    marginHorizontal: 20,
    height: 250,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  card_Image: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  text_content: {
    flex: 2,
    padding: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  review: {
    flexDirection: 'row',
  },
  review_icon: {
    alignItems: 'flex-start',
    paddingRight: 5,
  },
  map_container: {
    flex: 1,
  },
  header: {
    zIndex: 1,
    margin: 10,
    height: 50,
    position: 'absolute',
    alignItems: 'flex-end',
    left: 0,
    top: 0,
    right: 0,
  },
  srch: {
    flex: 9,
  },
  button_view: {
    zIndex: 1,
    position: 'absolute',
    top: 60, // height of the search bar + margin
    flexDirection: 'row',
  },
  text_button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingLeft: 10,
    borderRadius: 20,
  },
  close_button: {
    position: 'absolute',
    right: 0,
    bottom: 250, // height of the card
    padding: 10,
    borderRadius: 100,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  btn: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
  },
  btn_text: {
    padding: 10,
    alignItems: 'center',
  },
  loading_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  load_text: {
    fontSize: 20,
  },
});

export default Explore;
