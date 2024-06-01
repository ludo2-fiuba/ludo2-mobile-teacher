import React, { useState, useCallback } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { authorize } from 'react-native-app-auth';
import { RoundedButton } from '../../components';
import SessionManager from '../../managers/sessionManager';
import { authenticationRepository, usersRepository } from '../../repositories';
import { landing as style } from '../../styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { lightModeColors } from '../../styles/colorPalette';
const LudoIcon = require('../../assets/ludo_icon.png');

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
        console.log('User info', user);

        if (!user.isTeacher()) {
          sessionManager.clearCredentials();
          throw new authenticationRepository.NotATeacher();
        }
        setLoginInProgress(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'RootDrawer' }],
        });
      } else {
        console.log("No se pudo obtener el sessionManager");
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
      <View style={styles.card}>
        <View style={styles.cardItem}>
          <Image source={LudoIcon} style={{ width: 120, height: 120 }} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.cardTitle}>LODU</Text>
            <Text style={{ ...styles.cardLabel, marginTop: 7 }}>La Organizadora para</Text>
            <Text style={{ ...styles.cardLabel, marginTop: 5 }}>el Docente Universitario</Text>
          </View>
        </View>
      </View>
      <View style={{ width: '90%', marginBottom: 8 }}>
        <RoundedButton
          text="Pre-registro"
          enabled={!loginInProgress}
          onPress={() => navigation.navigate('PreRegister')}
        />
      </View>
      <View style={{ width: '90%' }}>
        <RoundedButton
          text="Iniciar sesión"
          enabled={!loginInProgress}
          onPress={onPressLogin}
        />
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: 'column',
    marginBottom: 28,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    gap: 18
  },
  cardItem: {
    flexDirection: 'row',
    margin: 18,
    alignItems: 'center',
    gap: 14
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightModeColors.institutional,
  },
  cardLabel: {
    fontSize: 18,
    color: 'gray',
  },
});
