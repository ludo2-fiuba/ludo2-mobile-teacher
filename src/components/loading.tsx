import React from 'react';
import { View, ActivityIndicator, ViewStyle } from 'react-native';
import { getStyleSheet as defaultStyle } from '../styles';

interface Props {
  style?: ViewStyle;
}

const Loading: React.FC<Props> = ({ style }) => {
  return (
    <View style={[defaultStyle().loading, style]}>
      <ActivityIndicator size="large" color={defaultStyle().loading.color} />
    </View>
  );
};

export default Loading;