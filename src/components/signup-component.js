import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, CheckBox, Container, Content, Form, Header, Input, Item, Left, Text } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

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

  // handleEmailInput = (email) => {
  //     // Validate email
  //     this.setState({email: email});
  // }

  handlePasswordlInput = (password) => {
    // Validate password
    this.setState({password: password});
  };

  signUp = () => {
    // this.props.allowLogin = true;
    console.log('Signing up');
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
              <Input style={styles.input} placeholder="Email" />
            </Item>

            <Item style={styles.item}>
              <Input style={styles.input} placeholder="First Name" />
            </Item>

            <Item style={styles.item} last>
              <Input style={styles.input} placeholder="Last Name" />
            </Item>

            <Item style={styles.item} last>
              <Input style={styles.input} placeholder="Password" />
            </Item>

            <Text style={styles.checkbox}>
              I agree to the Terms & conditions
              <CheckBox checked={true} />
            </Text>

            <TouchableOpacity
              style={styles.btn_primary}
              onPress={() => this.signUp()}>
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
