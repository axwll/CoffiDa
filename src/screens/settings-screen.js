import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Card, CardItem, Container, Content, Header, Left, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import LoadingSpinner from '../components/loading-spinner';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { clear, getItem } from '../utils/async-storage';

let apiRequest = null;

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      userInfo: [],
    };
  }

  async componentDidMount() {
    apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({userId: await getItem('USER_ID')});

    this.getUserInfo();
  }

  openEditProfile = async (type) => {
    this.props.navigation.navigate('EditAccount', {
      type: type,
      onGoBack: () => this.getUserInfo(),
    });
  };

  getUserInfo = async () => {
    this.setState({loading: true});

    const userId = this.state.userId;
    const response = await apiRequests.get(`/user/${userId}`);

    if (response) {
      this.setState({userInfo: response});
    }

    this.setState({loading: false});
  };

  signOut = async () => {
    await clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    } else {
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
              <TouchableOpacity
                onPress={() => this.openEditProfile('password')}>
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
