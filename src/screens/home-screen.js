import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Container, Header, Icon, Input, Item } from 'native-base';
import React, { Component } from 'react';
import { FlatList, Keyboard, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Stars from 'react-native-stars';

import Empty from '../assets/ratings/rating-empty-primary.png';
import Full from '../assets/ratings/rating-full-primary.png';
import LoadingSpinner from '../components/loading-spinner';
import MainCard from '../components/main-card';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';
import { toast } from '../utils/toast';

let apiRequests = null;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      offset: 0,
      limit: 5,
      filterQuery: '',
      searchQuery: '',
      coffeeShops: [],
      modalVisible: false,
      overallFilter: 0,
      priceFilter: 0,
      qualFilter: 0,
      cleanFilter: 0,
    };
  }

  async componentDidMount() {
    const token = await getItem('AUTH_TOKEN');
    if (!token) {
      this.props.navigation.navigate('Auth');
      return;
    }

    apiRequests = new ApiRequests(this.props, token);

    // lists all shops
    this.find();
  }

  find = async (extendList = false) => {
    const query = `?limit=${this.state.limit}&offset=${this.state.offset}${this.state.filterQuery}${this.state.searchQuery}`;

    const response = await apiRequests.get(`/find${query}`);

    if (response) {
      if (extendList) {
        this.setState({coffeeShops: this.state.coffeeShops.concat(response)});
      } else {
        this.setState({coffeeShops: response});
      }
    }

    this.setState({loading: false});
  };

  clearFilters = () => {
    this.setState({
      overallFilter: 0,
      priceFilter: 0,
      qualFilter: 0,
      cleanFilter: 0,
      filterQuery: '',
    });
  };

  filterResults = () => {
    const overall = this.state.overallFilter;
    const price = this.state.priceFilter;
    const qual = this.state.qualFilter;
    const clean = this.state.cleanFilter;

    if (!overall && !price && !qual && !clean) {
      toast(transalte('select_filter_toast'));
      return;
    }

    let query = '';

    query = this.formatQuery('overall_rating', overall, query);
    query = this.formatQuery('price_rating', price, query);
    query = this.formatQuery('quality_rating', qual, query);
    query = this.formatQuery('clenliness_rating', clean, query);

    this.setState(
      {
        modalVisible: false,
        coffeeShops: [],
        loading: true,
        filterQuery: query,
      },
      () => {
        this.find();
      },
    );
  };

  formatQuery = (string, value, query = '') => {
    if (value) {
      query += `&${string}=${value}`;
    }

    return query;
  };

  search = async (text) => {
    Keyboard.dismiss();

    let query = '';
    if (text) {
      query = '&q=' + text;
    }

    this.setState(
      {
        offset: 0,
        loading: true,
        searchQuery: query,
      },
      () => {
        this.find();
      },
    );
  };

  renderItem = (shop) => {
    return (
      <MainCard
        key={shop.item.location_id}
        shopData={shop.item}
        navigation={this.props.navigation}
      />
    );
  };

  renderNoData = () => {
    return (
      <View style={styles.loading_view}>
        <Text style={styles.load_text}>{translate('no_results')}</Text>
      </View>
    );
  };

  handleLoadMore = (distanceFromEnd) => {
    if (distanceFromEnd < 0) return;

    const off = this.state.offset;
    const limit = this.state.limit;
    this.setState({offset: off + limit}, () => {
      this.find(true);
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    } else {
      return (
        <Container style={styles.container}>
          <Header searchBar rounded style={styles.header}>
            <Item rounded style={styles.srch}>
              <Icon name="ios-search" />
              <Input
                placeholder={translate('search_box_placeholder')}
                onSubmitEditing={(event) => this.search(event.nativeEvent.text)}
              />
            </Item>
            <TouchableOpacity
              style={styles.filter}
              onPress={() => this.setState({modalVisible: true})}>
              <FontAwesomeIcon
                icon={faFilter}
                style={styles.filter_icon}
                size={20}
              />
            </TouchableOpacity>
          </Header>
          {this.state.modalVisible && (
            <View style={styles.centered_view}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}>
                <View style={styles.centered_view}>
                  <View style={styles.modal}>
                    <View style={styles.modal_header}>
                      <View style={styles.modal_header_left}>
                        <TouchableOpacity onPress={() => this.clearFilters()}>
                          <Text style={styles.header_left_text}>
                            {translate('clear_filters')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.modal_header_right}>
                        <TouchableOpacity
                          onPress={() => this.setState({modalVisible: false})}>
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={styles.close_modal_icon}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.modal_body}>
                      <Text style={styles.modal_header_text}>
                        {translate('filter_by_rating')}
                      </Text>
                      <Text style={styles.modal_text}>
                        {translate('overall_rating')}
                      </Text>
                      <Stars
                        default={this.state.overallFilter}
                        update={(rating) =>
                          this.setState({overallFilter: rating})
                        }
                        spacing={5}
                        starSize={25}
                        count={5}
                        fullStar={Full}
                        emptyStar={Empty}
                      />

                      <Text style={styles.modal_text}>
                        {translate('price_rating')}
                      </Text>
                      <Stars
                        default={this.state.priceFilter}
                        update={(rating) =>
                          this.setState({priceFilter: rating})
                        }
                        spacing={5}
                        starSize={25}
                        count={5}
                        fullStar={Full}
                        emptyStar={Empty}
                      />

                      <Text style={styles.modal_text}>
                        {translate('quality_rating')}
                      </Text>
                      <Stars
                        default={this.state.qualFilter}
                        update={(rating) => this.setState({qualFilter: rating})}
                        spacing={5}
                        starSize={25}
                        count={5}
                        fullStar={Full}
                        emptyStar={Empty}
                      />

                      <Text style={styles.modal_text}>
                        {translate('clean_rating')}
                      </Text>
                      <Stars
                        default={this.state.cleanFilter}
                        update={(rating) =>
                          this.setState({cleanFilter: rating})
                        }
                        spacing={5}
                        starSize={25}
                        count={5}
                        fullStar={Full}
                        emptyStar={Empty}
                      />

                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.filterResults()}>
                        <Text style={styles.text_style}>
                          {translate('filter_results')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          )}

          <SafeAreaView style={styles.container}>
            <FlatList
              data={this.state.coffeeShops}
              renderItem={(shop) => this.renderItem(shop)}
              keyExtractor={(shop) => shop.location_id.toString()}
              onEndReachedThreshold={0.01}
              onEndReached={({distanceFromEnd}) =>
                this.handleLoadMore(distanceFromEnd)
              }
              ListEmptyComponent={this.renderNoData()}
            />
          </SafeAreaView>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#E8E9EB',
  },
  header: {
    borderBottomWidth: 0.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  srch: {
    flex: 9,
  },
  filter: {
    flex: 1,
  },
  filter_icon: {
    color: '#F06543',
    margin: 10,
  },
  loading_view: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  load_text: {
    fontSize: 20,
    color: '#313638',
  },
  centered_view: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 5,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modal_header: {
    flexDirection: 'row',
  },
  modal_header_left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  header_left_text: {
    color: '#808080',
    textDecorationLine: 'underline',
  },
  modal_header_right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  close_modal_icon: {
    color: '#808080',
  },
  modal_body: {
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    elevation: 2,
    backgroundColor: '#F06543',
  },
  text_style: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modal_header_text: {
    fontSize: 18,
    textAlign: 'center',
  },
  modal_text: {
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default Home;
