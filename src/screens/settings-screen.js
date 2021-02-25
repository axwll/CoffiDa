import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Card, CardItem, Container, Content, Header, Left, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import LoadingSpinner from '../components/loading-spinner';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { clear, getItem } from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      userInfo: [],
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({ userId: await getItem('USER_ID') });

    this.getUserInfo();
  }

  openEditProfile = async(type) => {
    this.props.navigation.navigate('EditAccount', {
      type,
      userInfo: this.state.userInfo,
      onGoBack: () => this.getUserInfo(),
    });
  };

  getUserInfo = async() => {
    this.setState({ loading: true });

    const { userId } = this.state;
    const response = await this.apiRequests.get(`/user/${userId}`);

    if (response) {
      this.setState({ userInfo: response });
    }

    this.setState({ loading: false });
  };

  signOut = async() => {
    await clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    const themeStyles = ThemeProvider.getTheme();

    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    }
    const { navigation } = this.props;

    return (
      <Container style={themeStyles.container}>
        <Header style={[styles.header, themeStyles.background_color]}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={themeStyles.color_primary.color}
                onPress={() => navigation.navigate('Profile')}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={themeStyles.color_dark}>
              {translate('settings')}
            </Title>
          </Body>
        </Header>

        <Content padder style={styles.content}>
          <Text>
            {translate('account')}: {this.state.userInfo.email}
          </Text>
          <Text>
            {translate('name')}: {this.state.userInfo.first_name}{' '}
            {this.state.userInfo.last_name}
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
            <TouchableOpacity onPress={() => this.openEditProfile('name')}>
              <CardItem>
                <Body>
                  <Text>{translate('change_name')}</Text>
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
          <TouchableOpacity
            style={[styles.button, themeStyles.primary_button_color]}
            onPress={() => this.signOut()}>
            <Text style={[styles.btn_text, themeStyles.color_light]}>
              {translate('signout')}
            </Text>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    borderBottomWidth: 0.5,
  },
  header_left: {
    position: 'absolute',
    left: 10,
  },
  header_body: {
    flex: 1,
    alignItems: 'center',
  },
  dark_mode_body: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  btn_text: {
    padding: 10,
    alignItems: 'center',
  },
});

export default Settings;
