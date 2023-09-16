import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {roundedButton as style} from '../styles';

export interface RoundedButtonProps {
  text?: string;
  enabled?: boolean;
  onPress?: () => void;
  style?: object;
}

export default class RoundedButton extends Component<RoundedButtonProps> {
  public static defaultProps = {
    text: 'Button',
    enabled: true,
    onPress: () => Alert.alert('Pre-registro'),
    style: style.DefaultPropStyle,
  };

  render() {
    return (
      <View style={[style.MainContainer, this.props.style]}>
        <TouchableOpacity
          style={
            this.props.enabled
              ? style.EnabledSubmitButtonStyle
              : style.DisabledSubmitButtonStyle
          }
          activeOpacity={style.DisabledSubmitButtonStyle.opacity}
          disabled={!this.props.enabled}
          onPress={this.props.onPress}>
          <Text
            style={[
              style.TextStyle,
              {
                color: this.props.style.tintColor,
                fontSize: this.props.style.fontSize,
                fontFamily: this.props.style.fontFamily,
                fontWeight: this.props.style.fontWeight,
              },
            ]}>
            {this.props.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
