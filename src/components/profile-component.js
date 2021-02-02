import { faChevronLeft, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Content, Header, Left, Right, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';

// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  press = () => {
    console.log('press');
    console.log(this.props.navigation.navigate);
    this.props.navigation.navigate('Settings');
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={'#F06543'}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={styles.title}>Profile</Title>
          </Body>

          <Right style={styles.header_right}>
            <FontAwesomeIcon
              icon={faCog}
              size={20}
              color={'#F06543'}
              onPress={() => this.press()}
            />
          </Right>
        </Header>

        <Content style={styles.content}></Content>
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
    height: 50,
    borderBottomWidth: 0.5,
    backgroundColor: '#E8E9EB',
  },
  header_left: {
    // backgroundColor: 'grey',
    flex: 1,
  },
  header_body: {
    flex: 4,
    alignItems: 'center',
  },
  title: {
    color: 'black',
  },
  header_right: {
    flex: 1,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 12,
    // backgroundColor: 'green',
  },
});

export default withNavigation(Profile);
