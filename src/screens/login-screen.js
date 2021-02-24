import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Body,
  Button,
  Container,
  Form,
  Header,
  Input,
  Item,
  Left,
  Title,
} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {translate} from '../locales';
import {darkStyles} from '../styles/dark-styles';
import {lightStyles} from '../styles/light-styles';
import ApiRequests from '../utils/api-requests';
import {getItem} from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';
import Validator from '../utils/validator';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      email: '',
      validEmail: false,
      password: '',
      validPassword: false,
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));
  }

  handleEmailInput = (email) => {
    const response = Validator.validateEmail(email);

    if (!response.status) {
      this.setState({
        validEmail: false,
        emailErrorText: response.message,
        email: email,
      });
    } else {
      this.setState({
        validEmail: true,
        email: email,
      });
    }
  };

  handlePasswordlInput = (password) => {
    const response = Validator.validatePassword(password);

    if (!response.status) {
      this.setState({
        validPassword: false,
        passwordErrorText: response.message,
        password: password,
      });
    } else {
      this.setState({
        validPassword: true,
        password: password,
      });
    }
  };

  logInEvent = async () => {
    this.setState({submitted: true});

    if (!this.state.email || !this.state.password) {
      this.handleEmailInput(this.state.email);
      this.handlePasswordlInput(this.state.password);
      return;
    }

    if (!this.state.validEmail || !this.state.validPassword) {
      return;
    }

    this.logIn();
  };

  logIn = async () => {
    const postBody = JSON.stringify({
      email: this.state.email,
      password: this.state.password,
    });

    const response = await this.apiRequests.post('/user/login', postBody, true);

    if (response) {
      setItem('AUTH_TOKEN', response.token);
      setItem('USER_ID', response.id.toString());
      this.props.navigation.navigate('App');
    }
  };

  render() {
    const navigation = this.props.navigation;
    const themeStyles = ThemeProvider.getTheme();
    return (
      <Container style={[styles.container, themeStyles.alt_background_color]}>
        <Header style={[styles.header, themeStyles.alt_background_color]}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={themeStyles.color_primary.color}
                onPress={() => navigation.goBack()}
              />
            </Button>
          </Left>
          <Body style={styles.header_body}>
            <Title style={themeStyles.color_dark}>{translate('login')}</Title>
          </Body>
        </Header>

        <Form style={styles.form}>
          <Item style={styles.item}>
            <Input
              style={styles.input}
              placeholder={translate('email_placeholder')}
              onChangeText={this.handleEmailInput}
            />
          </Item>
          {!this.state.validEmail && this.state.submitted && (
            <View>
              <Text style={[styles.error_text, themeStyles.color_primary]}>
                {this.state.emailErrorText}
              </Text>
            </View>
          )}

          <Item style={styles.item}>
            <Input
              style={styles.input}
              placeholder={translate('password_placeholder')}
              onChangeText={this.handlePasswordlInput}
              secureTextEntry={true}
            />
          </Item>
          {!this.state.validPassword && this.state.submitted && (
            <View>
              <Text style={[styles.error_text, themeStyles.color_primary]}>
                {this.state.passwordErrorText}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, themeStyles.primary_button_color]}
            onPress={() => this.logInEvent()}>
            <Text style={[styles.btn_text, themeStyles.color_light]}>
              {translate('login')}
            </Text>
          </TouchableOpacity>
        </Form>
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
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    borderBottomWidth: 0,
  },
  input: {
    margin: 10,
    marginLeft: 0,
    paddingLeft: 20,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  error_text: {
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    marginRight: 5,
  },
  btn_text: {
    padding: 10,
    alignItems: 'center',
  },
});

export default Login;
