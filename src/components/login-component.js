// import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Content, Form, Header, Icon, Input, Item, Left, Right, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
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

  logIn = () => {
    // this.props.allowLogin = true;
    console.log('Logging in');
  };

  // <View style={styles.container}>
  //     <View style={styles.header}>
  //         <View style={styles.flex_header}>
  //             <View style={styles.header_left}>
  //                 <View style={styles.header_left_icon}>
  //                     <FontAwesomeIcon icon={ faChevronLeft } />
  //                 </View>

  //                 <View style={styles.header_left_text}>
  //                     <Text style={styles.back_btn}>Back</Text>
  //                 </View>
  //             </View>

  //             <View style={styles.header_center}>
  //                 <Text style={styles.app_name}>CoffiDa</Text>
  //             </View>

  //             {/* <View style={styles.header_right}> */}
  //                 <TouchableOpacity
  //                     disabled={this.state.allowLogin}
  //                     style={[ styles.login_btn, this.state.allowLogin ? styles.btn_disabled : '' ]}
  //                     onPress={() => this.logIn()}>
  //                     <Text style={styles.login_text}>Log In</Text>
  //                 </TouchableOpacity>
  //             {/* </View> */}
  //         </View>
  //     </View>

  //     <View style={styles.body}>
  //         <TextInput style={styles.input} placeholder="Email" onChangeText={this.handleEmailInput} value={this.state.email} />
  //         <TextInput style={styles.input} placeholder="Password" onChangeText={this.handlePasswordlInput} value={this.state.password} />
  //         <View style={styles.forgot_pass}>
  //             <Text style={styles.text}>Forgot Password?</Text>
  //         </View>
  //     </View>

  // </View>
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>

          <Body>
            <Title>CoffiDa</Title>
          </Body>

          <Right>
            <Button transparent>
              <Icon name="Log In" />
            </Button>
          </Right>
        </Header>

        <Content>
          <Form>
            <Item style={styles.item}>
              <Input style={styles.input} placeholder="Username" />
            </Item>

            <Item style={styles.item} last>
              <Input style={styles.input} placeholder="Password" />
            </Item>
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
    // backgroundColor: 'blue',
    height: 50,
    // flex: 1,
    // flexDirection: 'row',
    borderBottomWidth: 0.5,
    // borderBottomColor: '#313638',
    // borderBottomColor: '#313638',
  },
  flex_header: {
    // backgroundColor: 'green',
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    // borderBottomColor: '#313638',
  },
  header_left: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'yellow',
    justifyContent: 'center',
  },
  header_left_icon: {
    // flex: 1,
    justifyContent: 'flex-end',
  },
  header_left_text: {
    // flex: 1,
    justifyContent: 'flex-start',
  },
  header_center: {
    // backgroundColor: '#F06543',
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
    // color: 'grey',
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
    // flex: 50,
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
});

export default Login;
