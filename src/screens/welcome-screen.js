import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { translate } from '../locales';
import ThemeProvider from '../utils/theme-provider';

/**
 * Welcome Screen. First page users see and navigates to either Log In or Sign Up
 */
class Welcome extends Component {
  render() {
    const themeStyles = ThemeProvider.getTheme();
    const { navigation } = this.props;

    return (
      <View style={[styles.container, themeStyles.alt_background_color]}>
        <View style={styles.header_view}>
          <Text style={[styles.title, themeStyles.color_primary]}>Coffi</Text>
          <Text style={[styles.title, themeStyles.color_dark]}>Da</Text>
        </View>

        <View style={styles.page_body}>
          <View style={styles.sub_heading_view}>
            <Text style={[styles.heading_dark, themeStyles.color_dark]}>
              {translate('welcome_text')}
            </Text>
            <Text style={[styles.text_dark, themeStyles.color_dark]}>
              {translate('welcome_subtext')}
            </Text>
          </View>

          <View style={styles.login_view}>
            <Text style={[styles.text, themeStyles.color_primary]}>
              {translate('account_already')}
            </Text>
            <TouchableOpacity
              style={[styles.button, themeStyles.primary_button_color]}
              onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.btn_text, themeStyles.color_light]}>
                {translate('login')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signup_view}>
            <View>
              <Text style={[styles.text, themeStyles.color_primary]}>
                {translate('new_here')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.btn_secondary,
                  themeStyles.alt_background_color,
                ]}
                onPress={() => navigation.navigate('Signup')}>
                <View style={styles.btn_icon_view}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </View>
                <View>
                  <Text style={[styles.btn_text, themeStyles.color_dark]}>
                    {translate('signup')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header_view: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 50,
    fontFamily: 'Pacifico-Regular',
  },
  page_body: {
    flex: 2,
    justifyContent: 'center',
  },
  sub_heading_view: {
    flex: 1,
    marginBottom: 50,
    justifyContent: 'flex-end',
  },
  heading_dark: {
    textAlign: 'center',
    fontSize: 24,
  },
  text_dark: {
    textAlign: 'center',
    fontSize: 16,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  login_view: {
    flex: 1,
    padding: 10,
  },
  signup_view: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
  },
  button: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
  btn_text: {
    padding: 10,
    textAlign: 'center',
  },
  btn_secondary: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
  },
  btn_icon_view: {
    position: 'absolute',
    left: 10,
  },
});

export default Welcome;
