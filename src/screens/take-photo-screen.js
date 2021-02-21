import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import ApiRequests from '../utils/api-requests';
import { toast } from '../utils/toast';

class TakePhoto extends Component {
  constructor(props) {
    super(props);
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);

      const locationId = this.props.navigation.getParam('locationId');
      const reviewId = this.props.navigation.getParam('reviewId');

      const response = ApiRequests.post(
        `/location/${locationId}/review/${reviewId}/photo`,
        data,
        false,
        'image/jpeg',
      );

      if (response === 'OK') {
        toast('Picture Added');

        if (this.props.navigation.getParam('update')) {
          this.props.navigation.navigate('Profile');
          return;
        }

        this.props.navigation.navigate('SelectedShop', {
          locationId: locationId,
        });
      }
    }
  };

  render() {
    return (
      <View style={{flex: 1, width: '100%'}}>
        <RNCamera
          captureAudio={false} // Removes the CaptureAudio warning from screen
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
        />
        <View style={styles.button_wrap}>
          <TouchableOpacity
            onPress={() => {
              this.takePicture();
            }}
            style={styles.button}>
            <FontAwesomeIcon icon={faCamera} style={styles.icon} size={25} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0DFD5',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button_wrap: {
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    bottom: 0,
    right: 0,
  },
  button: {
    margin: 10,
    width: 50,
    height: 50,
    backgroundColor: '#E0DFD5',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'grey',
  },
});

export default TakePhoto;
