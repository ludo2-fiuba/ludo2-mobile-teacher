import React, { useEffect } from 'react';
import { View } from 'react-native';
import SessionManager from '../../managers/sessionManager';
import { Loading } from '../../components';

interface Props {
  navigation: any;
}

const Splash = ({ navigation }: Props) => {
  useEffect(() => {
    const init = async () => {
      const sessionInstance: SessionManager = await SessionManager.getInstance()! 
      if (sessionInstance) {
        sessionInstance.getCredentials();
        const loggedIn = sessionInstance.isLoggedIn();
        navigation.replace(loggedIn ? 'RootDrawer' : 'Landing');
      }
    };

    init();
  }, [navigation]);

  return (
    <View>
      <Loading />
    </View>
  );
};

export default Splash;