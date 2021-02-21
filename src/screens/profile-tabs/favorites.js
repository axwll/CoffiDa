import React, { Component } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import LoadingSpinner from '../../components/loading-spinner';
import MainCard from '../../components/main-card';
import { translate } from '../../locales';
import { getItem } from '../../utils/async-storage';

class FavoritesTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      favorites: [],
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
      userId: JSON.parse(await getItem('USER_ID')),
    });

    this.findFavorites();
  }

  findFavorites = () => {
    return fetch(`http://10.0.2.2:3333/api/1.0.0/find?search_in=favourite`, {
      headers: {
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          favorites: responseJson,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({loading: false});
      });
  };

  renderNoData = () => {
    return (
      <View style={styles.loading_view}>
        <Text style={styles.load_text}>{translate('no_results')}</Text>
      </View>
    );
  };

  render() {
    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.state.favorites}
            renderItem={(fav) => {
              return (
                <MainCard
                  shopData={fav.item}
                  navigation={this.props.navigation}
                />
              );
            }}
            keyExtractor={(item) => item.location_id.toString()}
            ListEmptyComponent={this.renderNoData()}
          />
        </SafeAreaView>
      );
    }
  }
}
const styles = StyleSheet.create({});

export default withNavigation(FavoritesTab);
