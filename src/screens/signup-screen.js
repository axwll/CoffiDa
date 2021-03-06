import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Form, Header, Input, Item, Left, Title } from 'native-base';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { setItem } from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';
import toast from '../utils/toast';
import Validator from '../utils/validator';

/**
 * SignUp Screen
 */
class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      email: '',
      validEmail: false,
      firstName: '',
      validFirstName: false,
      lastName: '',
      validLastName: false,
      password: '',
      validPassword: false,
      confirmPassword: '',
      validConfirmPassword: false,
    };
  }

  componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, null);
  }

  handleEmailInput = async(email) => {
    const response = Validator.validateEmail(email);

    await this.stateSetter(
      response,
      'email',
      email,
      'validEmail',
      'emailErrorText',
    );
  };

  handleFirstNameInput = async(firstName) => {
    const response = Validator.validateName('First Name', firstName);

    await this.stateSetter(
      response,
      'firstName',
      firstName,
      'validFirstName',
      'firstNameErrorText',
    );
  };

  handleLastNameInput = async(lastName) => {
    const response = Validator.validateName('Last Name', lastName);

    await this.stateSetter(
      response,
      'lastName',
      lastName,
      'validLastName',
      'lastNameErrorText',
    );
  };

  handlePasswordInput = async(password) => {
    const response = Validator.validatePassword(password);

    await this.stateSetter(
      response,
      'password',
      password,
      'validPassword',
      'passwordErrorText',
    );
  };

  handlePasswordConfirmlInput = async(confirmPassword) => {
    const { password } = this.state;

    if (!password) {
      // need to have a password before i can check they match
      return;
    }
    const response = Validator.validatePasswordMatch(password, confirmPassword);

    await this.stateSetter(
      response,
      'confirmPassword',
      confirmPassword,
      'validConfirmPassword',
      'confirmPasswordErrorText',
    );
  };

  /**
   * Dynamically sets state with the given options:
   *
   * @param   {ValidationResponse}  response    The response from the validator
   * @param   {string}              key         The key for state e.g. 'email'
   * @param   {string}              value       The value of the state key e.g. 'test@test.com'
   * @param   {string}              booleanKey  The boolean state key e.g. 'validEmail'
   * @param   {string}              errorKey    The state key for the error message
   */
  stateSetter = (response, key, value, booleanKey, errorKey) => {
    if (!response.status) {
      this.setState({
        [booleanKey]: false,
        [errorKey]: response.message,
        [key]: value,
      });
    } else {
      this.setState({
        [booleanKey]: true,
        [key]: value,
      });
    }
  };

  signUpEvent = async() => {
    this.setState({ submitted: true });

    const { email } = this.state;
    const { firstName } = this.state;
    const { lastName } = this.state;
    const { password } = this.state;
    const { confirmPassword } = this.state;

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      // If any of the inputs have been left blank, run validation to show error
      this.handleEmailInput(email);
      this.handleFirstNameInput(firstName);
      this.handleLastNameInput(lastName);
      this.handlePasswordInput(password);
      this.handlePasswordConfirmlInput(confirmPassword);
    }

    if (
      !this.state.validEmail
      || !this.state.validFirstName
      || !this.state.validLastName
      || !this.state.validPassword
      || !this.state.validConfirmPassword
    ) {
      return;
    }

    const response = await this.signUp();

    if (response) {
      toast(translate('create_account_failed'));
    }

    // If signup was successful, login
    await this.logIn();
  };

  signUp = async() => {
    const postBody = JSON.stringify({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    });

    await this.apiRequests.post('/user', postBody);
  };

  logIn = async() => {
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
    const { navigation } = this.props;
    const themeStyles = ThemeProvider.getTheme();

    return (
      <Container
        style={[styles.container, themeStyles.alt_background_color]}>
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
            <Title style={themeStyles.color_dark}>
              {translate('signup')}
            </Title>
          </Body>
        </Header>

        <ScrollView
          contentContainerStyle={styles.container_style}>
          <Form>
            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder={translate('email_placeholder')}
                onChangeText={this.handleEmailInput}
              />
            </Item>
            {!this.state.validEmail && this.state.submitted && (
              <View>
                <Text
                  style={[styles.error_text, themeStyles.color_primary]}>
                  {this.state.emailErrorText}
                </Text>
              </View>
            )}

            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder={translate('first_name_placeholder')}
                onChangeText={this.handleFirstNameInput}
              />
            </Item>
            {!this.state.validFirstName && this.state.submitted && (
              <View>
                <Text
                  style={[styles.error_text, themeStyles.color_primary]}>
                  {this.state.firstNameErrorText}
                </Text>
              </View>
            )}

            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder={translate('last_name_placeholder')}
                onChangeText={this.handleLastNameInput}
              />
            </Item>
            {!this.state.validLastName && this.state.submitted && (
              <View>
                <Text
                  style={[styles.error_text, themeStyles.color_primary]}>
                  {this.state.lastNameErrorText}
                </Text>
              </View>
            )}

            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder={translate('password_placeholder')}
                onChangeText={this.handlePasswordInput}
                secureTextEntry
              />
            </Item>
            {!this.state.validPassword && this.state.submitted && (
              <View>
                <Text
                  style={[styles.error_text, themeStyles.color_primary]}>
                  {this.state.passwordErrorText}
                </Text>
              </View>
            )}

            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder={translate('confirm_password_placeholder')}
                onChangeText={this.handlePasswordConfirmlInput}
                secureTextEntry
              />
            </Item>
            {!this.state.validConfirmPassword && this.state.submitted && (
              <View>
                <Text
                  style={[styles.error_text, themeStyles.color_primary]}>
                  {this.state.confirmPasswordErrorText}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, themeStyles.primary_button_color]}
              onPress={() => this.signUpEvent()}>
              <Text style={[styles.btn_text, themeStyles.color_light]}>
                {translate('signup')}
              </Text>
            </TouchableOpacity>
          </Form>
        </ScrollView>
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
  container_style: {
    flexGrow: 1,
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
  checkbox: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
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

export default Signup;
