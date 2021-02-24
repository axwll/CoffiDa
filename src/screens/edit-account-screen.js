import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Form, Header, Input, Item, Left, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';
import ThemeProvider from '../utils/theme-provider';
import Validator from '../utils/validator';

class EditAccount extends Component {
  constructor(props) {
    super(props);

    const type = this.props.navigation.getParam('type');

    this.state = {
      type: type,
      submitted: false,
      email: '',
      validEmail: true,
      firstName: '',
      validFirstName: true,
      lastName: '',
      validLastName: true,
      password: '',
      passwordError: false,
      confirmPassword: '',
      validConfirmPassword: false,
    };
  }

  async componentDidMount() {
    this.apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));
    this.themeStyles = ThemeProvider.getTheme();

    const userInfo = this.props.navigation.getParam('userInfo');
    this.setState({
      userId: await getItem('USER_ID'),
      email: userInfo.email,
      firstName: userInfo.first_name,
      lastName: userInfo.last_name,
    });
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
      // Set this to true so the confirm password error doesnt show beofre a password is entered
      this.setState({validConfirmPassword: true});
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

  updateEmail = () => {
    this.setState({submitted: true});

    if (!this.state.validEmail) {
      return;
    }

    this.updateUserInfo({email: email});
  };

  updateName = () => {
    this.setState({submitted: true});

    if (!this.state.validFirstName || !this.state.validLastName) {
      return;
    }

    this.updateUserInfo({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
    });
  };

  resetPassword = () => {
    this.setState({submitted: true});

    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;

    if (!password || !confirmPassword) {
      this.handlePasswordInput(password);
      this.handlePasswordConfirmlInput(confirmPassword);
    }

    if (!this.state.validPassword || !this.state.validConfirmPassword) {
      return;
    }

    this.updateUserInfo({password: password});
  };

  updateUserInfo = async (data) => {
    this.setState({submitted: true});

    const response = await this.apiRequests.patch(
      '/user/' + this.state.userId,
      JSON.stringify(data),
    );

    if (response === 'OK') {
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack();
    }
  };

  _renderComponent = () => {
    if (this.state.type === 'email') {
      return this.emailForm();
    } else if (this.state.type === 'password') {
      return this.passwordForm();
    } else {
      return this.nameForm();
    }
  };

  emailForm = () => {
    return (
      <Form style={styles.form_view}>
        <Item style={styles.item}>
          <Input
            style={styles.input}
            value={this.state.email}
            onChangeText={this.handleEmailInput}
          />
        </Item>
        {!this.state.validEmail && this.state.submitted && (
          <View>
            <Text style={[styles.error_text, this.themeStyles.color_primary]}>
              {this.state.emailErrorText}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn_primary, this.themeStyles.primary_button_color]}
          onPress={() => this.updateEmail()}>
          <Text style={[styles.btn_text, this.themeStyles.color_light]}>
            {translate('update_email')}
          </Text>
        </TouchableOpacity>
      </Form>
    );
  };

  nameForm = () => {
    return (
      <Form style={styles.form_view}>
        <Item style={styles.item}>
          <Input
            style={styles.input}
            value={this.state.firstName}
            onChangeText={this.handleFirstNameInput}
          />
        </Item>
        {!this.state.validFirstName && this.state.submitted && (
          <View>
            <Text style={[styles.error_text, this.themeStyles.color_primary]}>
              {this.state.firstNameErrorText}
            </Text>
          </View>
        )}

        <Item style={styles.item}>
          <Input
            style={styles.input}
            value={this.state.lastName}
            onChangeText={this.handleLastNameInput}
          />
        </Item>
        {!this.state.validLastName && this.state.submitted && (
          <View>
            <Text style={[styles.error_text, this.themeStyles.color_primary]}>
              {this.state.lastNameErrorText}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn_primary, this.themeStyles.primary_button_color]}
          onPress={() => this.updateName()}>
          <Text style={[styles.btn_text, this.themeStyles.color_light]}>
            {translate('update_name')}
          </Text>
        </TouchableOpacity>
      </Form>
    );
  };

  passwordForm = () => {
    return (
      <Form style={styles.form_view}>
        <Item style={styles.item}>
          <Input
            style={styles.input}
            placeholder={translate('password_placeholder')}
            onChangeText={this.handlePasswordInput}
          />
        </Item>
        {!this.state.validPassword && this.state.submitted && (
          <View>
            <Text style={[styles.error_text, this.themeStyles.color_primary]}>
              {this.state.passwordErrorText}
            </Text>
          </View>
        )}

        <Item style={styles.item}>
          <Input
            style={styles.input}
            placeholder={translate('confirm_password_placeholder')}
            onChangeText={this.handlePasswordConfirmlInput}
          />
        </Item>
        {!this.state.validConfirmPassword && this.state.submitted && (
          <View>
            <Text style={[styles.error_text, this.themeStyles.color_primary]}>
              {this.state.confirmPasswordErrorText}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn_primary, this.themeStyles.primary_button_color]}
          onPress={() => this.resetPassword()}>
          <Text style={[styles.btn_text, this.themeStyles.color_light]}>
            {translate('reset_password')}
          </Text>
        </TouchableOpacity>
      </Form>
    );
  };

  render() {
    const navigation = this.props.navigation;

    return (
      <Container style={this.themeStyles.container}>
        <Header style={[styles.header, this.themeStyles.background_color]}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={this.themeStyles.color_primary.color}
                onPress={() => navigation.goBack()}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={this.themeStyles.color_dark}>
              {translate('edit_profile')}
            </Title>
          </Body>
        </Header>

        {this._renderComponent()}
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
  form_view: {
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
  btn_primary: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
  btn_text: {
    padding: 10,
    alignItems: 'center',
  },
});

export default EditAccount;
