import 'react-native-gesture-handler';

import React, { Component } from 'react';

import Nav from './src/navigations/app-navigator';
import AuthNav from './src/navigations/auth-navigator';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
    };
  }

  checkIfTokenExists() {
    // const value = await AsyncStoage.getItem('@session_token');
    // if (!value) {
    //     return;
    // }
    this.state.token = '';
  }

  render() {
    if (!this.state.token) {
      return <Nav />;
    } else {
      return <AuthNav />;
    }
  }
}

export default App;
