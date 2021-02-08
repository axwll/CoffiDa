import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, CheckBox, Container, Content, Form, Header, Input, Item, Left, Text } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { setItem } from './common/async-storage-helper';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      allowLogin: false,
    };
  }

  handleEmailInput = (email) => {
    // Validate email
    this.setState({email: email});
  };

  handleFirstNameInput = (firstName) => {
    // Validate email
    this.setState({firstName: firstName});
  };

  handleLastNameInput = (lastName) => {
    // Validate email
    this.setState({lastName: lastName});
  };

  handlePasswordlInput = (password) => {
    // Validate password
    this.setState({password: password});
  };

  signUpEvent = async () => {
    await this.signUp();
    if (this.state.user_id) {
      await this.logIn();
      await this.getUserInfo();
    }
    this.props.navigation.navigate('App');
  };

  signUp = async () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          userId: responseJson.user_id,
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
      <Container style={styles.container}>
        <Header style={styles.container}>
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
        </Header>

        <Content style={styles.content}>
          <Form>
            <Item style={styles.item} last>
              <Input
                style={styles.input}
                placeholder="Email"
                onChangeText={this.handleEmailInput}
              />
            </Item>

            <Item style={styles.item}>
              <Input
                style={styles.input}
                placeholder="First Name"
                onChangeText={this.handleFirstNameInput}
              />
            </Item>

            <Item style={styles.item} last>
              <Input
                style={styles.input}
                placeholder="Last Name"
                onChangeText={this.handleLastNameInput}
              />
            </Item>

            <Item style={styles.item} last>
              <Input
                style={styles.input}
                placeholder="Password"
                onChangeText={this.handlePasswordlInput}
              />
            </Item>

            <Text style={styles.checkbox}>
              I agree to the Terms & conditions
              <CheckBox checked={true} />
            </Text>

            <TouchableOpacity
              style={styles.btn_primary}
              onPress={() => this.signUpEvent()}>
              <Text style={styles.btn_text}>Sign up</Text>
            </TouchableOpacity>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0DFD5',
  },
  header: {
    backgroundColor: '#E0DFD5',
    height: 50,
    borderBottomWidth: 0.5,
  },
  header_left: {
    // flex: 1,
    // alignItems: 'flex-start',
    // flexDirection: 'row',
    backgroundColor: 'yellow',
    // justifyContent: 'center',
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
  checkbox: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
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

export default Signup;
