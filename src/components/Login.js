import React, { Component } from 'react';
import { TextInput, View } from 'react-native';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        };
    }

    handleEmailInput = (email) => {
        // Validate email
        this.setState({email: email});
    }

    handlePasswordlInput = (password) => {
        // Validate password
        this.setState({password: password});
    }

    render() {
        return (
            <View>
                <TextInput placeholder="Enter an email.." onChangeText={this.handleEmailInput} value={this.state.email} />
                <TextInput placeholder="Enter a password.." onChangeText={this.handlePasswordlInput} value={this.state.password} />
            </View>
        );
    }
}

export default Login;
