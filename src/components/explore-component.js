import React, { Component } from 'react';
import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { translate } from '../locales';
import { toast } from './common/helper-functions';

async function requestPermssion(params) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'CoffiDa would like to access your location to show you nearby coffee shops.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      return true;
    } else {
      console.log('Camera permission denied');
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
    };
  }

  componentDidMount() {
    this.findCoordinates();
    this.setState({loading: false});
  }

  findCoordinates = () => {
    if (!this.state.locationPermission) {
      this.state.locationPermission = requestPermssion();
    }

    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({location: position.coords});
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

  render() {
    if (!this.state.location) {
      return (
        <View style={styles.loading_view}>
          <Text style={styles.load_text}>Loading</Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <Text>{translate('explore')}</Text>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{flex: 1}}
            region={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}>
            <Marker
              coordinate={this.state.location}
              title="My Location"
              description="Here I am"
            />
          </MapView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
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
