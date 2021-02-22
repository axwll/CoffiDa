import { METER_FEET_CONVERSION_R, METER_MILES_CONVERSION_R } from '@env';
import { faMugHot, faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { getDistance } from 'geolib';
import { Container, Icon, Input, Item } from 'native-base';
import React, { Component } from 'react';
import { Animated, Dimensions, Image, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import LoadingSpinner from '../components/loading-spinner';
import ReviewIcon from '../components/review-icon';
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
class Explore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      locationPermission: false,
      loading: true,
      clicked: false,
      showCards: false,
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
        locationsList: sortedLocations.slice(0, 9),
      });
    }
  };

  parseDistanceValue = (distance) => {
    console.log(distance);
    if (distance < 160) {
      // 160 meters is 0.1 mile - any less than this show in feet
      const distanceInFeet = Math.round(distance * METER_FEET_CONVERSION_R);
      return distanceInFeet + ' ft';
    }

    const distanceInMiles = distance * METER_MILES_CONVERSION_R;
    return distanceInMiles.toFixed(1) + ' miles';
  };

  moveToMyLocation = () => {
    console.log('click');
    const myLocation = this.state.location;

    this.setState({location: myLocation});
  };

  shouldShow = () => {
    if (this.state.showCards && this.state.locationsList.length > 0) {
      return true;
    }

    return false;
  };

  fitToMarkers = () => {
    const markers = React.Children.map(
      this.props.children,
      (child) => child.props.coordinate,
    );
    const options = {
      edgePadding: {
        top: 500,
        right: 500,
        bottom: 500,
        left: 1500,
      },
      animated: false, // optional
    };
    mapRef.fitToCoordinates(markers, options);
  };

  render() {
    if (!this.state.location) {
      if (!this.state.locationPermission) return <LoadingSpinner size={50} />;

      return (
        <View style={styles.loading_view}>
          <Text style={styles.load_text}>Location could not be determined</Text>
        </View>
      );
    } else {
      return (
        <Container style={styles.map_container}>
          <View style={styles.header}>
            <Item rounded style={styles.srch}>
              <Icon name="ios-search" />
              <Input
                placeholder="Search"
                onSubmitEditing={(event) => this.search(event.nativeEvent.text)}
              />
            </Item>
          </View>
          <View style={styles.button_view}>
            <TouchableOpacity
              style={[styles.text_button, styles.near_me_btn]}
              onPress={() => this.getNearbyLocations()}>
              <FontAwesomeIcon
                // style={{margin: 5}}
                icon={faMugHot}
                size={20}
                color={'#F06543'}
              />
              <Text style={styles.btn_text}>Find Coffee Shops</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.text_button, styles.find_me_btn]}
              onPress={() => this.moveToMyLocation()}>
              <FontAwesomeIcon
                icon={faSearchLocation}
                size={20}
                color={'#F06543'}
              />
              <Text style={styles.btn_text}>Find Me</Text>
            </TouchableOpacity>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            // customMapStyle={mapDarkStyle}
            region={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            ref={(ref) => {
              mapRef = ref;
            }}
            // onLayout={this.fitToMarkers()}>
            onMapReady={() => {
              mapRef.fitToSuppliedMarkers([], {
                edgePadding: {
                  top: 500,
                  right: 100,
                  bottom: 100,
                  left: 100,
                },
              });
            }}>
            {this.shouldShow() &&
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
            {/* , )} */}
          </MapView>
          {this.shouldShow() && (
            <Animated.ScrollView
              horizontal
              pagingEnabled
              scrollEventThrottle={1}
              showHorizontalScrollIndicator={false}
              snapToAlignment="center"
              style={styles.scroll_view}>
              {this.state.locationsList.map((location, index) => {
                return (
                  <View style={styles.card} key={index}>
                    <Image
                      source={{uri: location.photo_path}}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    <View style={styles.textContent}>
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
                        <Text style={styles.btn_text}>More info</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </Animated.ScrollView>
          )}
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  scroll_view: {
    marginBottom: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  card: {
    borderRadius: 5,
    marginHorizontal: 20,
    height: 250,
    width: CARD_WIDTH,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
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
  search_bar_header: {
    flex: 1,
    flexDirection: 'row',
  },
  srch: {
    flex: 9,
    backgroundColor: 'white',
  },
  search_location_icon: {
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'tomato',
    backgroundColor: 'white',
    margin: 10,
    paddingLeft: 10,
    borderRadius: 20,
  },
  find_me_btn: {},
  near_me_btn: {},
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  map_buttons: {
    position: 'absolute',
    alignItems: 'flex-end',
    left: 0,
    bottom: 0,
    right: 0,
  },
  button: {
    marginRight: 10,
    marginBottom: 20,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'tomato',
  },
  card_scroll_view: {
    position: 'absolute',
    top: 80,
    paddingHorizontal: 10,
  },
  card_item: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
  },
  btn: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    // margin: 10,
    // marginRight: 5,
    borderColor: '#F06543',
  },
  btn_text: {
    padding: 10,
    color: '#F06543',
    alignItems: 'center',
  },
});

const data = [
  {
    location_id: 1,
    location_name: 'Just Coffee',
    location_town: 'London',
    photo_path:
      'https://cdnb.artstation.com/p/assets/images/images/027/245/631/large/bogdan-mb0sco-lw-summer-entry-previewhd.jpg?1591006318',
    latitude: 80,
    longitude: 0,
    avg_overall_rating: 3.8571,
    avg_price_rating: 4.2857,
    avg_quality_rating: 3.8571,
    avg_clenliness_rating: 3.1429,
    location_reviews: [
      {
        review_id: 1,
        review_location_id: 1,
        review_user_id: 1,
        review_overallrating: 4,
        review_pricerating: 5,
        review_qualityrating: 3,
        review_clenlinessrating: 4,
        review_body: 'Great atomosphere, great coffee',
        likes: 3,
      },
      {
        review_id: 3,
        review_location_id: 1,
        review_user_id: 1,
        review_overallrating: 3,
        review_pricerating: 3,
        review_qualityrating: 3,
        review_clenlinessrating: 3,
        review_body: "Not as good now that they've upped their prices",
        likes: 3,
      },
      {
        review_id: 14,
        review_location_id: 1,
        review_user_id: 8,
        review_overallrating: 5,
        review_pricerating: 5,
        review_qualityrating: 5,
        review_clenlinessrating: 5,
        review_body: 'great',
        likes: 0,
      },
      {
        review_id: 15,
        review_location_id: 1,
        review_user_id: 8,
        review_overallrating: 2,
        review_pricerating: 2,
        review_qualityrating: 2,
        review_clenlinessrating: 2,
        review_body: 'great',
        likes: 0,
      },
      {
        review_id: 17,
        review_location_id: 1,
        review_user_id: 8,
        review_overallrating: 5,
        review_pricerating: 5,
        review_qualityrating: 5,
        review_clenlinessrating: 4,
        review_body: 'execeptional',
        likes: 0,
      },
      {
        review_id: 18,
        review_location_id: 1,
        review_user_id: 8,
        review_overallrating: 4,
        review_pricerating: 5,
        review_qualityrating: 5,
        review_clenlinessrating: 2,
        review_body: 'outstanding',
        likes: 0,
      },
      {
        review_id: 19,
        review_location_id: 1,
        review_user_id: 8,
        review_overallrating: 4,
        review_pricerating: 5,
        review_qualityrating: 4,
        review_clenlinessrating: 2,
        review_body: 'bloody lovely',
        likes: 0,
      },
    ],
  },
  {
    location_id: 3,
    location_name: "Mary's",
    location_town: 'London',
    photo_path:
      'https://cdnb.artstation.com/p/assets/images/images/026/943/183/large/bogdan-mb0sco-polinn-preview-fullhd.jpg?1590154899',
    latitude: 80,
    longitude: 0,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 5,
    location_name: 'Just Coffee',
    location_town: 'Manchester',
    photo_path:
      'https://cdnb.artstation.com/p/assets/images/images/034/003/551/large/bogdan-mb0sco-wintersunrise-art2.jpg?1611145222',
    latitude: 80,
    longitude: 0,
    avg_overall_rating: 4,
    avg_price_rating: 5,
    avg_quality_rating: 3,
    avg_clenliness_rating: 4,
    location_reviews: [
      {
        review_id: 6,
        review_location_id: 5,
        review_user_id: 6,
        review_overallrating: 4,
        review_pricerating: 5,
        review_qualityrating: 3,
        review_clenlinessrating: 4,
        review_body: 'Service needs work, but always tastes alright',
        likes: 0,
      },
    ],
  },
  {
    location_id: 14,
    location_name: 'test5',
    location_town: 'mcr',
    photo_path: 'https://via.placeholder.com/800x400.png?text=No+Image+Found',
    latitude: 80,
    longitude: 80,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 2,
    location_name: 'Coffee',
    location_town: 'Manchester',
    photo_path:
      'https://cdnb.artstation.com/p/assets/images/images/022/005/763/large/bogdan-mb0sco-donnuts-hd.jpg?1584319974',
    latitude: 80,
    longitude: 0,
    avg_overall_rating: 4,
    avg_price_rating: 5,
    avg_quality_rating: 4,
    avg_clenliness_rating: 2.5,
    location_reviews: [
      {
        review_id: 4,
        review_location_id: 2,
        review_user_id: 3,
        review_overallrating: 4,
        review_pricerating: 5,
        review_qualityrating: 3,
        review_clenlinessrating: 4,
        review_body: 'I like the coffee',
        likes: 0,
      },
      {
        review_id: 16,
        review_location_id: 2,
        review_user_id: 8,
        review_overallrating: 4,
        review_pricerating: 5,
        review_qualityrating: 5,
        review_clenlinessrating: 1,
        review_body:
          'A quality establishment but not impressed by the filth of the bathrooms',
        likes: 0,
      },
    ],
  },
  {
    location_id: 4,
    location_name: "Ben's Diner",
    location_town: 'London',
    photo_path:
      'https://cdnb.artstation.com/p/assets/images/images/029/320/301/large/bogdan-mb0sco-loficoffee-hdpreview.jpg?1597164052',
    latitude: 80,
    longitude: 0,
    avg_overall_rating: 3.3333,
    avg_price_rating: 3.6667,
    avg_quality_rating: 3.6667,
    avg_clenliness_rating: 2,
    location_reviews: [
      {
        review_id: 2,
        review_location_id: 4,
        review_user_id: 1,
        review_overallrating: 1,
        review_pricerating: 1,
        review_qualityrating: 1,
        review_clenlinessrating: 0,
        review_body: 'Grim, and expensive',
        likes: 3,
      },
      {
        review_id: 5,
        review_location_id: 4,
        review_user_id: 6,
        review_overallrating: 5,
        review_pricerating: 5,
        review_qualityrating: 5,
        review_clenlinessrating: 5,
        review_body: 'Not sure what the problem is, I love it here',
        likes: 0,
      },
      {
        review_id: 13,
        review_location_id: 4,
        review_user_id: 8,
        review_overallrating: 4,
        review_pricerating: 5,
        review_qualityrating: 5,
        review_clenlinessrating: 1,
        review_body: 'Cracking Coffee, lovely environment but a grotty place',
        likes: 0,
      },
    ],
  },
  {
    location_id: 15,
    location_name: 'test6',
    location_town: 'mcr',
    photo_path: 'https://via.placeholder.com/800x400.png?text=No+Image+Found',
    latitude: 80,
    longitude: 80,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 16,
    location_name: 'test7',
    location_town: 'mcr',
    photo_path: 'https://via.placeholder.com/800x400.png?text=No+Image+Found',
    latitude: 80,
    longitude: 80,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 18,
    location_name: 'test9',
    location_town: 'mcr',
    photo_path: 'https://via.placeholder.com/800x400.png?text=No+Image+Found',
    latitude: 80,
    longitude: 80,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 17,
    location_name: 'test8',
    location_town: 'mcr',
    photo_path: 'https://via.placeholder.com/800x400.png?text=No+Image+Found',
    latitude: 80,
    longitude: 80,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 8,
    location_name: 'Lo-Fi Cafe',
    location_town: 'Chicago',
    photo_path:
      'https://cdnb.artstation.com/p/assets/images/images/033/249/367/large/bogdan-mb0sco-dmp-winter-cafe-hd.jpg?1608914403',
    latitude: 0,
    longitude: 0,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 12,
    location_name: 'The Jazz Hop Cafe',
    location_town: 'Tokyo',
    photo_path:
      'https://cdnb.artstation.com/p/assets/images/images/015/232/959/large/bogdan-mb0sco-chinastreetgallery.jpg?1588886924',
    latitude: 80,
    longitude: 80,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 6,
    location_name: 'Frozen Coffee',
    location_town: 'Japan',
    photo_path:
      'https://cdna.artstation.com/p/assets/images/images/022/520/876/large/bogdan-mb0sco-coffee-shop-snow-hdpreview.jpg?1584925104',
    latitude: 0,
    longitude: 0,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 19,
    location_name: 'test10',
    location_town: 'mcr',
    photo_path: 'https://via.placeholder.com/800x400.png?text=No+Image+Found',
    latitude: 80,
    longitude: 80,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
  {
    location_id: 13,
    location_name: 'Lonewolf Cafe',
    location_town: 'Newfoundland',
    photo_path:
      'https://cdnb.artstation.com/p/assets/images/images/027/246/271/large/bogdan-mb0sco-lw-summer-back-previewhd.jpg?1591007680',
    latitude: 80,
    longitude: 80,
    avg_overall_rating: 0,
    avg_price_rating: 0,
    avg_quality_rating: 0,
    avg_clenliness_rating: 0,
    location_reviews: [],
  },
];

export default Explore;
