import {faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {translate} from '../locales';

class Welcome extends Component {
  render() {
    const navigation = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.header_view}>
          <Text style={styles.title_primary}>Coffi</Text>
          <Text style={styles.title_dark}>Da</Text>
        </View>

        <View style={styles.page_body}>
          <View style={styles.sub_heading_view}>
            <Text style={styles.heading_dark}>{translate('welcome_text')}</Text>
            <Text style={styles.text_dark}>{translate('welcome_subtext')}</Text>
          </View>

          <View style={styles.login_view}>
            <Text style={styles.text_primary}>
              {translate('account_already')}
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.btn_primary]}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.btn_text}>{translate('login')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signup_view}>
            <View>
              <Text style={styles.text_primary}>{translate('new_here')}</Text>
              <TouchableOpacity
                style={[styles.button, styles.btn_secondary]}
                onPress={() => navigation.navigate('Signup')}>
                <View style={styles.btn_icon_view}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </View>
                <View style={styles.btn_text_view}>
                  <Text style={styles.btn_text_light}>
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
    backgroundColor: '#E0DFD5',
    justifyContent: 'center',
  },
  header_view: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title_primary: {
    color: '#F06543',
    fontSize: 50,
    fontFamily: 'Pacifico-Regular',
  },
  title_dark: {
    color: '#313638',
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
    color: '#313638',
  },
  text_dark: {
    textAlign: 'center',
    fontSize: 16,
    color: '#313638',
  },
  text_primary: {
    textAlign: 'center',
    fontSize: 14,
    color: '#F06543',
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
  btn_primary: {
    borderColor: '#F06543',
    backgroundColor: '#F06543',
  },
  btn_text: {
    padding: 10,
    color: '#FFFFFF',
    alignItems: 'center',
  },
  btn_secondary: {
    borderColor: '#313638',
    backgroundColor: '#E0DFD5',
    padding: 20,
    flex: 1,
    flexDirection: 'row',
  },
  btn_text_light: {
    padding: 10,
    color: '#313638',
    textAlign: 'center',
  },
  btn_icon_view: {
    position: 'absolute',
    left: 10,
  },
});

export default Welcome;
