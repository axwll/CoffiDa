import React, {Component} from 'react';
import {DarkModeContext} from 'react-native-dynamic';

import {darkStyles} from '../styles/dark-styles';
import {lightStyles} from '../styles/light-styles';

class Theme extends Component {
  static contextType = DarkModeContext;

  constructor(props) {
    super(props);
  }

  getTheme = () => {
    if (this.context === 'dark') {
      return darkStyles;
    } else {
      return lightStyles;
    }
  };
}

const ThemeProvider = new Theme();
export default ThemeProvider;
