import React, { useState, useCallback } from 'react';
import { Alert, View } from 'react-native';
import { authorize } from 'react-native-app-auth';
import { RoundedButton } from '../../components';
import SessionManager from '../../managers/sessionManager';
import { authenticationRepository, usersRepository } from '../../repositories';
import { landing as style } from '../../styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type LandingProps = {
  navigation: StackNavigationProp<any, 'Landing'>;
  route: RouteProp<any, 'Landing'>;
};

const Landing: React.FC<LandingProps> = ({ navigation }) => {
  const [loginInProgress, setLoginInProgress] = useState(false);

  const onPressLogin = useCallback(async () => {
    setLoginInProgress(true);
    const redirectUrl = 'org.erinc.lodu://oauth';
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
      const { authorizationCode } = await authorize(config);
      const response = await authenticationRepository.login(authorizationCode, redirectUrl);
      const sessionManager: SessionManager = await SessionManager.getInstance()!;
      if (sessionManager) {
        sessionManager.saveCredentials(response);
        const user = await usersRepository.getInfo();
        if (!user.isTeacher()) {
          sessionManager.clearCredentials();
          throw new authenticationRepository.NotATeacher();
        }
        setLoginInProgress(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'RootDrawer' }],
        });
      }

    } catch (error) {
      if (error instanceof authenticationRepository.NotATeacher) {
        showRoleError();
      } else if (!isCancellationError(error)) {
        showGenericError();
      }
      setLoginInProgress(false);
    }
  }, [navigation]);

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
        onPress={onPressLogin}
      />
    </View>
  );
};

export default Landing;

/// Cancellation includes, not giving permission to log in with OAuth provider
/// and cancelling flow after giving permission.
function isCancellationError(error: any): boolean {
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
