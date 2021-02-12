import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Card, CardItem, Container, Content, Header, Left, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { translate } from '../../../locales';
import { clear, getItem, setItem } from '../../common/async-storage-helper';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: [],
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
      userInfo: JSON.parse(await getItem('USER_DATA')),
    });
  }

  openEditProfile = async (type) => {
    this.props.navigation.navigate('EditAccount', {
      type: type,
      userInfo: this.state.userInfo,
      onGoBack: () => this.getUserInfo(),
    });
  };

  getUserInfo = () => {
    console.log('goback');
    const userId = this.state.userInfo.user_id;

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`, {
      headers: {
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setItem('USER_DATA', JSON.stringify(responseJson));
        this.setState({userInfo: responseJson});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  signOut = async () => {
    await clear();
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
                onPress={() => navigation.navigate('Profile')}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={styles.title}>{translate('settings')}</Title>
          </Body>
        </Header>

        <Content padder style={styles.content}>
          <Text>
            {translate('account')}: {this.state.userInfo.email}
          </Text>
          <Card transparent>
            <TouchableOpacity onPress={() => this.openEditProfile('email')}>
              <CardItem>
                <Body>
                  <Text>{translate('change_email')}</Text>
                </Body>
              </CardItem>
            </TouchableOpacity>
          </Card>
          <Card transparent>
            <TouchableOpacity onPress={() => this.openEditProfile('password')}>
              <CardItem>
                <Body>
                  <Text>{translate('reset_password')}</Text>
                </Body>
              </CardItem>
            </TouchableOpacity>
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
