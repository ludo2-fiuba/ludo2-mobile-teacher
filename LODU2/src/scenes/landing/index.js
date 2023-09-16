import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { authorize } from 'react-native-app-auth';
import { RoundedButton } from '../../components';
import SessionManager from '../../managers/sessionManager';
import { authenticationRepository, usersRepository } from '../../repositories';
import { landing as style } from '../../styles';

export default class Landing extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loginInProgress: false,
    };
  }

  render() {
    const {navigation} = this.props;
    const {loginInProgress} = this.state;
    const redirectUrl = 'org.erinc.lodu://oauth';
    return (
      <View style={style().view}>
        <RoundedButton
          text="PRE-REGISTRO"
          style={style().button}
          enabled={!loginInProgress}
          onPress={() => navigation.navigate('PreRegister')}
        />
        <RoundedButton
          text="LOGIN"
          style={style().button}
          enabled={!loginInProgress}
          onPress={async () => {
            this.setState({loginInProgress: true});
            // We could directly get the token using PKCE flow,
            // but we can't make it work withput using the cleintSecret.
            const config = {
              issuer: 'https://auth.fi.uba.ar/',
              clientId: 'ed6fdc77-51b0-4828-be5d-37d23d1b6880',
              redirectUrl,
              scopes: ['openid', 'profile', 'email'],
              response_type: 'code',
              skipCodeExchange: true,
              usePKCE: false,
              additionalParameters: {},
            };
            try {
              const {authorizationCode} = await authorize(config);
              const response = await authenticationRepository.login(
                authorizationCode,
                redirectUrl,
              );
              await SessionManager.getInstance().saveCredentials(response);
              const user = await usersRepository.getInfo();
              if (!user.isTeacher()) {
                await SessionManager.getInstance().clearCredentials();
                throw new authenticationRepository.NotATeacher();
              }
              this.setState({loginInProgress: false});
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            } catch (error) {
              if (error instanceof authenticationRepository.NotATeacher) {
                showRoleError();
              } else if (!isCancellationError(error)) {
                showGenericError();
              }
              this.setState({loginInProgress: false});
            }
          }}
        />
      </View>
    );
  }
}

/// Cancellation includes, not giving permission to log in with OAuth provider
/// and cancelling flow after giving permission.
function isCancellationError(error) {
  return (
    error.message === 'User cancelled flow' || // Happens in Android when closing browser.
    error.message ===
      'The operation couldn’t be completed. (org.openid.appauth.general error -3.)'
  );
}

function showGenericError() {
  Alert.alert('Error', 'Chequeá que hayas ingresado correctamente tus datos.');
}

function showRoleError() {
  Alert.alert(
    'Error',
    '¿Te has registrado? ' +
      'Te recordamos que esta app es para docentes. Si lo sos, ' +
      'chequeá que hayas ingresado correctamente tus datos.',
  );
}
