import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Container, Content, Header, Icon, Input, Item } from 'native-base';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import MainCard from './common/card';

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
        'x-Authorization': '65d0bee22d27d758589de068a1e4d074',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({
          coffeeShops: responseJson,
        });
      })
      .catch((error) => {
        // response.status
        console.log(error);
      });

    this.setState({
      loading: false,
    });
  };

  render() {
    const data = this.state.shopData;
    if (!this.state.loading) {
      return <Text>Waiting for data</Text>;
    } else {
      return (
        <Container style={styles.container}>
          <Header searchBar rounded style={styles.header}>
            <Item rounded style={styles.srch}>
              <Icon name="ios-search" />
              <Input placeholder="Search" />
            </Item>
            <FontAwesomeIcon
              icon={faMapMarkedAlt}
              size={20}
              color={'#F06543'}
              onPress={() => this.press()}
            />
          </Header>
          <Content>
            <ScrollView>
              {this.state.coffeeShops.map((shop) => {
                return <MainCard key={shop.location_id} shopData={shop} />;
              })}
              {/* <MainCard
                name="Lo-Fi Coffee Shop"
                // shopData={this.state.coffeeShops}
              />
              <MainCard name="Cracking Coffee" />
              <MainCard name="CoffiDa" /> */}
            </ScrollView>
          </Content>
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
  btn: {
    backgroundColor: 'green',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default Home;
