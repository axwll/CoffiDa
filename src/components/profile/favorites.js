import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import MainCard from '../common/main-card';

class FavoritesTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingMessage: 'Loading data',
    };
  }

  async componentDidMount() {
    // this.setState({
    // token: await getItem('AUTH_TOKEN'),
    //   userInfo: JSON.parse(await getItem('USER_DATA')),
    // });

    this.setState({loading: false});
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loading_view}>
          <Text style={styles.load_text}>{this.state.loadingMessage}</Text>
        </View>
      );
    } else {
      return (
        <ScrollView>
          {this.props.favorites.map((fav) => {
            return (
              <MainCard
                key={fav.location_id}
                shopData={fav}
                navigation={this.props.navigation}
              />
            );
          })}
        </ScrollView>
      );
    }
  }
}
const styles = StyleSheet.create({});

export default withNavigation(FavoritesTab);
