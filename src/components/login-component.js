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
import {setItem} from './common/async-storage-helper';
import {validateEmail, validatePassword} from './common/validator';

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

  handleEmailInput = (email) => {
    const response = validateEmail(email);
    console.log(response);

    if (!response.status) {
      this.setState({
        validEmail: false,
        emailErrorText: response.error,
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
    const response = validatePassword(password);

    if (!response.status) {
      this.setState({
        validPassword: false,
        passwordErrorText: response.error,
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
    console.log(this.state.email);

    if (!this.state.email || !this.state.password) {
      this.handleEmailInput(this.state.email);
      this.handlePasswordlInput(this.state.password);
      return;
    }

    if (!this.state.validEmail || !this.state.validPassword) {
      return;
    }

    await this.logIn();

    this.props.navigation.navigate('App');
  };

  logIn = async () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((responseJson) => {
        setItem('AUTH_TOKEN', responseJson.token);
        setItem('USER_ID', responseJson.id.toString());
      })
      .catch((error) => {
        console.log(error);
      });
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
            <Title style={styles.title}>Log In</Title>
          </Body>
        </Header>

        <Form style={styles.form}>
          <Item>
            <Input
              style={styles.input}
              placeholder="Email"
              onChangeText={this.handleEmailInput}
            />
          </Item>
          {!this.state.validEmail && this.state.submitted && (
            <View>
              <Text style={styles.error_text}>{this.state.emailErrorText}</Text>
            </View>
          )}

          <Item>
            <Input
              style={styles.input}
              placeholder="Password"
              onChangeText={this.handlePasswordlInput}
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

          <TouchableOpacity
            style={[styles.button, styles.btn_primary]}
            onPress={() => this.logInEvent()}>
            <Text style={styles.btn_text}>{translate('login')}</Text>
          </TouchableOpacity>
        </Form>
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
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    margin: 10,
    marginLeft: 0,
    paddingLeft: 20,
    borderWidth: 0.5,
    borderRadius: 5,
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

export default Login;
