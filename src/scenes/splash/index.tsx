import React, { useEffect } from 'react';
import { View } from 'react-native';
import SessionManager from '../../managers/sessionManager';
import { Loading } from '../../components';
import { useAppDispatch } from '../../hooks';
import { usersRepository } from '../../repositories';
import { fetchUserDataAsync } from '../../features/userDataSlice';
import { getStyleSheet as style } from '../../styles'
import { makeRequest } from '../../networking/makeRequest';

interface Props {
  navigation: any;
}

const Splash = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      const sessionInstance: SessionManager = await SessionManager.getInstance()!
      if (sessionInstance) {
        await sessionInstance.getCredentials();
        const loggedIn = sessionInstance.isLoggedIn();

        if (loggedIn) {
          const user = await makeRequest(usersRepository.getInfo, navigation);
          dispatch(fetchUserDataAsync(user));
        }

        navigation.replace(loggedIn ? 'RootDrawer' : 'Landing');
      }
    };

    init();
  }, [navigation]);

  return (
    <View style={style().view}>
      <Loading />
    </View>
  );
};

export default Splash;
