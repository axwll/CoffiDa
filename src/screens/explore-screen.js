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
import { toast } from '../utils/toast';

// import {mapDarkStyle} from '../styles/map-style';
async function requestPermssion(params) {
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
    } else {
      console.log("You can't use my location");
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}

let apiRequests = null;
let mapRef = null;
const {width, height} = Dimensions.get('window');
const CARD_WIDTH = width - 40;
let LATITUDE_DELTA = 0.0922;
let LONGITUDE_DELTA = 0.5;

class Explore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      locationPermission: false,
      loading: true,
      clicked: false,
      showCards: false,
      showMarkers: false,
      locationsList: [],
    };

    this.getNearbyLocations = this.getNearbyLocations.bind(this);
  }

  async componentDidMount() {
    apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.findCoordinates();

    this.setState({loading: false});
  }

  findCoordinates = async () => {
    if (!this.state.locationPermission) {
      this.state.locationPermission = await requestPermssion();
    }

    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          //   location: position.coords,
          location: {
            accuracy: 603,
            altitude: 0,
            heading: 90,
            latitude: 53.38587,
            longitude: -2.1455589,
            speed: 0,
          },
        });
      },
      (error) => {
        toast(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  getNearbyLocations = async () => {
    this.setState({showMyMarker: false});
    LATITUDE_DELTA = 0.0922;
    LONGITUDE_DELTA = 0.5;

    const response = await apiRequests.get('/find');

    if (response) {
      const myLocation = this.state.location;
      response.forEach((location) => {
        location.distance_from_me = getDistance(
          {latitude: myLocation.latitude, longitude: myLocation.longitude},
          {latitude: location.latitude, longitude: location.longitude},
        );
      });

      const sortedLocations = response.sort(function (a, b) {
        return a.distance_from_me - b.distance_from_me;
      });

      this.setState({
        showCards: true,
        showMarkers: true,
        locationsList: sortedLocations.slice(0, 9),
      });
    }
  };

  parseDistanceValue = (distance) => {
    if (distance < 160) {
      // 160 meters is 0.1 mile - any less than this show in feet
      const distanceInFeet = Math.round(distance * METER_FEET_CONVERSION_R);
      return distanceInFeet + ' ft';
    }

    const distanceInMiles = distance * METER_MILES_CONVERSION_R;
    return distanceInMiles.toFixed(1) + ' miles';
  };

  moveToMyLocation = () => {
    const myLocation = this.state.location;

    this.setState({
      showCards: false,
      showMarkers: false,
      showMyMarker: true,
      location: myLocation,
    });
    LONGITUDE_DELTA = 0.005;
    LATITUDE_DELTA = 0.005;
  };

  shouldShow = (stateBoolean) => {
    if (stateBoolean && this.state.locationsList.length > 0) {
      return true;
    }

    return false;
  };

  render() {
    if (!this.state.location) {
      if (!this.state.locationPermission) return <LoadingSpinner size={50} />;

      return (
        <View style={styles.loading_view}>
          <Text style={styles.load_text}>{translate('cant_get_location')}</Text>
        </View>
      );
    } else {
      return (
        <Container style={styles.map_container}>
          <View style={styles.header}>
            <Item rounded style={styles.srch}>
              <Icon name="ios-search" />
              <Input
                placeholder={translate('search_box_placeholder')}
                onSubmitEditing={(event) => this.search(event.nativeEvent.text)}
              />
            </Item>
          </View>
          <View style={styles.button_view}>
            <TouchableOpacity
              style={styles.text_button}
              onPress={() => this.getNearbyLocations()}>
              <FontAwesomeIcon icon={faMugHot} size={20} color={'#F06543'} />
              <Text style={styles.btn_text}>
                {translate('find_coffee_shops_btn')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.text_button}
              onPress={() => this.moveToMyLocation()}>
              <FontAwesomeIcon
                icon={faSearchLocation}
                size={20}
                color={'#F06543'}
              />
              <Text style={styles.btn_text}>{translate('find_me_btn')}</Text>
            </TouchableOpacity>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            // customMapStyle={mapDarkStyle}
            region={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: (LONGITUDE_DELTA * width) / height,
            }}>
            {this.state.showMyMarker && (
              <Marker
                coordinate={this.state.location}
                title={'My location'}
                description={'I am here'}
              />
            )}

            {this.shouldShow(this.state.showMarkers) &&
              this.state.locationsList.map((location, index) => {
                return (
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
                );
              })}
          </MapView>
          {this.shouldShow(this.state.showCards) && (
            <View style={styles.card_view}>
              <TouchableOpacity
                style={[styles.text_button, styles.close_button]}
                onPress={() => this.setState({showCards: false})}>
                <FontAwesomeIcon icon={faTimes} size={15} color={'#F06543'} />
              </TouchableOpacity>

              <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={1}
                showHorizontalScrollIndicator={false}
                snapToAlignment="center">
                {this.state.locationsList.map((location, index) => {
                  return (
                    <View style={styles.card} key={index}>
                      <Image
                        source={{uri: location.photo_path}}
                        style={styles.card_image}
                        resizeMode="cover"
                      />
                      <View style={styles.text_content}>
                        <Text>{location.location_name}</Text>
                        <View style={styles.review}>
                          <View style={styles.review_icon}>
                            <ReviewIcon
                              rating={location.avg_overall_rating}
                              primary={true}
                            />
                          </View>

                          <Text>({location.location_reviews.length})</Text>
                        </View>
                        <TouchableOpacity style={styles.btn}>
                          <Text style={styles.btn_text}>
                            {translate('more_info_btn')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </Animated.ScrollView>
            </View>
          )}
        </Container>
      );
    }
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
    color: '#F06543',
    backgroundColor: '#FFFFFF',
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
    borderColor: '#F06543',
  },
  btn_text: {
    padding: 10,
    color: '#F06543',
    alignItems: 'center',
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

export default Explore;
