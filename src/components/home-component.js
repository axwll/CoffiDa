import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Container, Content, Header, Icon, Input, Item } from 'native-base';
import React from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { translate } from '../locales';
import AbstractComponent from './abstract-component';
import { getItem } from './common/async-storage-helper';
import MainCard from './common/main-card';

// import React, { Component } from 'react';
class Home extends AbstractComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      coffeeShops: [],
    };
  }

  async componentDidMount() {
    const token = await getItem('AUTH_TOKEN');

    if (!token) {
      this.props.navigation.navigate('Auth');
      return;
    }

    this.setState({token: token});
    this.listShops();
  }

  listShops = () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/find', {
      headers: {
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          coffeeShops: responseJson,
          loading: false,
        });
      })
      .catch((error) => {
        // response.status
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  };

  search = (text) => {
    Keyboard.dismiss();
    console.log(text);

    this.setState({
      loading: true,
    });

    if (!text) {
      this.listShops();
      return;
    }

    return fetch(`http://10.0.2.2:3333/api/1.0.0/find?q=${text}`, {
      headers: {
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          coffeeShops: responseJson,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const data = this.state.shopData;

    return (
      <Container style={styles.container}>
        <Header searchBar rounded style={styles.header}>
          <Item rounded style={styles.srch}>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onSubmitEditing={(event) => this.search(event.nativeEvent.text)}
            />
          </Item>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Explore')}>
            <FontAwesomeIcon
              icon={faMapMarkedAlt}
              style={styles.explore_icon}
              size={20}
            />
          </TouchableOpacity>
        </Header>
        {this.state.coffeeShops.length > 0 ? (
          <Content>
            <ScrollView>
              {this.state.coffeeShops.map((shop) => {
                return (
                  <MainCard
                    key={shop.location_id}
                    shopData={shop}
                    navigation={this.props.navigation}
                  />
                );
              })}
            </ScrollView>
          </Content>
        ) : (
          <View style={styles.loading_view}>
            <Text style={styles.load_text}>
              {this.state.loading
                ? translate('loading')
                : translate('no_results')}
            </Text>
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#E8E9EB',
  },
  header: {
    // height: 50,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  srch: {
    flex: 1,
  },
  subHeading: {
    height: 50,
    backgroundColor: 'grey',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
  },
  explore_icon: {
    color: '#F06543',
    margin: 10,
  },
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

export default Home;
