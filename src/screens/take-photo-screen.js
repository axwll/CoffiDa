import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';
import { toast } from '../utils/toast';

class TakePhoto extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));
    this.themeStyles = ThemeProvider.getTheme();
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);

      const locationId = this.props.navigation.getParam('locationId');
      const reviewId = this.props.navigation.getParam('reviewId');

      const response = await this.apiRequests.post(
        `/location/${locationId}/review/${reviewId}/photo`,
        data,
        false,
        'image/jpeg',
      );

      if (response === 'OK') {
        toast(translate('photo_added_toast'));

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
            style={[styles.button, this.themeStyles.background_color]}>
            <FontAwesomeIcon
              icon={faCamera}
              style={this.themeStyles.color_medium}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TakePhoto;
