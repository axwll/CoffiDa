import {faCompass} from '@fortawesome/free-regular-svg-icons';
import {faSearchLocation} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {getDistance} from 'geolib';
import {Container, Icon, Input, Item} from 'native-base';
import React, {Component} from 'react';
import {
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
            region={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}>
            <Marker
              coordinate={this.state.location}
              title="My Location"
              description="Here I am"
            />
          </MapView>
          <View style={styles.map_buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({clicked: true})}>
              <FontAwesomeIcon icon={faCompass} style={styles.icon} size={35} />
            </TouchableOpacity>
          </View>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
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
});

export default Explore;
