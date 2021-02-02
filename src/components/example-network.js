import React, { Component } from 'react';
import { Text, View } from 'react-native';

class Example extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
    };
  }

  componentDidMount() {
    // Happens before the page renders
    this.get();
  }

  get() {
    return fetch('http://10.0.0.2:3333/login')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          data: responseJson,
        });
      })
      .catch((error) => {
        // response.status
        console.log(error);
      });
  }

  logIn = () => {
    console.log('Logging in');
  };

  render() {
    if (this.state.loading) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    } else {
      return (
        <View>
          <View>
            <FlatList data={this.state.data} renderItem={renderItem} />
          </View>
        </View>
      );
    }
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

export default Example;
