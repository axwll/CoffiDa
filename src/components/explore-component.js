import {faSearchLocation} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {getDistance} from 'geolib';
import {Container, Icon, Input, Item} from 'native-base';
import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {getItem} from './common/async-storage-helper';
import {toast} from './common/helper-functions';
import LoadingSpinner from './common/loading-spinner';
import ReviewIcon from './common/review-icon';

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

const {width, height} = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
class Explore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      locationPermission: false,
      loading: true,
      clicked: false,
    };
  }

  async componentDidMount() {
    this.findCoordinates();

    this.setState({
      token: await getItem('AUTH_TOKEN'),
      loading: false,
    });
  }

  findCoordinates = async () => {
    if (!this.state.locationPermission) {
      this.state.locationPermission = await requestPermssion();
    }

    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
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

  getNearbyLocations = () => {
    return fetch(`http://10.0.2.2:3333/api/1.0.0/find`, {
      headers: {
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          // Unauthorized
          this.props.navigation.navigate('Auth');
          return;
        }
        return response.json();
      })
      .then((responseJson) => {
        const myLat = this.state.location.latitude;
        const myLong = this.state.location.longitude;
        responseJson.forEach((location) => {
          const distance = getDistance(
            {latitude: myLat, longitude: myLong},
            {latitude: location.latitude, longitude: location.longitude},
          );

          let conversion = 1;
          let suffix = 'm';
          if (distance < 1000) {
            conversion = 3.2808; // ENV VAR
            suffix = 'ft';
          } else {
            conversion = 0.000621371192; // ENV VAR
            suffix = 'miles';
          }

          const calculated = Math.round(distance * conversion);
          location.distance_from_me = `${calculated} ${suffix}`;

          console.log(location.distance_from_me);
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({loading: false});
      });
  };

  calculateDistance = (lat, long) => {};

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
          <View searchBar rounded style={styles.header}>
            <View style={styles.header2}>
              <Item rounded style={styles.srch}>
                <Icon name="ios-search" />
                <Input
                  placeholder="Search"
                  onSubmitEditing={(event) =>
                    this.search(event.nativeEvent.text)
                  }
                />
              </Item>
              <TouchableOpacity
                style={styles.search_location_icon}
                onPress={() => this.getNearbyLocations()}>
                <FontAwesomeIcon
                  icon={faSearchLocation}
                  style={{color: 'tomato'}}
                  size={25}
                />
              </TouchableOpacity>
            </View>
          </View>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            // customMapStyle={mapDarkStyle}
            region={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}>
            <Marker
              // Look ath Callout to edit the marker
              coordinate={this.state.location}
              title="My Location"
              description="Here I am"
            />
          </MapView>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            scrollEventThrottle={1}
            showHorizontalScrollIndicator={false}
            snapToAlignment="center"
            style={styles.scroll_view}>
            {data.map((location, index) => {
              return (
                // <Card style={styles.card} key={index}>
                //   <CardItem cardBody>
                //     <Image
                //       source={{uri: location.photo_path}}
                //       style={{height: 200, width: 100, flex: 1}}
                //     />
                //   </CardItem>
                //   <CardItem>
                //     <Left>
                //       <FontAwesomeIcon
                //         icon={faMapMarkerAlt}
                //         size={20}
                //         color={'#E0DFD5'}
                //         onPress={() => this.press()}
                //       />
                //       <Text>{location.location_town}</Text>
                //     </Left>

                //     <Right style={styles.right}>
                //       <Text>({location.location_reviews.length})</Text>
                //       <ReviewIcon
                //         rating={location.avg_overall_rating}
                //         primary={true}
                //       />
                //     </Right>
                //   </CardItem>
                // </Card>
                <View style={styles.card} key={index}>
                  <Image
                    source={{uri: location.photo_path}}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.textContent}>
                    <Text>{location.location_name}</Text>
                    {/* <View>
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        size={20}
                        color={'#E0DFD5'}
                        onPress={() => this.press()}
                      />
                      <Text>{location.location_town}</Text>
                    </View> */}

                    <View style={styles.review}>
                      <View style={styles.review_icon}>
                        <ReviewIcon
                          rating={location.avg_overall_rating}
                          primary={true}
                          style={{borderColor: 'red', borderWidth: 3}}
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
    marginTop: 5,
    marginLeft: 10,
    height: 45,
    position: 'absolute',
    alignItems: 'flex-end',
    left: 0,
    top: 0,
    right: 0,
  },
  header2: {
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
