import React, {Component} from 'react';
import {DarkModeContext} from 'react-native-dynamic';

import {darkStyles} from '../styles/dark-styles';
import {lightStyles} from '../styles/light-styles';

class Theme extends Component {
  getTheme = () => {
    if (this.context === 'dark') {
      return darkStyles;
    }

    return lightStyles;
  };

  static contextType = DarkModeContext;
}

const ThemeProvider = new Theme();
export default ThemeProvider;
