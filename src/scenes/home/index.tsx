import React, { useEffect, useState } from 'react';
import { View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommissionsList } from '../commissions';
import { home as style } from '../../styles';
import { SessionManager, NotificationManager } from '../../managers';

Icon.loadFont();

interface HomeProps {
  navigation: any;  // Specify a more accurate type if possible
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [focusUnsubscribe, setFocusUnsubscribe] = useState<any>(null);  // Specify a more accurate type if possible

  useEffect(() => {
    const navOptions = {
      title: 'Comisiones',
    };
    navigation.setOptions(navOptions);
    const unsubscribe = navigation.addListener('focus', () => {
      NotificationManager.getInstance().requestPermissions();
      setFocusUnsubscribe(null);
    });
    setFocusUnsubscribe(unsubscribe);

    // Cleanup
    return () => {
      if (focusUnsubscribe) {
        focusUnsubscribe();
      }
    };
  }, [navigation, focusUnsubscribe]);

  return (
    <View style={style().view}>
      <View style={style().mainView}>
        <CommissionsList navigation={navigation} />
        <TouchableHighlight
          style={style().menuSingleContainer}
          onPress={async () => {
            const sessionManager: SessionManager | null = await SessionManager.getInstance();
            sessionManager?.clearCredentials();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Landing' }],
            });
          }}
        >
          <View style={style().menuItem}>
            <Icon style={{
              fontSize: 20,
              color: 'white',
            }} name="logout" />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Home;
