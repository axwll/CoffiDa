import React, { Component } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import LoadingSpinner from '../../components/loading-spinner';
import MainCard from '../../components/main-card';
import { translate } from '../../locales';
import ApiRequests from '../../utils/api-requests';
import { getItem } from '../../utils/async-storage';
import ThemeProvider from '../../utils/theme-provider';

class Favorites extends Component {
  constructor(props) {
    super(props);

    this.themeStyles = ThemeProvider.getTheme();

    this.state = {
      loading: true,
      offset: 0,
      limit: 3,
      favorites: [],
      favoriteTab: true,
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({
      userId: JSON.parse(await getItem('USER_ID')),
    });

    this.findFavorites();
  }

  findFavorites = async(extendList = false) => {
    const query = `limit=${this.state.limit}&offset=${this.state.offset}&search_in=favourite`;
    const response = await this.apiRequests.get(`/find?${query}`);

    if (response) {
      if (extendList) {
        this.setState({ favorites: this.state.favorites.concat(response) });
      } else {
        this.setState({ favorites: response });
      }
    }

    this.setState({ loading: false });
  };

  callback = () => {
    this.setState({ loading: true });
    this.findFavorites();
  }

  renderNoData = () => (
    <View style={styles.loading_view}>
      <Text style={[styles.load_text, this.themeStyles.color_dark]}>
        {translate('no_results')}
      </Text>
    </View>
  );

  handleLoadMore = (distanceFromEnd) => {
    if (distanceFromEnd < 0) return;

    const off = this.state.offset;
    const { limit } = this.state;
    this.setState({ offset: off + limit }, () => {
      this.findFavorites(true);
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    }
    return (
      <SafeAreaView>
        <FlatList
          data={this.state.favorites}
          renderItem={(fav) => (
            <MainCard
              shopData={fav.item}
              navigation={this.props.navigation}
              favoriteTab={this.state.favoriteTab}
              callback={this.callback.bind(this)}
            />
          )}
          keyExtractor={(item) => item.location_id.toString()}
          onEndReachedThreshold={0.01}
          onEndReached={({ distanceFromEnd }) => this.handleLoadMore(distanceFromEnd)
          }
          ListEmptyComponent={this.renderNoData()}
        />
      </SafeAreaView>
    );
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
  },
});

export default Favorites;
