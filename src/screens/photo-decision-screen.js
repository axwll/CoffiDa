import { Container } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getItem } from '../utils/async-storage';
import { toast } from '../utils/toast';

class PhotoDecision extends Component {
  constructor(props) {
    super(props);

    console.log(this.props.navigation.getParam('displayText'));

    this.state = {
      yesPressed: false,
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
      locationId: this.props.navigation.getParam('locationId'),
      reviewId: this.props.navigation.getParam('reviewId'),
      displayText: this.props.navigation.getParam('displayText'),
      updateReview: this.props.navigation.getParam('updateReview'),
      deleteReview: this.props.navigation.getParam('deleteReview'),
    });
  }

  yesClicked = () => {
    console.log('yes');
    const locationId = this.state.locationId;
    const reviewId = this.state.reviewId;

    console.log(this.state.locationId);
    console.log(this.state.reviewId);

    if (!this.state.deleteReview) {
      this.props.navigation.navigate('TakePhoto', {
        locationId: locationId,
        reviewId: reviewId,
        update: true,
      });
      return;
    }

    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/photo`,
      {
        method: 'DELETE',
        headers: {'x-Authorization': this.state.token},
      },
    )
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          toast('Review photo deleted');
        } else {
          toast('Failed to delete review photo');
        }

        this.props.navigation.navigate('Profile');
      })
      .catch((error) => {
        console.log(error);
      });
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
