// Tweaked from https://github.com/omulet/react-native-radial-menu

import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {getStyleSheet as style} from '../styles';

export default class Loading extends Component {
  render() {
    return (
      <View style={style().loading}>
        <ActivityIndicator size="large" color={style().loading.color} />
      </View>
    );
  }
}
