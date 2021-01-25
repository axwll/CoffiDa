import React, { Component } from 'react';
import { Text, View } from 'react-native';

class User extends Component {
    render() {
        return (
            <View>
                <Text>Name: {this.props.name}</Text>
                <Text>Email: {this.props.email}</Text>
            </View>
        );
    }
}

export default User;
