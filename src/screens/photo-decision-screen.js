import {Container} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {translate} from '../locales';
import ApiRequests from '../utils/api-requests';
import {getItem} from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';
import {toast} from '../utils/toast';

class PhotoDecision extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yesPressed: false,
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({
      locationId: this.props.navigation.getParam('locationId'),
      reviewId: this.props.navigation.getParam('reviewId'),
      displayText: this.props.navigation.getParam('displayText'),
      updateReview: this.props.navigation.getParam('updateReview'),
      deleteReview: this.props.navigation.getParam('deleteReview'),
    });
  }

  yesClicked = async () => {
    const locationId = this.state.locationId;
    const reviewId = this.state.reviewId;

    if (!this.state.deleteReview) {
      this.props.navigation.navigate('TakePhoto', {
        locationId: locationId,
        reviewId: reviewId,
        update: true,
      });
      return;
    }

    const response = await this.apiRequests.delete(
      `/location/${locationId}/review/${reviewId}/photo`,
    );

    if (response === 'OK') {
      toast(translate('photo_deleted_toast'));
      this.props.navigation.navigate('Profile');
    }
  };

  noClicked = () => {
    if (this.state.updateReview || this.state.deleteReview) {
      this.props.navigation.navigate('Profile');
      return;
    }

    this.props.navigation.navigate('SelectedShop', {
      locationId: this.state.locationId,
    });
  };

  render() {
    const themeStyles = ThemeProvider.getTheme();

    return (
      <Container style={[styles.container, themeStyles.background_color]}>
        <View style={styles.content}>
          <Text style={styles.header_text}>{this.state.displayText}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, themeStyles.primary_button_color]}
              onPress={() => this.yesClicked()}>
              <Text style={[styles.btn_text, themeStyles.color_light]}>
                {translate('yes')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, themeStyles.secondary_button_color]}
              onPress={() => this.noClicked()}>
              <Text style={[styles.btn_text, themeStyles.color_light]}>
                {translate('no')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    margin: 15,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  btn_text: {
    padding: 10,
    alignItems: 'center',
  },
});

export default PhotoDecision;
