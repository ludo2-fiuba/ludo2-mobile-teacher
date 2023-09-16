import React, {Component} from 'react';
import {View, Text} from 'react-native';
import SessionManager from '../../managers/sessionManager';
import {splash} from '../../styles';

export default class Splash extends Component {
  async componentDidMount() {
    await SessionManager.getInstance().getCredentials();
    const {navigation} = this.props;
    const loggedIn = SessionManager.getInstance().isLoggedIn();
    navigation.replace(loggedIn ? 'Home' : 'Landing');
  }

  render() {
    return (
      <View style={splash().view}>
        <Text style={splash().title}>LODU</Text>
        <Text style={splash().subtitle}>
          La Organizadora
          {'\n'}
          para el
          {'\n'}
          Docente Universitario
        </Text>
      </View>
    );
  }
}
