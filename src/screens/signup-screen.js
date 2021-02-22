import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Form, Header, Input, Item, Left, Title } from 'native-base';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { setItem } from '../utils/async-storage';
import Validator from '../utils/validator';

let apiRequests = null;

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
    apiRequests = new ApiRequests(this.props, null);
  }

  handleEmailInput = async (email) => {
    const response = Validator.validateEmail(email);

    await this.stateSetter(
      response,
      'email',
      email,
      'validEmail',
      'emailErrorText',
    );
  };

  handleFirstNameInput = async (firstName) => {
    const response = Validator.validateName('First Name', firstName);

    await this.stateSetter(
      response,
      'firstName',
      firstName,
      'validFirstName',
      'firstNameErrorText',
    );
  };

  handleLastNameInput = async (lastName) => {
    const response = Validator.validateName('Last Name', lastName);

    await this.stateSetter(
      response,
      'lastName',
      lastName,
      'validLastName',
      'lastNameErrorText',
    );
  };

  handlePasswordInput = async (password) => {
    const response = Validator.validatePassword(password);

    await this.stateSetter(
      response,
      'password',
      password,
      'validPassword',
      'passwordErrorText',
    );
  };

  handlePasswordConfirmlInput = async (confirmPassword) => {
    const password = this.state.password;

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

  signUpEvent = async () => {
    this.setState({submitted: true});

    const email = this.state.email;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      this.handleEmailInput(email);
      this.handleFirstNameInput(firstName);
      this.handleLastNameInput(lastName);
      this.handlePasswordInput(password);
      this.handlePasswordConfirmlInput(confirmPassword);
    }

    if (
      !this.state.validEmail ||
      !this.state.validFirstName ||
      !this.state.validLastName ||
      !this.state.validPassword ||
      !this.state.validConfirmPassword
    ) {
      return;
    }

    await this.signUp();
    await this.logIn();
  };

  signUp = async () => {
    const postBody = JSON.stringify({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    });

    await apiRequests.post('/user', postBody);
  };

  logIn = async () => {
    const postBody = JSON.stringify({
      email: this.state.email,
      password: this.state.password,
    });

    const response = await apiRequests.post('/user/login', postBody, true);

    if (response) {
      setItem('AUTH_TOKEN', response.token);
      setItem('USER_ID', response.id.toString());
      this.props.navigation.navigate('App');
    }
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
            <Title style={styles.title}>Sign Up</Title>
          </Body>
        </Header>

        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
          <Form>
            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder="Email"
                onChangeText={this.handleEmailInput}
              />
            </Item>
            {!this.state.validEmail && this.state.submitted && (
              <View>
                <Text style={styles.error_text}>
                  {this.state.emailErrorText}
                </Text>
              </View>
            )}

            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder="First Name"
                onChangeText={this.handleFirstNameInput}
              />
            </Item>
            {!this.state.validFirstName && this.state.submitted && (
              <View>
                <Text style={styles.error_text}>
                  {this.state.firstNameErrorText}
                </Text>
              </View>
            )}

            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder="Last Name"
                onChangeText={this.handleLastNameInput}
              />
            </Item>
            {!this.state.validLastName && this.state.submitted && (
              <View>
                <Text style={styles.error_text}>
                  {this.state.lastNameErrorText}
                </Text>
              </View>
            )}

            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder="Password"
                onChangeText={this.handlePasswordInput}
                secureTextEntry={true}
              />
            </Item>
            {!this.state.validPassword && this.state.submitted && (
              <View>
                <Text style={styles.error_text}>
                  {this.state.passwordErrorText}
                </Text>
              </View>
            )}

            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder="Confirm Password"
                onChangeText={this.handlePasswordConfirmlInput}
                secureTextEntry={true}
              />
            </Item>
            {!this.state.validConfirmPassword && this.state.submitted && (
              <View>
                <Text style={styles.error_text}>
                  {this.state.confirmPasswordErrorText}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, styles.btn_primary]}
              onPress={() => this.signUpEvent()}>
              <Text style={styles.btn_text}>{translate('signup')}</Text>
            </TouchableOpacity>
          </Form>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0DFD5',
  },
  header: {
    height: 50,
    borderBottomWidth: 0.5,
    backgroundColor: '#E0DFD5',
  },
  header_left: {
    position: 'absolute',
    left: 10,
  },
  header_body: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#313638',
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
    color: 'tomato',
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
  btn_primary: {
    borderColor: '#F06543',
    backgroundColor: '#F06543',
  },
  btn_text: {
    padding: 10,
    color: '#FFFFFF',
    alignItems: 'center',
  },
});

export default Signup;
