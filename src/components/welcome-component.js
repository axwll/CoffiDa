import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

class Welcome extends Component {
  render() {
    const navigation = this.props.navigation;

    return (
      <View style={styles.container}>
        <Text style={styles.title_dark}>
          Coffi<Text style={styles.title_primary}>Da</Text>
        </Text>
        <Text style={styles.heading_dark}>Welcome</Text>
        <Text style={styles.text_dark}>
          You're only a couple of steps away from coffee!
        </Text>
        <Text style={styles.text_primary}>Already have an account?</Text>

        <View style={styles.btn_view}>
          <TouchableOpacity
            style={styles.btn_primary}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btn_text}>Log in</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.text_primary}>New to CoffiDa? Sign up.</Text>

        <View style={styles.btn_view}>
          <TouchableOpacity
            style={styles.btn_secondary}
            onPress={() => navigation.navigate('Signup')}>
            <View style={styles.btn_icon_view}>
              <FontAwesomeIcon icon={faEnvelope} />
            </View>
            <View style={styles.btn_text_view}>
              <Text style={styles.btn_text_light}>Sign up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#E0DFD5',
  },
  title_dark: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#313638',
  },
  title_primary: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F06543',
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
  },
  btn_view: {
    padding: 10,
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
  btn_secondary: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#313638',
    backgroundColor: '#E0DFD5',
    padding: 20,
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
  },
  btn_text_light: {
    padding: 10,
    color: '#313638',
    textAlign: 'center',
  },
  btn_icon_view: {
    flex: 1,
  },
  btn_text_view: {
    flex: 99,
  },
});

export default Welcome;
