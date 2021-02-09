import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Body,
  Button,
  Container,
  Content,
  Form,
  Header,
  Input,
  Item,
  Left,
  Title,
} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {translate} from '../../../locales';
import {getItem} from '../../common/async-storage-helper';

let editType = null;
let userInfo = null;

class EditAccount extends Component {
  constructor(props) {
    super(props);

    editType = this.props.navigation.getParam('type');
    userInfo = this.props.navigation.getParam('userInfo');

    this.state = {
      email: userInfo.email,
      emailError: false,
      password: '',
      passwordError: false,
      submitted: false,
    };
  }

  async componentDidMount() {
    this.setState({token: await getItem('AUTH_TOKEN')});
  }

  handleEmailInput = (email) => {
    // Validation
    this.setState({email: email});
  };

  handlePasswordlInput = (password) => {
    if (password.length < 5) {
      this.setState({passwordError: true});
      return;
    }

    this.setState({password: password});
  };

  handlePasswordlConformation = (password) => {
    if (password !== this.state.password) {
      this.setState({passwordError: true});
      return;
    }

    this.setState({passwordError: false});
  };

  updateEmail = () => {
    if (this.state.emailError) {
      return;
    }

    this.updateUserInfo({email: this.state.email});
  };

  resetPassword = () => {
    if (this.state.passwordError) {
      return;
    }

    this.updateUserInfo({password: this.state.password});
  };

  updateUserInfo = (data) => {
    this.setState({submitted: true});

    const userId = userInfo.user_id;
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-Authorization': this.state.token,
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
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
            <Title style={styles.title}>{translate('edit_profile')}</Title>
          </Body>
        </Header>

        <Content padder style={styles.content}>
          <Text>{this.state.emailError}</Text>
          <Text>{this.state.passwordError}</Text>
          <Text>{this.state.submitted}</Text>
          {editType === 'email' ? (
            <Form>
              <Item style={styles.item} last>
                <Input
                  style={styles.input}
                  value={this.state.email}
                  onChangeText={this.handleEmailInput}
                />
              </Item>

              <TouchableOpacity
                style={styles.btn_primary}
                onPress={() => this.updateEmail()}>
                <Text style={styles.btn_text}>{translate('update_email')}</Text>
              </TouchableOpacity>
            </Form>
          ) : (
            <Form>
              <Item style={styles.item}>
                <Input
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={this.handlePasswordlInput}
                />
              </Item>

              <Item style={styles.item} last>
                <Input
                  style={styles.input}
                  placeholder="Confirm Password"
                  onChangeText={this.handlePasswordlConformation}
                />
              </Item>

              {this.state.passwordError && (
                <View style={styles.error_text}>
                  <Text>Passwords do not match</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.btn_primary}
                onPress={() => this.resetPassword()}>
                <Text style={styles.btn_text}>
                  {translate('reset_password')}
                </Text>
              </TouchableOpacity>
            </Form>
          )}
        </Content>
      </Container>
    );
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

export default EditAccount;
