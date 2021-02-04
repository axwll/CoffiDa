import {faMapMarkedAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Container, Content, Header, Icon, Input, Item} from 'native-base';
import React, {Component} from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MainCard from './common/main-card';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      coffeeShops: [],
    };

    this.listShops();
  }

  listShops = () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/find', {
      headers: {
        'x-Authorization': '90776a72966ec49e06eb7a3023b8c251', // PLS chnage this
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
        'x-Authorization': '90776a72966ec49e06eb7a3023b8c251',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
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

  openExplore = () => {
    this.props.navigation.navigate('Explore');
  };

  render() {
    const data = this.state.shopData;

    if (this.state.loading) {
      return <Text>Waiting for data</Text>;
    } else {
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
            <TouchableOpacity onPress={() => this.openExplore()}>
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
            <View>
              <Text>No resultss found</Text>
            </View>
          )}
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
});

export default Home;
