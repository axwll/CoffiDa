import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Left,
  Text,
  Title,
} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

import {translate} from '../../locales';

class Settings extends Component {
  //   signOut = async () => {
  //     console.log('signout');
  //     try {
  //       await AsyncStorage.removeItem('userToken');
  //       console.log('removed');
  //     } catch (error) {
  //       console.log('async store error');
  //     }
  //   };

  signOut = async () => {
    console.log('signout');
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    const navigation = this.props.navigation;

    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={'#F06543'}
                onPress={() => navigation.goBack()}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={styles.title}>{translate('settings')}</Title>
          </Body>
        </Header>

        <Content padder style={styles.content}>
          <Text>{translate('account')} maxj131@hotmail.com</Text>
          <Card transparent>
            <CardItem>
              <Body>
                <Text>{translate('change_email')}</Text>
              </Body>
            </CardItem>
          </Card>
          <Card transparent>
            <CardItem>
              <Body>
                <Text>{translate('reset_password')}</Text>
              </Body>
            </CardItem>
          </Card>
          <Text>{translate('preferences')}</Text>
          <Card transparent>
            <CardItem>
              <Body>
                <Text>{translate('permissions')}</Text>
              </Body>
            </CardItem>
          </Card>
          <Card transparent>
            <CardItem>
              <Body>
                <Text>{translate('accessibility')}</Text>
              </Body>
            </CardItem>
          </Card>
          <Button block>
            <Text onPress={() => this.signOut()}>{translate('signout')}</Text>
          </Button>
        </Content>
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
  },
});

export default Settings;
