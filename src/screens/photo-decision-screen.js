import { Container } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ApiRequests from '../utils/api-requests';
import { toast } from '../utils/toast';

class PhotoDecision extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yesPressed: false,
    };
  }

  componentDidMount() {
    this.setState({
      locationId: this.props.navigation.getParam('locationId'),
      reviewId: this.props.navigation.getParam('reviewId'),
      displayText: this.props.navigation.getParam('displayText'),
      updateReview: this.props.navigation.getParam('updateReview'),
      deleteReview: this.props.navigation.getParam('deleteReview'),
    });
  }

  yesClicked = () => {
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

    const response = ApiRequests.delete(
      `/location${locationId}/review/${reviewId}/photo`,
    );

    if (response === 'OK') {
      toast('Review photo deleted');
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
    return (
      <Container style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header_text}>{this.state.displayText}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.btn_primary]}
              onPress={() => this.yesClicked()}>
              <Text style={styles.btn_text}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.btn_secondary]}
              onPress={() => this.noClicked()}>
              <Text style={styles.btn_text}>No</Text>
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
    backgroundColor: '#E8E9EB',
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
  btn_primary: {
    borderColor: '#F06543',
    backgroundColor: '#F06543',
  },
  btn_secondary: {
    borderColor: 'grey',
    backgroundColor: 'grey',
  },
  btn_text: {
    padding: 10,
    color: '#FFFFFF',
    alignItems: 'center',
  },
});

export default PhotoDecision;
