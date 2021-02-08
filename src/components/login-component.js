import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Content, Form, Header, Input, Item, Left, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { setItem } from './common/async-storage-helper';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      data: null,
    };
  }

  handleEmailInput = (email) => {
    // Validate email
    this.setState({email: email});
  };

  handlePasswordlInput = (password) => {
    // Validate password
    this.setState({password: password});
  };

  logInEvent = async () => {
    await this.logIn();
    if (this.state.data) {
      await this.getUserInfo();
    }
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
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          data: responseJson,
        });
        setItem('AUTH_TOKEN', responseJson.token);
      })
      .catch((error) => {
        console.log(error.status);
        // response.status
        console.log('err');
        console.log(error);
      });
  };

  getUserInfo = async (userId) => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + this.state.data.id, {
      headers: {
        'x-Authorization': this.state.data.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setItem('USER_DATA', JSON.stringify(responseJson));
      })
      .catch((error) => {
        console.log(error.status);
        // response.status
        console.log('err');
        console.log(error);
      });
  };

  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={'#F06543'}
                onPress={() => navigation.goBack()}
              />
            </Button>
          </Left>

          <Body>
            <Title>Log In</Title>
          </Body>
        </Header>

        <Content>
          <Form>
            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder="Email"
                onChangeText={this.handleEmailInput}
              />
            </Item>

            <Item style={styles.item} last>
              <Input
                style={styles.input}
                placeholder="Password"
                onChangeText={this.handlePasswordlInput}
              />
            </Item>

            <TouchableOpacity
              style={styles.btn_primary}
              onPress={() => this.logInEvent()}>
              <Text style={styles.btn_text}>Log In</Text>
            </TouchableOpacity>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0DFD5',
  },
  header: {
    height: 50,
    borderBottomWidth: 0.5,
  },
  flex_header: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
  },
  header_left: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'yellow',
    justifyContent: 'center',
  },
  header_left_icon: {
    justifyContent: 'flex-end',
  },
  header_left_text: {
    justifyContent: 'flex-start',
  },
  header_center: {
    flex: 4,
    alignItems: 'center',
  },
  app_name: {
    textAlign: 'center',
    fontSize: 20,
  },
  header_right: {
    backgroundColor: 'purple',
    flex: 1,
    alignItems: 'flex-end',
  },
  login_btn: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: 'green',
  },
  btn_disabled: {
    color: 'red',
    backgroundColor: 'red',
  },
  body: {
    flex: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  item: {
    borderBottomWidth: 0,
  },
  input: {
    width: '75%',
    margin: 10,
    padding: 10,
    paddingLeft: 20,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  forgot_pass: {
    left: 0,
  },
  text: {
    marginTop: 10,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  test: {
    backgroundColor: 'red',
  },
  btn_primary: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F06543',
    backgroundColor: '#F06543',
    borderRadius: 5,
  },
  btn_text: {
    padding: 10,
    color: '#FFFFFF',
    alignItems: 'center',
  },
});

export default Login;
