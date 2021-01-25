import React, { Component } from 'react';
import { View } from 'react-native';

import Login from './src/components/Login';
import User from './src/components/User';

class HellowWorld extends Component {
    render() {
        return (
            <View>
                <User name="Max" email="maxj131@hotmail.com"/>
                {/* <User name="Maxwell" email="maxwell.johnson@realitymine.com"/> */}
                {/* <User name="Macks" email="maxj131@gmail.com"/> */}
                <Login />
            </View>
        );
    }
}

export default HellowWorld;
