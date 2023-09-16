import React, {Component} from 'react';
import {View, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CommissionsList} from '../commissions';
import {home as style} from '../../styles';
import {SessionManager, NotificationManager} from '../../managers';

Icon.loadFont();

export default class Home extends Component {
  componentDidMount() {
    const navOptions = {
      title: 'Comisiones',
    };
    this.props.navigation.setOptions(navOptions);
    this._focusUnsubscribe = this.props.navigation.addListener('focus', () => {
      NotificationManager.getInstance().requestPermissions();
      this._focusUnsubscribe = null;
    });
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={style().view}>
        <View style={style().mainView}>
          <CommissionsList navigation={navigation} />
          <TouchableHighlight
            style={style().menuSingleContainer}
            onPress={async () => {
              await SessionManager.getInstance().clearCredentials();
              navigation.reset({
                index: 0,
                routes: [{name: 'Landing'}],
              });
            }}>
            <View style={style().menuItem}>
              <Icon style={style().itemIcon} name="logout" />
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
